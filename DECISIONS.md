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
**Decision (proposed, pending Phase 1 architecture sign-off):** Target the ingestion → obligation/reminder → Today-screen loop across a narrow slice (documents/bills, home/warranties, vehicle) before building out the full 40+ entity domain model (pets, licenses, appointments, etc. come later).
**Why:** Research shows the closest competitors (Lifey, Babs) are moving now, and a documented category failure mode (HomeZada: "comprehensive but overwhelming") punishes breadth-before-depth. See [docs/research/differentiation.md](docs/research/differentiation.md) and [docs/research/opportunity-score.md](docs/research/opportunity-score.md).
**Status:** Proposed — not yet ratified. To be confirmed or overridden in the Phase 1 architecture proposal.

---

## 2026-09-12 — Avoid the phrase "Family Operating System" in any public-facing copy
**Decision:** Do not use "Family Operating System" (or close variants) in LifeOps marketing/branding.
**Why:** Trustworthy holds this as a registered trademark (confirmed on their own pricing page, "The Family Operating System®"). "LifeOps" itself remains a working codename pending a trademark search before public launch.
**Status:** Active.
