# Project State

Last updated: 2026-09-12

## Completed
- Repo scaffolded (empty directory → docs structure + project memory files).
- Phase 0 market research complete: 7 docs in `docs/research/` — see [opportunity-score.md](docs/research/opportunity-score.md) for the net recommendation: **proceed, with scope discipline as the primary success condition.**
- Phase 0 tooling inventory complete: 3 docs in `docs/tooling/`. No new MCP servers installed.
- **Phase 1 architecture complete:** 11 ADRs in [docs/architecture/adrs.md](docs/architecture/adrs.md) covering app structure, backend/hosting choices (with explicit cost triggers), the domain model approach, the extraction pipeline, background jobs, inbound email, entitlements, and multi-tenancy. Full schema in [docs/architecture/domain-model.md](docs/architecture/domain-model.md) with a traceability table mapping every mission entity to a physical table or an explicit deferral. Pipeline detail in [docs/architecture/inbox-pipeline.md](docs/architecture/inbox-pipeline.md). Cost model (100/1k/10k/100k users, verified current pricing) in [docs/architecture/cost-model.md](docs/architecture/cost-model.md) — infra stays under ~$2/user/year even at 100k users. MVP wedge scope ratified (ADR-010): documents/bills + home/warranties + vehicle only, full domain model deferred.
- Prioritized MVP backlog written: [docs/mvp-backlog.md](docs/mvp-backlog.md) — 13 epics (Epic 0–12) covering bootstrap through monetization, each mapped to a trimmed slice of the mission's phases, with an explicit activation bar for "done."

## Current
- Awaiting user review of Phase 1 (architecture + MVP backlog) before starting Epic 0 (project bootstrap: Next.js app init, Supabase project provisioning) — the first point at which real (if still $0) infrastructure gets created.
- No application code exists yet. No Supabase project, no Next.js app, no Stripe account.

## Blocked
- Nothing technically blocked. Starting Epic 0 is a judgment call awaiting user sign-off, since it's the first step that provisions real infrastructure rather than writing docs.

## Next
1. User reviews Phase 1 docs (architecture + backlog) — in particular the wedge-scope ratification (ADR-010) and the Vercel/Supabase cost-trigger points (ADR-002/ADR-003), since those are the two places "zero-capital" stops being literally $0.
2. On approval: Epic 0 (project bootstrap) — initialize the Next.js app, provision Supabase, set up CI — then proceed through the backlog epic by epic, each gated by its own definition of done, not batched.

## Tests
- None yet — no code exists to test.

## Risks
- See [RISKS.md](RISKS.md) for the live project/execution risk register, and [docs/research/risks.md](docs/research/risks.md) for market/competitive risk.
