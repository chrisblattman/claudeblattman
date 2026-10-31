#!/usr/bin/env node
// Upload only a branch Preview to the existing preview Worker.
import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
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
const result = spawnSync("npx", [
  "--yes", "--package=wrangler@4.156.0", "wrangler", "preview",
  "--config", ".cloudflare/wrangler-preview.jsonc",
  "--worker-name", "claudeblattman-preview",
  "--name", name,
  "--tag", commit.slice(0, 12),
  "--message", `${branch} at ${commit}`,
  "--ignore-base-config", "--json",
], { encoding: "utf8", env: { ...process.env, WRANGLER_SEND_METRICS: "false" } });
if (result.status !== 0) {
  // Wrangler error diagnostics do not need the API token echoed by this wrapper.
  process.stderr.write(result.stderr || "Cloudflare preview upload failed.\n");
  process.exit(result.status || 1);
}
let response;
try { response = JSON.parse(result.stdout); }
catch { throw new Error("Preview upload returned an unexpected response. Inspect the Cloudflare deployment before retrying."); }
const urls = [];
function collect(value, path = "") {
  if (typeof value === "string" && /^https:\/\//.test(value)) {
    try {
      const url = new URL(value);
      if (url.hostname.endsWith(".workers.dev")) urls.push({ path, url: value });
    } catch { /* Ignore non-URL metadata. */ }
  } else if (Array.isArray(value)) value.forEach((v, i) => collect(v, `${path}.${i}`));
  else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => collect(v, `${path}.${k}`));
}
collect(response);
const stable = urls.find(x => /preview.*url|preview_url/i.test(x.path) && !/deployment/i.test(x.path))
  || urls.find(x => !/deployment|unique/i.test(x.path)) || urls[0];
const unique = urls.find(x => /deployment|unique/i.test(x.path));
if (!stable) throw new Error("Upload completed but no preview URL was returned. Inspect it before retrying.");
console.log(`Preview: ${stable.url}`);
console.log(`Source: ${branch} at ${commit}`);
if (unique && unique.url !== stable.url) console.log(`Exact deployment: ${unique.url}`);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `preview_url=${stable.url}\ncommit=${commit}\n`);
  if (unique) appendFileSync(process.env.GITHUB_OUTPUT, `deployment_url=${unique.url}\n`);
}
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `## Draft preview\n\n[Open preview](${stable.url})\n\nBranch: \`${branch}\`\n\nCommit: \`${commit}\`\n\nThe live site was not deployed by this job.\n`);
}
