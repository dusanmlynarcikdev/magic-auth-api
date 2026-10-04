# Fallbacks

## FB-1: Missing `lastUsedAt`

The migration fills `last_used_at` of the existing authenticated rows.
Then the new app version is deployed, but until the deploy finishes, the old version
still runs and stores authenticated rows with `last_used_at` set to `NULL`.
For these rows, `authenticated_at` is used as a fallback.
