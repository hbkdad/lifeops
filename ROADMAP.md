# Roadmap

Phases as defined in the founding mission. **Do not attempt multiple phases simultaneously.** Status is updated as work progresses — this file, not conversation history, is the source of truth for where the project is.

| Phase | Description | Status |
|---|---|---|
| 0 | Market/tool research | ✅ Done 2026-09-12 — see `docs/research/`, `docs/tooling/` |
| 1 | Architecture + ADRs | ✅ Done 2026-09-12 — see `docs/architecture/`, `docs/mvp-backlog.md` |
| 2 | Design system | ⏳ Next — pending user review of Phase 1 (Epic 1 in mvp-backlog.md) |
| 3 | Auth + household tenancy | Not started |
| 4 | Core records + Life Graph | Not started |
| 5 | Universal Inbox | Not started |
| 6 | Documents | Not started |
| 7 | Obligations + reminders | Not started |
| 8 | Today dashboard | Not started |
| 9 | Search | Not started |
| 10 | Household collaboration | Not started |
| 11 | Weekly Brief | Not started |
| 12 | Subscriptions/payments | Not started |
| 13 | Analytics + growth loops | Not started |
| 14 | Security/accessibility/performance audit | Not started |
| 15 | Production deployment | Not started |

## Scope decision (ratified in Phase 1)
Phases 4–8's first pass is narrowed to a 2–3 domain wedge (documents/bills, home/warranties, vehicle) rather than the full 40+ entity model — see [ADR-010](docs/architecture/adrs.md#adr-010-mvp-wedge-scope--ratified) and the concrete build sequence in [docs/mvp-backlog.md](docs/mvp-backlog.md), which supersedes the phase-by-phase breakdown above for implementation purposes (Epics 0–12 there map onto trimmed slices of Phases 1–12).
