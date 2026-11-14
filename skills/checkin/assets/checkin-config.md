# Check-in configuration

Ask the agent to fill this in with you. These are suggested defaults, not permission to bypass an existing policy. Keep runtime state outside the installed skill.

## Locations

- setup_complete: false
- account: [connected mail account]
- email_policy: [existing policy path]
- triage_config: [existing triage configuration path]
- batch_directory: [email-assistant/state/checkin-email-batches]
- writing_preferences: [optional existing file]
- task_app: [optional existing app]

## Review defaults

- default_hours: 24
- catch_up_days: 14
- max_fyi_items: 10
- max_attention_items: 10
- fyi_auto_mark_read: true
- fyi_permission_recorded: false
- auto_archive_after_display: false
- broader_folder_recovery: false

Explain FYI marking during setup, then record its approval in the email policy and set fyi_permission_recorded to true. Existing unread holds still win. Showing a message does not archive it.

## Family / important-label review

- family_review_enabled: true
- family_labels: [user-confirmed existing labels, or none]
- include_older_unread_family: true

Suggest an existing Family label if present. Ask whether other important personal categories belong here. Do not require a label named @Family, infer relatives, or create labels without agreement. With no configured label, report not configured rather than claiming coverage.

## Quarantine review

- quarantine_review_enabled: true
- quarantine_source: [provider and authorized digest source, or none]
- quarantine_sender_and_subject: [verified exact digest criteria]
- expected_digest_cadence: [only if known]
- quarantine_lookup_window_days: 14

The agent can help identify the institution's blocked-mail digest. Confirm the source and scope before ongoing review. No configured accessible source means no quarantine coverage. Review is read-only by default: no release, allowlist, forwarding, or automatic digest clearance.

## Newsletter reading holds

- newsletter_holds_enabled: true

| Exact sender/subscription | Minimum unread hours | Additional conditions |
|---|---|---|
| [user's chosen newsletter] | [e.g. 48] | [optional hold] |

Empty/unfilled examples activate no holds. Preserve each edition's read state until the window ends; age alone never marks it read or archives it. Existing explicit longer holds win.

## Replies

- reply_mode: review_then_send
- approved_send_connection: [available authorized connector]
- post_send_mark_read: [record the user's policy, default preserve until agreed]

Review_then_send still requires approval of the complete exact outgoing message. Draft_only prepares drafts without sending. Neither mode inherits someone's private sending scripts or recurring forwarding permissions.
