# Replies, attempts, and handled-source cleanup

Use the current host's approved mail tools and normal permission checks. Discover actual schemas and capabilities. Never copy the author's personal sender scripts, aliases, approval guard, or recurring forwards. Do not switch to browser, direct authenticated API, or another sender after a denial. If sending is unavailable, offer draft-only handling.

## Prepare and approve

Draft using the user's writing preferences and established facts. A proposed approach is not a final approval payload. Before a send, display exact From, To/Cc/Bcc, subject, full body, attachments, and relevant reply/thread target. Wait for approval of that payload. Material changes require a new preview. Previously approved patterns or a request for the next batch never authorize a new send.

Honor clear mixed instructions without imposing a private guard's special wording: execute independent permitted holds or read changes, revise requested drafts, and obtain approval for the revised outgoing messages. Do not send merely because the user approved a draft's general direction.

In draft-only mode, prepare the draft locally or in Gmail as requested, record where it is, and report **drafted**, not sent. Creating a draft does not authorize marking the source handled/read.

## Persist before attempting

Use the existing batch as the action journal. Before a send, persist an event with a unique attempt ID, exact payload or immutable payload-file reference and digest, approval provenance, and exact source IDs. Set its state to attempting before the tool call. Submit once through the approved connector.

After the result, inspect returned message IDs and verify delivery evidence through available readback/Sent tools. Record confirmed delivery separately from read-status cleanup. If the tool times out or returns an uncertain result, preserve the attempted payload and reconcile with the connection before another attempt. A later draft fallback must not disguise an uncertain send as unsent. Never automatically resend an operation with unknown delivery.

Record confirmed failures as such, preserving the draft. A verified successful reply remains sent if later cleanup or persistence fails. When multiple replies are approved, process sequentially and preserve independent successes.

## After a verified send

Use the user's configured post_send_mark_read policy. If authorized, reconcile the handled source IDs and current holds, then remove only UNREAD from eligible exact inbound messages and verify each readback. Preserve newer arrivals and every unrelated label. A policy that allows marking the original read after a holding reply still leaves the underlying promised work open in the batch.

If post-send cleanup is not authorized, leave read state unchanged and report that. Neither sending nor summarizing grants archive permission. If cleanup fails, record it separately and recover it later without sending again. If a previously verified-read message becomes unread again, treat that as a possible deliberate hold, not a reason to keep clearing it.

The same exact-ID journal and readback discipline applies to FYI clearance and user-requested archiving. FYI clearance never adds an archive action implicitly. No action is attempted in preview mode, including journal/batch writes.
