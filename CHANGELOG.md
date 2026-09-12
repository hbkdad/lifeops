# Changelog

## 2026-09-12 (5)
- Epic 2 (auth + household tenancy) complete: signup/login/logout, email confirmation, `create_household()` RPC, households list/create/detail pages. Verified end-to-end in a real browser against the live Supabase project.
- Found and fixed two real security bugs via deliberate adversarial RLS testing (not just positive-path testing): an INSERT...RETURNING-vs-RLS ordering bug, and a live privilege-escalation path in `household_members`'s insert policy. Both documented in ADR-011 and closed. Also fixed an unrelated ambiguous-embed PostgREST bug.
- Confirmed Supabase's shared free-tier email sender has a real, low rate limit (hit it after 2 test signups) — noted in RISKS.md as needing a custom SMTP provider before real launch.
- All test data cleaned up; database is empty and ready for real use.

## 2026-09-12 (4)
- Epic 0 (project bootstrap) substantially complete: Supabase project `lifeops` provisioned ($0/month), full schema + RLS applied and hardened (security/performance advisors clean), Next.js 16 app scaffolded with Supabase SSR wiring, Cloudflare Workers deployment configured via OpenNext and build-verified (resolving the ADR-003 Node-compat risk), CI + a Supabase keep-alive workflow added. All local checks (lint/typecheck/test/build) pass clean.
- Found and fixed along the way: a real Next.js 16 breaking change (`middleware.ts` → `proxy.ts`, migrated via the official codemod), an ESLint config gap that was linting the `.open-next` build output (15k+ false-positive problems), and two Supabase RLS advisor findings (SECURITY DEFINER helper functions reachable via public RPC; unwrapped `auth.uid()` causing per-row re-evaluation).
- One blocker needs the user: Cloudflare R2 isn't enabled on the account yet (dashboard-only toggle, not available via API/MCP) — needed before the two R2 buckets can be created and before `wrangler deploy` can run.

## 2026-09-12 (3)
- Revised hosting/storage architecture after user asked for a deeper look at free alternatives: hosting moved from Vercel to Cloudflare Workers (OpenNext, GA Feb 2026), document storage moved from Supabase Storage to Cloudflare R2, and corrected an earlier overly-pessimistic claim that Supabase requires a paid upgrade at first external user (it doesn't — commercial use is ToS-permitted and the inactivity pause has a $0 fix). See ADR-002/003/012 and updated cost-model.md.
- Proceeding into Epic 0 (project bootstrap) per user instruction to continue autonomously until a genuine blocker (account creation, payment, or a decision only they can make) is hit.

## 2026-09-12 (2)
- Phase 1 complete: architecture (`docs/architecture/adrs.md` — 11 ADRs, `domain-model.md`, `inbox-pipeline.md`, `cost-model.md`) and prioritized MVP backlog (`docs/mvp-backlog.md`, 13 epics).
- Ratified the Phase 0 wedge-scope recommendation as ADR-010: MVP domains = documents/bills, home/warranties, vehicle only.
- Verified current pricing for Supabase, Vercel, Cloudflare R2/Email Routing, GitHub Actions, and Claude API (via the `claude-api` skill) to ground the cost model in real numbers rather than assumptions. Net finding: infra cost stays under ~$2/user/year even at 100,000 users.
- Flagged one real, if small, deviation from literal $0: Vercel Hobby's non-commercial-use restriction means Vercel Pro ($20/mo) is owed starting at the first external (even unpaid beta) user, not first revenue — documented in ADR-003 rather than glossed over.

## 2026-09-12
- Repo scaffolded from an empty directory.
- Phase 0 complete: market research (`docs/research/market.md`, `competitors.md`, `pain-points.md`, `differentiation.md`, `pricing.md`, `risks.md`, `opportunity-score.md`) and tooling inventory (`docs/tooling/tool-inventory.md`, `mcp-evaluation.md`, `security-review.md`), all grounded in live web search/fetch conducted this session.
- Project memory files established: `PROJECT_STATE.md`, `DECISIONS.md`, `ROADMAP.md`, `RISKS.md`, `CHANGELOG.md`.
- Net Phase 0 finding: proceed to Phase 1, with a recommendation (pending ratification) to narrow the MVP to a 2–3 domain wedge instead of the full domain model, given active close competitors (Lifey, Babs) and a documented "comprehensive but overwhelming" failure mode (HomeZada) in the category.
