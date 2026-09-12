# Tooling Security Review

Status: Phase 0. Covers the development-tooling layer only (this Claude Code session's own connectors). Application-level security (RLS, tenant isolation, upload validation, etc.) is tracked in the mission's own PRIVACY + SECURITY requirements and will get a dedicated pass at Phase 3 (auth/tenancy) and Phase 14 (full audit) — not duplicated here.

## Core principle: this session's connectors belong to the developer, not to LifeOps
Every MCP connector visible in this Claude Code session (Supabase, Gmail, Vercel, Cloudflare, Notion, Slack, Figma, etc.) is authorized against **the current user's personal claude.ai account**, with that person's own scopes and credentials. None of these are, or should become, the LifeOps *application's* production credentials. Concretely:

- When we provision a real Supabase project for LifeOps, its `service_role` key must live only in server-side environment variables in the deployed app (Vercel/Cloudflare env config), **never** client-side, and never assumed to be "the same as" whatever this chat session can reach via its Supabase MCP connector.
- The Gmail connector available in this session is the developer's personal inbox. It must never be treated as a stand-in for the product's real email-ingestion pipeline (which needs a dedicated, per-household or per-user inbound address via a transactional email provider's inbound-parse webhook — e.g., Cloudflare Email Routing + Workers, or a provider's inbound-parse endpoint). Prototyping the *parsing logic* against a real forwarded email during dev is fine; wiring the product itself to a developer's personal Gmail is not.
- Any credential this session can use (Supabase, Vercel, Cloudflare tokens, etc.) is scoped to whatever the developer authorized broadly for their own account use — it should not be assumed to be least-privilege for the specific project, and production deploy credentials (CI secrets, Stripe keys) should be issued and scoped separately, not reused from this chat session's connectors.

## MCP ecosystem risk posture (informs mcp-evaluation.md)
Current research confirms MCP as a protocol is young enough that security maturity varies a lot server-to-server, with both community commentary and NSA guidance calling out an underspecified trust model industry-wide. Practical implication for this project: treat every MCP server as a distinct trust boundary, prefer official/vendor servers, and never grant an MCP server more scope than the specific task needs — the same standard we'd apply to any third-party dependency.

## Servers/plugins requiring auth we deliberately have NOT pursued
GitHub, Datadog, PagerDuty, and ~30 marketing/PM-focused integrations require OAuth we cannot complete non-interactively from here, and — more importantly — most of them (marketing/sales tools) have no legitimate need in an engineering session for this product. We are not requesting authorization for anything beyond what a specific, named phase needs (`gh` CLI already covers GitHub without any new auth).

## Standing rule going forward
No credential, token, or connector scope from this development session should ever be hardcoded, logged, or committed into the LifeOps repository. Application secrets are provisioned separately (Vercel/Cloudflare environment variables, `.env.local` which is git-ignored — see root `.gitignore`) and are never the same credentials this chat session uses for its own connectors.
