# Editing drafts and sharing previews

Use the shared `drafts` branch as the starting point for parallel work. It contains the preview setup. The published site continues to come from `main` through the existing GitHub Pages workflow.

Start a separate branch for each change, such as `draft/chris-homepage` or `draft/shay-workflows`. Push it to this repository. The Draft Preview check builds the site and returns a preview link in its Actions summary. Open a draft pull request when you want feedback. The same check posts the preview link on the pull request and updates it as the branch changes.

Each branch gets its own preview. Changes on one branch do not replace another branch's preview or the published site. The banner and Version details link identify the branch and commit being reviewed. Previews are public but request that search engines do not index them. Keep private notes, correspondence and credentials out of public source and build output.

Before beginning new work, bring the shared draft base up to date with published changes from `main`. Preserve other authors' unfinished work when resolving conflicts. A fresh independent clone outside a file-sync folder avoids sharing Git's internal files between computers.

For copy editing, a Google Doc can remain the writing surface. Ask the agent to read the latest author-edited Doc and apply the chosen changes to your draft branch. Review the rendered preview before publishing.

Merging a pull request into `drafts` updates the shared draft only. Publishing remains a separate decision: an approved pull request into `main` uses the existing live release checks and deployment. Check its contents before merging. This setup does not change live publishing permissions or approval rules.

## Preview configuration

The preview workflow targets the existing `claudeblattman-preview` Cloudflare Worker. It runs `wrangler preview`, which creates a branch Preview rather than deploying the Worker's production version. The existing manually uploaded preview is retained.

GitHub Actions needs the repository secret `CLOUDFLARE_PREVIEW_API_TOKEN` and variable `CLOUDFLARE_PREVIEW_ACCOUNT_ID`. Scope the deployment credential to the intended preview Worker. Never put it in this repository or a document. Cloudflare access and GitHub source access are separate.

For a local preview build, install `requirements-staging.txt` in your local Python environment and run `python scripts/build-draft-preview.py` from a draft branch. This writes only the ignored `site/` build output. It does not upload anything.

The Cloudflare publish helper rejects `main` and `gh-pages`, checks that the build matches the source commit, and uses a pinned Wrangler version. Do not replace the preview command with a production deployment command.
