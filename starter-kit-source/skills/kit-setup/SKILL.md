---
name: kit-setup
description: Check optional outside-agent connections and help complete their setup. Use when the user asks to connect agents, test Ask Agents, or troubleshoot the starter kit.
---

# Set up optional connections

Read the neighboring Ask Agents skill and its `references/transport.md`. Follow `references/host.md` here for executable discovery and app-specific configuration. Do not change council defaults, billing, global permissions, or model selection without the user's direction.

Ask which connection the user wants only if it is not clear. Check the helper executable and version. Detection or desktop sign-in alone does not prove authentication. Explain missing prerequisites plainly; use current official guidance if installation help is needed, and leave passwords/tokens to the provider's login flow.

Test each requested service through its documented runner using only “Reply with exactly: starter-kit-ok” in a new empty temporary folder. No project files. Respect existing send authorization and host approvals. A connection works only when execution succeeds and the expected reply is present. If login fails, help with the supported login and retry once; preserve any remaining failure honestly.

Record only connections that actually passed. Preserve unknown configuration fields and prior declined services. Report detected, tested, and unavailable services separately. Explain that working Ask Agents connections do not establish Chris's audited Light/Full runtime: the Council runtime status remains authoritative. Safe to rerun; never overwrite user preferences or install an unrelated global instruction file.
