# Tool Inventory — Claude Code Session (LifeOps)

Status: snapshot taken 2026-09-12, in a Windows/PowerShell Claude Code desktop session. **Exact connection state is session-specific and will differ in future sessions** (this doc records categories and relevance, not a byte-accurate connection ledger to be trusted going forward — re-verify at the start of each work session rather than assuming this list is current).

## Directly confirmed working this session
- **WebSearch / WebFetch** — used for all of Phase 0 market research (see docs/research/).
- **Read / Write / Edit / Glob / Grep** — filesystem and code tools.
- **Bash** (Git Bash / POSIX) and **PowerShell** — shell execution.
- **AskUserQuestion** — structured clarification.
- **Agent** (Explore, general-purpose, Plan, and other named subagent types) — not yet exercised this session, but confirmed available.
- **ToolSearch** — loads deferred tool schemas on demand (this is how WebSearch/WebFetch were activated).

## Available connector-style MCP tools (claude.ai account connectors, present this session, not yet exercised for LifeOps work)
These are tied to the current user's personal claude.ai account connectors, not to the LifeOps product itself — see [security-review.md](security-review.md) for why that distinction matters.

| Category | Servers present | Relevance to LifeOps build |
|---|---|---|
| Database/backend | Supabase | **Directly matches the mission's default stack** (Postgres, auth, storage, RLS, edge functions, migrations). High relevance from Phase 3 onward. |
| Hosting/deploy | Vercel, Cloudflare Workers (+ D1, R2, KV, Hyperdrive) | Vercel is the natural fit for a Next.js app (generous free tier). Cloudflare R2/D1/KV are viable $0-tier alternatives/complements (R2 has no egress fees — worth evaluating for document storage cost at scale). |
| Email | Gmail | Useful for **prototyping only** — never wire the product's real ingestion pipeline through a personal Gmail connector. Production needs its own inbound-email address per household via a transactional provider. |
| ML/models | Hugging Face Hub | Useful for evaluating open-source/open-weight OCR and document-extraction models to keep AI-provider-swappable and avoid mandatory paid inference, per the zero-capital constraint. |
| Design | Figma | Optional — only relevant if design work moves into Figma rather than staying code-first (Tailwind/shadcn). |
| Browser automation | Claude Browser (`Claude_Browser__*`), Claude in Chrome, computer-use | Relevant for manual QA / visual verification of the web app once there's something to look at (per "test the golden path in a browser before reporting UI work done"). |
| PM/collaboration | Notion, Slack, Asana | Not needed for building the product itself — per the mission's own instruction, **the repository (PROJECT_STATE.md, ROADMAP.md, etc.) is the source of truth**, not a third-party PM tool. Not wired into this project. |
| Sales/marketing | Apollo, HubSpot, Canva, Gamma | Not relevant to engineering work; ignored for this project. |
| Scheduling | Google Calendar-style connector, scheduled-tasks, cron tools | Not needed yet; potentially relevant much later for the product's own reminder-scheduling logic as a *reference implementation to read*, not as production infrastructure (the product needs its own scheduling inside its own backend, not a dependency on the developer's personal calendar connector). |

## Explicitly NOT authorized this session (would need the user to authorize via claude.ai connector settings or `claude mcp`/`/mcp`)
Most relevant to flag: **GitHub** (`plugin:engineering:github`), Datadog, PagerDuty, and about 30 others (mostly marketing/sales/PM tools irrelevant to this build). None of these block Phase 0–2 work:
- GitHub operations will use the **`gh` CLI via Bash**, per standard practice — this doesn't require the MCP connector at all and is arguably more transparent/scriptable anyway.
- Datadog/PagerDuty are Phase 14+ (observability/incident-response) concerns, not needed now.

## Servers that failed to connect this session (transient — retry later, don't conclude "unavailable")
`desktop-commander`, `firebase`, `pdf-viewer` plugins timed out during this session's startup. Not blocking for Phase 0–2. Firebase is not in the default stack (Supabase covers the same ground per the mission's stack default) so this is low-priority to chase.

## MCP Registry search (per mission's tool-discovery requirement)
The official Model Context Protocol Registry (github.com/modelcontextprotocol/registry, launched preview Sept 2025) exists and hosts reference servers (Postgres, GitHub, Slack, filesystem, etc.) maintained directly by the `modelcontextprotocol` org. **We did not install anything from it.** Given Supabase, Cloudflare, and Vercel's own official MCP servers already cover our Postgres/hosting/storage needs, and GitHub is handled via `gh` CLI, there is no gap the registry needs to fill for Phase 0–3. Revisit only if a specific, named need emerges (e.g., a dedicated visual-regression or accessibility-testing MCP once we have UI to test) — see [mcp-evaluation.md](mcp-evaluation.md) for the evaluation criteria to apply before adding anything.

Sources: [MCP Registry GitHub](https://github.com/modelcontextprotocol/registry), [MCP 2026-07-28 spec](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
