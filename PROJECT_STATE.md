# Project State

Last updated: 2026-09-12

## Completed
- Phase 0 (research) and Phase 1 (architecture + MVP backlog) complete.
- **Epic 0 (bootstrap) complete:** Supabase project `lifeops` provisioned and hardened (17 tables, full RLS, security/performance advisors clean bar one documented exception), Next.js 16 app scaffolded, Cloudflare Workers deployment build-verified, CI + Supabase keep-alive workflow green on GitHub.
- **Epic 2 (auth + household tenancy) complete and verified live in a browser** (not just build-clean):
  - Signup/login/logout, Supabase Auth email+password with standard confirmation flow.
  - `create_household()` RPC + households module; households list, create, and detail pages with member roster.
  - Full loop tested end-to-end against the real Supabase project: signup → confirm → login → create household → view members → logout.
  - **Two real security bugs found via deliberate adversarial testing and fixed** (see ADR-011 addendum in `docs/architecture/adrs.md`): an `INSERT...RETURNING`-vs-RLS chicken-and-egg bug in household creation, and a live privilege-escalation path in the `household_members` insert policy (any authenticated user could have claimed ownership of a memberless household). Both closed and reverified.
  - Also fixed an ambiguous PostgREST embed bug (ordinary bug, not security) in the member-roster query.
  - All test data cleaned up afterward — database is genuinely empty, ready for real use.

## Current / needs the user
1. **Cloudflare R2 not yet enabled** — one-time dashboard toggle (Cloudflare account → R2 → enable), not available via API. Needed before the two R2 buckets can be created and before `wrangler deploy` runs. Nothing else is blocked by this.
2. **Supabase "leaked password protection" is off** — a one-click toggle in Supabase Dashboard → Authentication → Policies (checks new passwords against HaveIBeenPwned). No API/MCP path to enable it found; recommend turning it on.
3. **Supabase's shared free-tier email sender has a low rate limit** (confirmed: hit it after 2 signups in a few minutes during testing). Not blocking now (solo dev), but a custom SMTP provider (e.g. Resend) needs to be configured in Supabase Auth settings before real user testing — tracked in RISKS.md as a Phase 3 exit criterion.

## Next
- Epic 1 (minimal design system) or continuing further into Epic 3 (core records: assets/organizations/obligations) — both are unblocked. Epic 3 builds directly on the now-verified auth/tenancy foundation.
- Household member invitation (mentioned as a stub on the detail page) is the natural next slice of Epic 2 if collaboration is prioritized before core records.

## Tests
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npx opennextjs-cloudflare build` all pass clean, verified both locally and in CI.
- Auth + household flow manually verified end-to-end in a real browser against the live database (see Epic 2 above) — no automated Playwright/Vitest tests written for it yet; that's real debt, not an oversight to gloss over. Worth prioritizing before this surface grows further.

## Risks
- See [RISKS.md](RISKS.md) (project/execution, now includes the email rate-limit finding) and [docs/research/risks.md](docs/research/risks.md) (market/competitive).
