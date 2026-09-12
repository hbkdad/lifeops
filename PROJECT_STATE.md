# Project State

Last updated: 2026-09-12

## Completed
- Phase 0 (research) and Phase 1 (architecture + MVP backlog) complete — see `docs/research/`, `docs/architecture/`, `docs/mvp-backlog.md`.
- Hosting/storage architecture revised after deeper free-alternative research: Cloudflare Workers (not Vercel), Cloudflare R2 (not Supabase Storage) — see ADR-002/003/012, `docs/architecture/cost-model.md`.
- **Epic 0 (project bootstrap) substantially complete:**
  - **Supabase project provisioned** (org "HBK Customs", project `lifeops`, id `vdzwxryujynojuqmcejc`, region us-east-1, $0/month verified) via MCP. Full schema applied (17 tables, all domain-model.md entities). RLS policies live on every tenant table; security advisors clean (one intentional documented exception on `processing_queue`); performance advisors clean (unindexed-FK and RLS-initplan findings both fixed; remaining "unused index" notices are expected on an empty database).
  - **Next.js 16 app scaffolded** (App Router, TypeScript, Tailwind, `src/` layout per ADR-001), with `@supabase/ssr` client/server helpers and session-refresh proxy (`src/proxy.ts` — Next.js 16 renamed `middleware.ts`, migrated via the official codemod).
  - Home page performs a live Supabase query as a connectivity smoke test.
  - **Cloudflare Workers deployment wired** via `@opennextjs/cloudflare`: `wrangler.jsonc`, `open-next.config.ts` (R2-backed ISR cache). `next build` and `opennextjs-cloudflare build` both verified passing — this was the one open technical risk from ADR-003 (Node-compat) and it cleared, with two caveats now documented in the ADR (OpenNext's own Windows-compat warning for local dev; Node.js proxy support on Workers is explicitly experimental).
  - CI (`.github/workflows/ci.yml`): lint, typecheck, test, build on every push/PR — public repo, unlimited free GitHub Actions minutes.
  - Supabase keep-alive workflow (`.github/workflows/supabase-keep-alive.yml`): pings every 3 days so the free tier never pauses (ADR-002).
  - Lint/typecheck/test/build all pass clean locally (zero warnings) as of this commit.
- Repo pushed to `https://github.com/hbkdad/lifeops` throughout.

## Current / blocking on the user
- **Cloudflare R2 is not yet enabled on the account** — `r2_buckets_list` returned `403: Please enable R2 through the Cloudflare Dashboard`. This is a one-time manual toggle (likely involves accepting R2's terms) that isn't available through the API/MCP tools — **the user needs to do this once** at the Cloudflare dashboard before I can create the `lifeops-next-cache` and `lifeops-documents` buckets referenced in `wrangler.jsonc` and actually deploy (`wrangler deploy`)/preview the Worker. Nothing else is blocked by this — local `next build`/`opennextjs-cloudflare build` both work without it.
- No actual `wrangler deploy` has been run yet (deferred until R2 exists, and until there's a meaningful UI worth deploying).

## Next
1. **User action needed:** enable R2 in the Cloudflare dashboard (Cloudflare account → R2 → enable). Tell me once done and I'll create the two buckets and do a first deploy.
2. Continue the backlog: Epic 1 (minimal design system) or Epic 2 (auth + household tenancy) — the RLS/schema foundation for Epic 2 is already live, so real auth UI is the natural next coding step regardless of the R2 blocker.

## Tests
- `npm test` (Vitest) passes with zero tests (`passWithNoTests: true`) — honest state, no domain logic exists yet. Real tests start with Epic 2/3 logic.
- `npm run typecheck`, `npm run lint`, `npm run build`, `npx opennextjs-cloudflare build` all pass clean.

## Risks
- See [RISKS.md](RISKS.md) (project/execution) and [docs/research/risks.md](docs/research/risks.md) (market/competitive).
- New since Epic 0: Node.js proxy/middleware support on Cloudflare Workers is explicitly experimental (ADR-003) — watch for this if session-refresh behavior ever seems flaky in production.
