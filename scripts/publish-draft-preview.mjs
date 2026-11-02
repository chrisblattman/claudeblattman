#!/usr/bin/env node
// Upload only a branch Preview to the existing preview Worker.
import { createHash } from "node:crypto";
import { appendFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const git = (...args) => {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error("Cannot identify the checked-out Git revision.");
  return result.stdout.trim();
};
const branch = process.env.DRAFT_BRANCH || git("branch", "--show-current");
if (!branch || ["main", "gh-pages"].includes(branch)) {
  throw new Error("Refusing to publish a draft from main, gh-pages, or a detached unnamed branch.");
}
const commit = git("rev-parse", "HEAD");
const metadata = JSON.parse(readFileSync("site/_draft.json", "utf8"));
if (metadata.branch !== branch || metadata.commit !== commit) {
  throw new Error("Build metadata does not match the source branch and commit. Rebuild first.");
}
if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
  throw new Error("Preview deployment requires its scoped Cloudflare credential and account ID.");
}
const slug = branch.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 22);
const suffix = createHash("sha256").update(branch).digest("hex").slice(0, 8);
const name = `draft-${slug}-${suffix}`;
// Wrangler's asset progress shares stdout even with --json. Its output file
// provides typed JSON records independently of those human-readable messages.
const outputDir = mkdtempSync(join(tmpdir(), "claudeblattman-preview-"));
const outputFile = join(outputDir, "wrangler.ndjson");
let deployment;
try {
  const result = spawnSync("npx", [
    "--yes", "--package=wrangler@4.156.0", "wrangler", "preview",
    "--config", ".cloudflare/wrangler-preview.jsonc",
    "--worker-name", "claudeblattman-preview",
    "--name", name,
    "--tag", commit.slice(0, 12),
    "--message", `${branch} at ${commit}`,
    "--ignore-base-config",
  ], {
    encoding: "utf8",
    env: { ...process.env, WRANGLER_SEND_METRICS: "false", WRANGLER_OUTPUT_FILE_PATH: outputFile },
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || "Cloudflare preview upload failed.\n");
    throw new Error("Preview upload did not complete normally. Inspect the Cloudflare deployment before retrying.");
  }
  try {
    const records = readFileSync(outputFile, "utf8").trim().split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
    const previews = records.filter(record => record.type === "preview");
    if (previews.length !== 1 || previews[0].worker_name !== "claudeblattman-preview" || previews[0].preview_name !== name) {
      throw new Error("Unexpected preview identity.");
    }
    [deployment] = previews;
  } catch {
    throw new Error("Preview upload returned an unexpected structured response. Inspect the Cloudflare deployment before retrying.");
  }
} finally {
  rmSync(outputDir, { recursive: true, force: true });
}
const workersDevUrl = value => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".workers.dev") ? url.href : undefined;
  } catch { return undefined; }
};
const stable = Array.isArray(deployment.preview_urls) ? deployment.preview_urls.map(workersDevUrl).find(Boolean) : undefined;
const unique = Array.isArray(deployment.deployment_urls) ? deployment.deployment_urls.map(workersDevUrl).find(Boolean) : undefined;
if (!stable) throw new Error("Preview uploaded but no active preview URL was returned. Check the Worker's Preview URLs setting and inspect the deployment before retrying.");
console.log(`Preview: ${stable}`);
console.log(`Source: ${branch} at ${commit}`);
if (unique && unique !== stable) console.log(`Exact deployment: ${unique}`);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `preview_url=${stable}\ncommit=${commit}\n`);
  if (unique) appendFileSync(process.env.GITHUB_OUTPUT, `deployment_url=${unique}\n`);
}
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `## Draft preview\n\n[Open preview](${stable})\n\nBranch: \`${branch}\`\n\nCommit: \`${commit}\`\n\nThe live site was not deployed by this job.\n`);
}
