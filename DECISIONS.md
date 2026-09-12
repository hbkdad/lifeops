# Decisions Log

Lightweight ADR-style record. Add a new entry per decision; do not edit past entries except to mark them superseded (with a link to the entry that supersedes them).

---

## 2026-09-12 — Subagents created lazily, not pre-built as a 15-role roster
**Decision:** Do not pre-create 15 speculative `.claude/agents/*.md` subagent role definitions (ARCHITECT, BACKEND-ENGINEER, SECURITY-AUDITOR, etc.) before there's code for them to act on.
**Why:** Creating 15 unused stub definitions before any implementation exists is speculative scaffolding with no immediate payoff, and conflicts with "don't design for hypothetical future requirements." A subagent definition is cheap to write the moment it's actually needed (e.g., a security-auditor role right before auth ships).
**Status:** Active. Revisit per-phase: define a role only when a phase concretely needs delegated/specialized work.

---

## 2026-09-12 — No new MCP servers installed during Phase 0
**Decision:** Did not install any MCP server from the official registry or elsewhere, despite the mission requesting a registry search.
**Why:** Every capability needed for Phases 0–3 (web research, Postgres/auth/storage via Supabase, hosting via Vercel/Cloudflare, GitHub via `gh` CLI) is already available in-session or via a standard CLI. No candidate server cleared the "do we have an actual, current need" bar in [docs/tooling/mcp-evaluation.md](docs/tooling/mcp-evaluation.md).
**Status:** Active. Re-evaluate at Phase 6 (documents/uploads), Phase 9 (search), and Phase 14 (audit tooling), where a genuine new need is more likely to appear.

---

## 2026-09-12 — Recommended MVP wedge narrower than the full domain model
**Decision:** Target the ingestion → obligation/reminder → Today-screen loop across a narrow slice (documents/bills, home/warranties, vehicle) before building out the full 40+ entity domain model (pets, licenses, appointments, etc. come later).
**Why:** Research shows the closest competitors (Lifey, Babs) are moving now, and a documented category failure mode (HomeZada: "comprehensive but overwhelming") punishes breadth-before-depth. See [docs/research/differentiation.md](docs/research/differentiation.md) and [docs/research/opportunity-score.md](docs/research/opportunity-score.md).
**Status:** **Ratified in Phase 1 — see [ADR-010](docs/architecture/adrs.md#adr-010-mvp-wedge-scope--ratified)** and the concrete build sequence in [docs/mvp-backlog.md](docs/mvp-backlog.md).

---

## 2026-09-12 — Phase 1 architecture decisions
**Decision:** 11 ADRs recorded covering monolith structure, Supabase/Vercel choices with explicit cost triggers, a type-discriminated schema instead of 40 literal tables, a tiered (deterministic-first) extraction pipeline, Postgres-native background jobs, Cloudflare Email Routing for inbound email, centralized entitlements, and RLS-based multi-tenancy.
**Why:** Full reasoning, alternatives considered, and consequences are in [docs/architecture/adrs.md](docs/architecture/adrs.md) — not duplicated here to avoid this log and that doc drifting out of sync.
**Status:** Active. This entry is a pointer, not a summary — read the ADRs directly before touching architecture.

---

## 2026-09-12 — Hosting/storage revised after deeper free-alternative research
**Decision:** Switched default hosting from Vercel to **Cloudflare Workers (OpenNext, GA since Feb 2026)**; moved document storage from Supabase Storage to **Cloudflare R2**; corrected the earlier claim that Supabase requires a paid upgrade at "first external user."
**Why:** User explicitly asked for a harder look at free alternatives before proceeding. Research found: Supabase's free tier is ToS-permitted for commercial use with a documented $0 fix for its inactivity pause; Cloudflare's Next.js adapter is now production-GA with no non-commercial restriction; R2's free tier is larger than Supabase Storage's with zero egress cost. Full reasoning in [ADR-002](docs/architecture/adrs.md), [ADR-003](docs/architecture/adrs.md), [ADR-012](docs/architecture/adrs.md), updated numbers in [cost-model.md](docs/architecture/cost-model.md). Neon (with Neon Auth) was seriously evaluated as a Supabase alternative and not chosen — see ADR-002 for why.
**How to apply:** Genuine $0 infra now plausibly extends into the thousands of users, not just pre-launch. Vercel remains a documented fallback specifically if Cloudflare Workers' Node-compatibility (`nodejs_compat`) breaks a load-bearing dependency (validate in Epic 0/4) — don't rediscover this reasoning from scratch if that happens.
**Status:** Active — proceeding to implementation on this basis.

---

## 2026-09-12 — Avoid the phrase "Family Operating System" in any public-facing copy
**Decision:** Do not use "Family Operating System" (or close variants) in LifeOps marketing/branding.
**Why:** Trustworthy holds this as a registered trademark (confirmed on their own pricing page, "The Family Operating System®"). "LifeOps" itself remains a working codename pending a trademark search before public launch.
**Status:** Active.
