#!/usr/bin/env node
// run-external-agent.mjs — send a prompt to the Claude Code CLI and/or the
// Gemini CLI as external, read-only subagents, and print a structured JSON
// result. Bundled with the ask-agents skill; needs no files outside this
// skill folder.
//
// Requirements: Node.js 18+, plus the "claude" and/or "gemini" CLI installed,
// signed in, and reachable on your PATH.
//
// Usage:
//   node run-external-agent.mjs --agent claude --prompt "..."
//   node run-external-agent.mjs --agent gemini --prompt "..."
//   node run-external-agent.mjs --agent both   --prompt "..."
//
// Defaults: cwd = the folder you run it from; timeout 300s; output cap 50KB;
// Claude caps: 8 turns, $2 budget. Run records go to your system temp folder.

import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import { mkdir, readFile, realpath, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve our own location from import.meta.url so nothing depends on where
// the skill folder was installed.
const SCRIPT_PATH = fileURLToPath(import.meta.url);

const DEFAULT_STATE_ROOT = path.join(os.tmpdir(), "ask-agents-runs");
const MAX_OUTPUT_BYTES = 200000;
const DEFAULT_MAX_OUTPUT_BYTES = 50000;
const DEFAULT_TIMEOUT_SECONDS = 300;
const MIN_TIMEOUT_SECONDS = 10;
const SNAPSHOT_MAX_FILES = 5000;
const SNAPSHOT_HASH_MAX_BYTES = 1024 * 1024;
const FIRST_BYTE_TIMEOUT_MS = 120000;

const activeChildren = new Map();
let shuttingDown = false;

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
setInterval(() => {
  if (process.ppid === 1 && activeChildren.size > 0) shutdown("SIGTERM");
}, 250).unref();

let options;
try {
  options = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  usage();
  process.exit(2);
}
if (!["claude", "gemini", "both"].includes(options.agent) || !hasUsablePrompt(options)) {
  usage();
  process.exit(2);
}

const invocationId = options.invocationId || `ask_agents_${new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15)}_${randomUUID().slice(0, 8)}`;
const stateDir = path.resolve(options.stateDir || path.join(DEFAULT_STATE_ROOT, "invocations", invocationId));
await mkdir(stateDir, { recursive: true, mode: 0o700 });

const cwd = await resolveCwd(options.cwd);
const agents = options.agent === "both" ? ["claude", "gemini"] : [options.agent];
process.stderr.write(JSON.stringify({ event: "external_agent_invocation", invocation_id: invocationId, state_dir: stateDir, agents, cwd }) + "\n");

const settled = await Promise.allSettled(
  agents.map((agent) => runJob(agent, {
    ...options,
    prompt: agent === "claude" ? options.claudePrompt || options.prompt : options.geminiPrompt || options.prompt,
    cwd,
    invocationId,
    stateDir
  }))
);

const payloads = settled.map((outcome, index) => {
  if (outcome.status === "fulfilled") return outcome.value;
  return {
    external_run: false,
    agent: agents[index],
    invocation_id: invocationId,
    state: "failed",
    error: outcome.reason?.message || String(outcome.reason),
    failure_stage: "runner"
  };
});

const output = options.agent === "both" ? { invocation_id: invocationId, state_dir: stateDir, external_agents: payloads } : payloads[0];
console.log(JSON.stringify(output, null, 2));
process.exit(payloads.every((payload) => payload.state === "succeeded") ? 0 : 1);

async function runJob(agent, parsed) {
  if (shuttingDown) throw new Error("runner is shutting down");
  const runId = `${agent}_${new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15)}_${randomUUID().slice(0, 8)}`;
  const runDir = path.join(parsed.stateDir, "runs", runId);
  await mkdir(runDir, { recursive: true, mode: 0o700 });

  const contextPaths = await resolveContextPaths(parsed.cwd, parsed.context || []);

  const prompt = buildPrompt(agent, parsed.prompt, parsed.cwd, contextPaths);
  const timeoutSeconds = clampInteger(parsed.timeout, MIN_TIMEOUT_SECONDS, 1800, DEFAULT_TIMEOUT_SECONDS);
  const maxOutputBytes = clampInteger(parsed.maxOutput, 1024, MAX_OUTPUT_BYTES, DEFAULT_MAX_OUTPUT_BYTES);
  const commandInfo = await buildCommand(agent, parsed);

  const manifest = {
    id: runId,
    invocation_id: parsed.invocationId,
    agent,
    cwd: parsed.cwd,
    context_paths: contextPaths,
    state: "starting",
    started_at: new Date().toISOString(),
    timeout_seconds: timeoutSeconds,
    max_output_bytes: maxOutputBytes,
    requested_model: commandInfo.requestedModel || null,
    requested_effort: commandInfo.requestedEffort || null,
    read_only: true,
    command: {
      command: commandInfo.command,
      args: commandInfo.args.map((value) => redactForManifest(value))
    }
  };
  await writeJson(path.join(runDir, "manifest.json"), manifest);
  await writeFile(path.join(runDir, "prompt.md"), redactSecrets(prompt), { mode: 0o600 });

  const before = await snapshotWorkspace(parsed.cwd);
  await writeJson(path.join(runDir, "fs_before.json"), before.summary);
  if (before.summary.truncated || before.summary.escaping_symlinks.length) {
    return await failBeforeRun(runDir, manifest, {
      agent,
      run_id: runId,
      invocation_id: parsed.invocationId,
      cwd: parsed.cwd,
      error: before.summary.truncated
        ? "the working folder has too many files for the read-only safety check; use --cwd to point at a smaller folder"
        : "the working folder contains symlinks that point outside it, which the read-only safety check cannot cover",
      snapshot_truncated: before.summary.truncated,
      escaping_symlinks: before.summary.escaping_symlinks
    });
  }

  manifest.state = "running";
  await writeJson(path.join(runDir, "manifest.json"), manifest);
  const execution = await executeCommand(commandInfo.command, commandInfo.args, {
    cwd: parsed.cwd,
    env: sanitizedEnv(agent),
    input: prompt,
    timeoutMs: timeoutSeconds * 1000,
    maxOutputBytes,
    runDir
  });

  const after = await snapshotWorkspace(parsed.cwd);
  await writeJson(path.join(runDir, "fs_after.json"), after.summary);
  const fsDiff = diffSnapshots(before.files, after.files);
  const parsedOutput = parseAgentOutput(agent, execution.stdout, {
    requestedModel: commandInfo.requestedModel
  });
  const snapshotTruncated = before.summary.truncated || after.summary.truncated;
  const escapingSymlinks = [...before.summary.escaping_symlinks, ...after.summary.escaping_symlinks];
  const safetyPassed = fsDiff.length === 0 && !snapshotTruncated && escapingSymlinks.length === 0;
  const resultSucceeded = parsedOutput.resultSubtype ? parsedOutput.resultSubtype === "success" : true;
  const succeeded = execution.exitCode === 0 && !execution.timedOut && !execution.noFirstByte && parsedOutput.ok && resultSucceeded && safetyPassed;
  const state = execution.timedOut ? "timeout" : execution.noFirstByte ? "failed" : succeeded ? "succeeded" : "failed";

  const resultPayload = {
    external_run: true,
    agent,
    run_id: runId,
    invocation_id: parsed.invocationId,
    state,
    cwd: parsed.cwd,
    command: manifest.command,
    requested_model: commandInfo.requestedModel || null,
    requested_effort: commandInfo.requestedEffort || null,
    exit_code: execution.exitCode,
    signal: execution.signal,
    timed_out: execution.timedOut,
    no_first_byte: execution.noFirstByte,
    duration_ms: execution.durationMs,
    read_only_verification: safetyPassed ? "passed" : "failed",
    filesystem_changes: fsDiff,
    snapshot_truncated: snapshotTruncated,
    escaping_symlinks: escapingSymlinks,
    parse_status: parsedOutput.ok ? "parsed" : execution.stdout ? "partial" : "failed",
    parse_error: parsedOutput.ok ? null : parsedOutput.error,
    models_observed: parsedOutput.modelsObserved,
    model_fallback: parsedOutput.modelFallback,
    result_subtype: parsedOutput.resultSubtype,
    total_cost_usd: parsedOutput.totalCostUsd,
    stderr: truncate(redactSecrets(execution.stderr), 4000),
    partial_output_excerpt: parsedOutput.ok ? undefined : truncate(redactSecrets(execution.stdout), 4000),
    report: parsedOutput.ok ? truncate(redactSecrets(parsedOutput.text), maxOutputBytes) : null,
    run_dir: runDir,
    stdout_log: path.join(runDir, "stdout.log"),
    stderr_log: path.join(runDir, "stderr.log")
  };

  manifest.state = state;
  manifest.finished_at = new Date().toISOString();
  manifest.exit_code = execution.exitCode;
  manifest.signal = execution.signal;
  manifest.timed_out = execution.timedOut;
  manifest.read_only_verification = resultPayload.read_only_verification;
  manifest.models_observed = resultPayload.models_observed;
  manifest.model_fallback = resultPayload.model_fallback;
  manifest.result_subtype = resultPayload.result_subtype;
  manifest.total_cost_usd = resultPayload.total_cost_usd;
  await writeJson(path.join(runDir, "manifest.json"), manifest);
  await writeJson(path.join(runDir, "result.json"), resultPayload);
  if (parsedOutput.ok) await writeFile(path.join(runDir, "result.md"), redactSecrets(parsedOutput.text), { mode: 0o600 });
  return resultPayload;
}

async function failBeforeRun(runDir, manifest, details) {
  const payload = {
    external_run: false,
    agent: details.agent,
    run_id: details.run_id,
    invocation_id: details.invocation_id,
    state: "failed",
    cwd: details.cwd,
    error: details.error,
    failure_stage: "read_only_preflight",
    read_only_verification: "failed",
    filesystem_changes: [],
    snapshot_truncated: details.snapshot_truncated,
    escaping_symlinks: details.escaping_symlinks,
    parse_status: "not_run",
    report: null,
    run_dir: runDir
  };
  manifest.state = "failed";
  manifest.finished_at = new Date().toISOString();
  manifest.error = details.error;
  manifest.read_only_verification = "failed";
  await writeJson(path.join(runDir, "manifest.json"), manifest);
  await writeJson(path.join(runDir, "result.json"), payload);
  return payload;
}

async function buildCommand(agent, parsed) {
  if (agent === "gemini") {
    return {
      command: await requireCommand("gemini"),
      args: [
        "--output-format",
        "stream-json",
        "--approval-mode",
        "plan",
        "-p",
        "Execute the external-agent review prompt provided on stdin. Return a concise report."
      ]
    };
  }

  const maxTurns = clampInteger(parsed.maxTurns, 1, 20, 8);
  const maxBudgetUsd = clampNumber(parsed.maxBudget, 0.01, 10, 2);
  const requestedModel = parsed.claudeModel || "";
  const requestedEffort = parsed.claudeEffort || "";
  const args = [
    "-p",
    "--input-format",
    "text",
    "--output-format",
    "stream-json",
    // No --include-partial-messages: this is a capture wrapper that only reads
    // the final result. Partial-message envelopes (stream_event /
    // content_block_delta) are not recognized by parseAgentOutput and bloat
    // stdout, which can truncate the tail where the final result event lives —
    // surfacing as a parse failure even though the report was produced.
    "--verbose",
    "--permission-mode",
    "plan",
    "--no-session-persistence",
    "--max-turns",
    String(maxTurns),
    "--max-budget-usd",
    String(maxBudgetUsd)
  ];
  if (requestedModel) args.push("--model", requestedModel);
  if (requestedEffort) args.push("--effort", requestedEffort);
  return {
    command: await requireCommand("claude"),
    args,
    requestedModel,
    requestedEffort
  };
}

async function executeCommand(command, args, options) {
  const started = Date.now();
  return await new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let settledRun = false;
    let timedOut = false;
    let noFirstByte = false;
    let killTimer = null;
    const stdoutStream = fs.createWriteStream(path.join(options.runDir, "stdout.log"), { flags: "a", mode: 0o600 });
    const stderrStream = fs.createWriteStream(path.join(options.runDir, "stderr.log"), { flags: "a", mode: 0o600 });
    const useProcessGroup = process.platform !== "win32";

    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ["pipe", "pipe", "pipe"],
      detached: useProcessGroup
    });
    activeChildren.set(child.pid, { child, useProcessGroup });

    function signalChild(signal) {
      try {
        if (useProcessGroup && child.pid) process.kill(-child.pid, signal);
        else child.kill(signal);
      } catch {}
    }

    function cleanupTimers() {
      clearTimeout(timer);
      clearTimeout(firstByteTimer);
      if (killTimer) clearTimeout(killTimer);
    }

    function finish(value) {
      if (settledRun) return;
      settledRun = true;
      cleanupTimers();
      activeChildren.delete(child.pid);
      stdoutStream.end();
      stderrStream.end();
      resolve(value);
    }

    const firstByteTimer = setTimeout(() => {
      noFirstByte = true;
      stderrStream.write(`run-external-agent: no child stdout/stderr within ${FIRST_BYTE_TIMEOUT_MS}ms; terminating\n`);
      signalChild("SIGTERM");
      killTimer = setTimeout(() => signalChild("SIGKILL"), 2000).unref();
    }, FIRST_BYTE_TIMEOUT_MS);
    firstByteTimer.unref();

    const timer = setTimeout(() => {
      timedOut = true;
      signalChild("SIGTERM");
      killTimer = setTimeout(() => signalChild("SIGKILL"), 2000).unref();
    }, options.timeoutMs);
    timer.unref();

    const noteBytes = () => clearTimeout(firstByteTimer);
    child.stdout.on("data", (chunk) => {
      noteBytes();
      stdoutStream.write(chunk);
      stdout = boundedAppend(stdout, chunk.toString("utf8"), options.maxOutputBytes * 2);
    });
    child.stderr.on("data", (chunk) => {
      noteBytes();
      stderrStream.write(chunk);
      stderr = boundedAppend(stderr, chunk.toString("utf8"), options.maxOutputBytes);
    });
    child.on("error", (err) => {
      finish({
        stdout,
        stderr: `${stderr}\n${err.message}`,
        exitCode: null,
        signal: null,
        timedOut,
        noFirstByte,
        durationMs: Date.now() - started
      });
    });
    child.on("close", (code, signal) => {
      finish({
        stdout,
        stderr,
        exitCode: code,
        signal,
        timedOut,
        noFirstByte,
        durationMs: Date.now() - started
      });
    });
    child.stdin.end(options.input);
  });
}

function parseAgentOutput(agent, stdout, options = {}) {
  const text = stdout.trim();
  if (!text) return { ok: false, error: "empty stdout" };
  const whole = parseJsonMaybe(text);
  if (whole) {
    const events = Array.isArray(whole) ? whole : [whole];
    return {
      ...extractReport(agent, whole, text),
      ...streamMetadata(events, options.requestedModel)
    };
  }

  const events = [];
  for (const line of text.split(/\r?\n/)) {
    const event = parseJsonMaybe(line.trim());
    if (!event) continue;
    events.push(event);
  }
  if (events.length === 0) return { ok: false, error: "invalid JSON stream" };
  const metadata = streamMetadata(events, options.requestedModel);
  for (let i = events.length - 1; i >= 0; i--) {
    const report = finalReportField(events[i]);
    if (report) return { ok: true, text: report, raw: events, ...metadata };
  }
  const collected = assembleAssistantText(events);
  if (collected.length) return { ok: true, text: collected.join(""), raw: events, ...metadata };
  return { ok: false, error: `could not find ${agent} report field in JSON stream`, ...metadata };
}

function extractReport(agent, value, rawText) {
  const report = finalReportField(value);
  if (report) return { ok: true, text: report, raw: value };
  const collected = assembleAssistantText(Array.isArray(value) ? value : [value]);
  if (collected.length) return { ok: true, text: collected.join(""), raw: value };
  return { ok: false, error: `could not find ${agent} report field in JSON`, raw_stdout: rawText };
}

function parseJsonMaybe(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function finalReportField(value) {
  if (!value || typeof value !== "object") return null;
  for (const key of ["result", "response", "text", "message"]) {
    if (typeof value[key] === "string") return value[key];
  }
  if (value.type === "result" && typeof value.result === "string") return value.result;
  return null;
}

function streamMetadata(events, requestedModel) {
  const assistantModels = [];
  let resultSubtype = null;
  let totalCostUsd = null;
  for (const event of events) {
    if (isAssistantEvent(event) && typeof event.message?.model === "string") assistantModels.push(event.message.model);
    if (event?.type === "result") {
      if (typeof event.subtype === "string") resultSubtype = event.subtype;
      if (typeof event.total_cost_usd === "number") totalCostUsd = event.total_cost_usd;
    }
  }
  const modelsObserved = [...new Set(assistantModels)];
  const modelFallback = Boolean(
    requestedModel &&
    modelsObserved.length > 0 &&
    !modelsObserved.every((model) => modelPrefixMatches(model, requestedModel))
  );
  return { modelsObserved, modelFallback, resultSubtype, totalCostUsd };
}

function modelPrefixMatches(observed, requested) {
  const o = String(observed || "").toLowerCase();
  const r = String(requested || "").toLowerCase();
  if (!r) return true;
  // Accept a direct prefix (full id requested) or an alias (e.g. "opus")
  // appearing inside the resolved id.
  return o.startsWith(r) || o.includes(r);
}

function assembleAssistantText(events) {
  const groups = new Map();
  for (const event of events) {
    const item = assistantTextEvent(event);
    if (!item) continue;
    const group = groups.get(item.id) || { complete: [], deltas: [] };
    group[item.complete ? "complete" : "deltas"].push(item.text);
    groups.set(item.id, group);
  }
  const out = [];
  for (const group of groups.values()) {
    const source = group.complete.length ? group.complete : group.deltas;
    out.push(...source);
  }
  return out;
}

function assistantTextEvent(value) {
  if (!value || typeof value !== "object") return;
  if (!isAssistantEvent(value)) return null;
  const text = [];
  if (typeof value.content === "string") text.push(value.content);
  if (typeof value.text === "string") text.push(value.text);
  if (typeof value.delta?.text === "string") text.push(value.delta.text);
  if (Array.isArray(value.content)) collectContentItems(value.content, text);
  if (Array.isArray(value.message?.content)) collectContentItems(value.message.content, text);
  if (Array.isArray(value.parts)) collectContentItems(value.parts, text);
  if (!text.length) return null;
  return {
    id: value.message?.id || value.message_id || value.id || "assistant-stream",
    complete: !isDeltaEvent(value),
    text: text.join("")
  };
}

function isAssistantEvent(value) {
  return Boolean(
    value?.role === "assistant" ||
    value?.type === "assistant" ||
    value?.message?.role === "assistant" ||
    (value?.type === "message" && value?.role === "assistant")
  );
}

function isDeltaEvent(value) {
  return Boolean(
    value?.delta === true ||
    value?.delta?.text ||
    value?.type === "content_block_delta" ||
    String(value?.type || "").includes("delta")
  );
}

function collectContentItems(items, out) {
  for (const item of items) {
    if (typeof item === "string") out.push(item);
    else if (typeof item?.text === "string") out.push(item.text);
    else if (typeof item?.content === "string") out.push(item.content);
  }
}

function buildPrompt(agent, prompt, cwd, contextPaths) {
  const label = agent === "gemini" ? "Gemini CLI" : "Claude Code CLI";
  return [
    `You are ${label} running as an external read-only subagent for Codex.`,
    "",
    "Rules for this run:",
    "- Produce a direct report for Codex to return to the user.",
    "- Do not modify, create, delete, move, or rename files.",
    "- Do not run nested AI agents or CLIs such as codex, claude, or gemini.",
    "- If you need file context, inspect only the working directory and listed context paths.",
    "- If the request asks for edits, propose a patch or plan instead of applying changes.",
    "",
    `Working directory: ${cwd}`,
    contextPaths.length ? `Context paths:\n${contextPaths.map((p) => `- ${p}`).join("\n")}` : "Context paths: none provided",
    "",
    "User request:",
    prompt
  ].join("\n");
}

async function snapshotWorkspace(root) {
  const files = new Map();
  let truncated = false;
  async function walk(dir) {
    if (files.size >= SNAPSHOT_MAX_FILES) {
      truncated = true;
      return;
    }
    let entries;
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (files.size >= SNAPSHOT_MAX_FILES) {
        truncated = true;
        return;
      }
      if (shouldSkip(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const rel = path.relative(root, full);
      let st;
      try {
        st = await fs.promises.lstat(full);
      } catch {
        continue;
      }
      if (st.isSymbolicLink()) {
        let target = "";
        let escapesRoot = false;
        try {
          target = await fs.promises.readlink(full);
          const realTarget = await realpath(path.resolve(dir, target));
          escapesRoot = !isInside(realTarget, root);
        } catch {
          escapesRoot = true;
        }
        files.set(rel, { type: "symlink", target, escapes_root: escapesRoot });
      } else if (st.isDirectory()) {
        await walk(full);
      } else if (st.isFile()) {
        const item = { type: "file", size: st.size, mtimeMs: Math.round(st.mtimeMs) };
        if (st.size <= SNAPSHOT_HASH_MAX_BYTES) item.sha256 = await sha256File(full);
        files.set(rel, item);
      }
    }
  }
  await walk(root);
  return {
    files,
    summary: {
      root,
      file_count: files.size,
      truncated,
      snapshot_max_files: SNAPSHOT_MAX_FILES,
      escaping_symlinks: [...files.entries()]
        .filter(([, value]) => value.type === "symlink" && value.escapes_root)
        .map(([rel, value]) => ({ path: rel, target: value.target }))
    }
  };
}

function diffSnapshots(before, after) {
  const diffs = [];
  for (const [rel, value] of before) {
    if (!after.has(rel)) diffs.push({ path: rel, change: "deleted" });
    else if (JSON.stringify(value) !== JSON.stringify(after.get(rel))) diffs.push({ path: rel, change: "modified" });
  }
  for (const rel of after.keys()) {
    if (!before.has(rel)) diffs.push({ path: rel, change: "created" });
  }
  return diffs.slice(0, 200);
}

async function resolveCwd(input) {
  const requested = path.resolve(String(input));
  const st = await stat(requested);
  if (!st.isDirectory()) throw new Error(`cwd is not a directory: ${requested}`);
  return await realpath(requested);
}

async function resolveContextPaths(cwd, inputs) {
  const resolved = [];
  for (const item of inputs || []) {
    const candidate = path.resolve(cwd, String(item));
    const real = await realpath(candidate);
    if (!isInside(real, cwd)) throw new Error(`context path escapes cwd: ${item}`);
    resolved.push(real);
  }
  return resolved;
}

function sanitizedEnv(agent) {
  const keepExact = new Set([
    "HOME", "PATH", "USER", "LOGNAME", "SHELL", "TMPDIR", "TEMP", "TMP", "LANG",
    "LC_ALL", "LC_CTYPE", "TERM", "TERM_PROGRAM", "XDG_CONFIG_HOME", "XDG_CACHE_HOME",
    "XDG_DATA_HOME", "XDG_STATE_HOME"
  ]);
  // Pass through only the auth variables the spawned CLI itself needs, in case
  // the user authenticates with an API key instead of a login session.
  const authKeys = agent === "gemini"
    ? ["GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_CLOUD_PROJECT", "GOOGLE_APPLICATION_CREDENTIALS"]
    : ["ANTHROPIC_API_KEY"];
  for (const key of authKeys) keepExact.add(key);
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (keepExact.has(key) || key.startsWith("LC_")) env[key] = value;
  }
  env.EXTERNAL_AGENTS_READ_ONLY = "1";
  // Gemini 0.46+ folder-trust gate downgrades --approval-mode in untrusted dirs,
  // breaking these headless review calls; opt into trust for the run. (Documented
  // env var; ignored by Gemini versions that predate the gate, so never errors.)
  if (agent === "gemini") env.GEMINI_CLI_TRUST_WORKSPACE = "true";
  return env;
}

async function requireCommand(name) {
  const found = await findCommand(name);
  if (found) return found;
  if (name === "claude") {
    throw new Error(
      'The "claude" command-line tool was not found on your PATH. ' +
      "Install Claude Code and sign in (https://claude.com/claude-code), then try again. " +
      "If it is already installed, make sure the folder containing it is on your PATH."
    );
  }
  throw new Error(
    'The "gemini" command-line tool was not found on your PATH. ' +
    "Install the Gemini CLI and sign in (https://github.com/google-gemini/gemini-cli), then try again. " +
    "If it is already installed, make sure the folder containing it is on your PATH."
  );
}

async function findCommand(name) {
  const override = name === "gemini"
    ? process.env.EXTERNAL_AGENTS_GEMINI_COMMAND
    : process.env.EXTERNAL_AGENTS_CLAUDE_COMMAND;
  if (override && await isExecutable(override)) return override;
  for (const dir of (process.env.PATH || "").split(path.delimiter)) {
    if (!dir) continue;
    const candidate = path.join(dir, name);
    if (await isExecutable(candidate)) return candidate;
  }
  return null;
}

async function isExecutable(file) {
  try {
    await fs.promises.access(file, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function parseArgs(argv) {
  const parsed = {
    agent: "",
    prompt: "",
    promptFile: "",
    claudePrompt: "",
    geminiPrompt: "",
    cwd: process.cwd(),
    context: [],
    timeout: DEFAULT_TIMEOUT_SECONDS,
    maxOutput: DEFAULT_MAX_OUTPUT_BYTES,
    maxTurns: 8,
    maxBudget: 2,
    stateDir: "",
    invocationId: "",
    // No model or effort is forced by default: the spawned CLI uses whatever
    // default the user's own account and configuration provide.
    claudeModel: process.env.EXTERNAL_AGENTS_CLAUDE_MODEL || "",
    claudeEffort: process.env.EXTERNAL_AGENTS_CLAUDE_EFFORT || ""
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) throw new Error(`Missing value for ${arg}`);
      return argv[++i];
    };
    if (arg === "--agent") parsed.agent = next();
    else if (arg === "--prompt") parsed.prompt = next();
    else if (arg === "--prompt-file") parsed.promptFile = next();
    else if (arg === "--claude-prompt") parsed.claudePrompt = next();
    else if (arg === "--gemini-prompt") parsed.geminiPrompt = next();
    else if (arg === "--cwd") parsed.cwd = next();
    else if (arg === "--context") parsed.context.push(next());
    else if (arg === "--timeout") parsed.timeout = Number(next());
    else if (arg === "--max-output") parsed.maxOutput = Number(next());
    else if (arg === "--max-turns") parsed.maxTurns = Number(next());
    else if (arg === "--max-budget") parsed.maxBudget = Number(next());
    else if (arg === "--state-dir") parsed.stateDir = next();
    else if (arg === "--invocation-id") parsed.invocationId = next();
    else if (arg === "--claude-model") parsed.claudeModel = next();
    else if (arg === "--claude-effort") parsed.claudeEffort = next();
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (parsed.claudeEffort && !["low", "medium", "high", "xhigh"].includes(parsed.claudeEffort)) {
    throw new Error("--claude-effort must be one of: low, medium, high, xhigh");
  }
  if (parsed.promptFile) parsed.prompt = parsed.promptFile === "-" ? fs.readFileSync(0, "utf8") : fs.readFileSync(parsed.promptFile, "utf8");
  return parsed;
}

function hasUsablePrompt(parsed) {
  if (parsed.agent === "both") return Boolean(parsed.prompt || (parsed.claudePrompt && parsed.geminiPrompt));
  if (parsed.agent === "claude") return Boolean(parsed.prompt || parsed.claudePrompt);
  if (parsed.agent === "gemini") return Boolean(parsed.prompt || parsed.geminiPrompt);
  return false;
}

function usage() {
  console.error([
    "usage:",
    `  node ${SCRIPT_PATH} --agent claude|gemini|both --prompt TEXT [--cwd DIR]`,
    `  node ${SCRIPT_PATH} --agent claude|gemini|both --prompt-file FILE [--cwd DIR]`,
    "",
    "Defaults: cwd = current folder; timeout 300s; output cap 50KB;",
    "Claude caps: 8 turns, $2 budget; model/effort = your CLI's own defaults.",
    "Options: --context PATH --timeout SECONDS --max-output BYTES --max-turns N",
    "         --max-budget USD --claude-model NAME --claude-effort low|medium|high|xhigh",
    "         --claude-prompt TEXT --gemini-prompt TEXT --state-dir DIR --invocation-id ID",
    "",
    'Requires the "claude" and/or "gemini" CLI installed, signed in, and on your PATH.'
  ].join("\n"));
}

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const { child, useProcessGroup } of activeChildren.values()) {
    try {
      if (useProcessGroup && child.pid) process.kill(-child.pid, signal);
      else child.kill(signal);
    } catch {}
  }
  setTimeout(() => {
    for (const { child, useProcessGroup } of activeChildren.values()) {
      try {
        if (useProcessGroup && child.pid) process.kill(-child.pid, "SIGKILL");
        else child.kill("SIGKILL");
      } catch {}
    }
    process.exit(1);
  }, 2000).unref();
}

function shouldSkip(name) {
  return [".git", "node_modules", ".next", "dist", "build", "coverage", ".venv", "__pycache__"].includes(name);
}

async function sha256File(file) {
  const data = await readFile(file);
  return createHash("sha256").update(data).digest("hex");
}

function isInside(candidate, root) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function clampInteger(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isInteger(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function truncate(value, limit) {
  const text = String(value || "");
  if (Buffer.byteLength(text, "utf8") <= limit) return text;
  return `${Buffer.from(text, "utf8").subarray(0, limit).toString("utf8")}\n...[truncated]`;
}

function boundedAppend(existing, addition, limit) {
  const next = existing + addition;
  if (Buffer.byteLength(next, "utf8") <= limit) return next;
  return truncate(next, limit);
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
}

function redactSecrets(value) {
  return String(value || "")
    .replace(/([A-Za-z0-9_]*?(?:KEY|TOKEN|SECRET|PASSWORD)[A-Za-z0-9_]*?=)[^\s]+/gi, "$1[redacted]")
    .replace(/(sk-[A-Za-z0-9_-]{12,})/g, "[redacted-key]")
    .replace(/(AIza[ A-Za-z0-9_-]{20,})/g, "[redacted-key]");
}

function redactForManifest(value) {
  if (typeof value !== "string") return value;
  if (value.length > 200) return `[${value.length} chars prompt omitted]`;
  return redactSecrets(value);
}
