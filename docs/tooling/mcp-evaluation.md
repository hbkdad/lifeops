# MCP Server Evaluation Criteria

Status: policy document — apply this checklist before adding **any** new MCP server (registry or otherwise) to the LifeOps project going forward. We installed nothing new in Phase 0; this doc exists so future additions are deliberate, not default.

## Why be conservative
Live research this session (see [tool-inventory.md](tool-inventory.md)) turned up an explicit, current warning from the protocol's own ecosystem coverage: *"MCP's rapid proliferation has outpaced the development of its security model... released with a flexible and underspecified design... introducing ambiguity for safe usage."* The NSA has published MCP-specific security guidance. This is a young, fast-moving integration surface with real, documented trust variance between servers — not a solved, uniformly-safe ecosystem. [Source](https://chatforest.com/guides/mcp-ecosystem-2026-state-of-the-standard/)

## Checklist (all must pass before adding a server)

| Criterion | Question to answer |
|---|---|
| **Security** | Does it request the minimum scopes/permissions needed? Does it run with any elevated/host-level privilege (filesystem, shell, credentials) beyond what the task requires? |
| **Maintenance** | Is it actively maintained (recent commits/releases)? Single-maintainer hobby project vs. vendor/org-backed? |
| **Reputation** | Official (`modelcontextprotocol` org, or the actual product vendor — e.g., Supabase's own MCP, Cloudflare's own MCP) vs. unverified third party? |
| **License** | OSS license compatible with our use? Any usage restrictions? |
| **Credential requirements** | What does it need (API key, OAuth scopes, service-role-equivalent access)? Can that credential be scoped down (read-only, project-specific) rather than account-wide? |
| **Privileges** | What could it do if compromised or misused — read sensitive data, write/delete, execute code, spend money? |
| **Usefulness** | Does it solve a problem we actually have right now, not a hypothetical future one? |
| **Redundancy** | Do we already have this capability via an existing connector, a CLI (`gh`, `supabase`, `vercel`, `npm`), or a standard library? Prefer the CLI/official-SDK path over adding an MCP server unless the MCP integration is genuinely better (e.g., structured tool calls vs. shelling out). |

## Standing decisions from this evaluation (Phase 0)

- **Prefer official/vendor-maintained servers** (Supabase, Cloudflare, Vercel — all already present this session) over third-party registry entries for the same capability.
- **GitHub: use `gh` CLI, not an MCP connector**, for this project. It's already the documented default behavior, requires no new authorization, and is fully scriptable/auditable via Bash.
- **No new MCP server has been installed for LifeOps.** Nothing evaluated in Phase 0 crossed the "we have an actual, current need" bar in the Usefulness row above — everything needed for Phases 0–3 (research, docs, Postgres/auth via Supabase, hosting via Vercel/Cloudflare) is already available.
- Revisit this list explicitly when we reach Phase 6 (Documents/uploads — may want a dedicated malware/MIME-validation service), Phase 9 (Search), and Phase 14 (accessibility/security audit tooling) — each of those may surface a genuine new need. Apply the full checklist above at that time rather than adding anything preemptively now.
