# MVP Backlog

Status: Phase 1, ratified scope per ADR-010. This is the build sequence for "the smallest product capable of proving recurring consumer value" — the mission's own bar for exiting Phase 1. Each epic below maps to (a trimmed slice of) the mission's phases 1–8; phases 9–15 (search, weekly brief, monetization, growth, audit, deployment) follow once this loop is validated with real users.

## Definition of done (applies to every epic — stated once, not repeated per item)
Per the mission's own Definition of Done: implementation + automated tests + error/loading/empty states + responsive layout + accessibility pass + security review of anything touching auth/RLS/uploads + docs updated (this repo's memory files) + a successful production build. "Code exists" is not "done."

## Activation bar for this MVP (the actual go/no-go signal)
A household **creates a household AND ingests at least 3 real records (not demo data) AND has at least one future obligation with a live reminder scheduled**, within their first session or two. This is the mission's own suggested activation definition, made concrete to this wedge. If early users don't clear this bar, that's a product signal to act on before building further phases — not a reason to add more domains.

---

## Epic 0 — Project bootstrap
*(The technical setup implied by "start building," not itself one of the mission's 15 phases — has to happen before Phase 2 work can start.)*
- Next.js (App Router, TypeScript) app initialized; Supabase project provisioned; environment config split dev/prod.
- CI on GitHub Actions: lint, typecheck, unit tests, build — on every PR (free, public repo, ADR/cost-model.md).
- Base repo conventions: `src/modules/<domain>/` structure per ADR-001, ESLint import-boundary rule.

## Epic 1 — Minimal design system *(trimmed Phase 2)*
- Design tokens (color/type/spacing) for the calm/trust/premium direction from the mission; light + dark mode from day one (not retrofitted).
- Base shadcn/ui components themed; empty-state and skeleton-loading patterns established **before** they're needed elsewhere — pain-points.md flags "comprehensive but overwhelming" and poor empty states as a documented category failure, so this isn't polish, it's a defense against a known failure mode.

## Epic 2 — Auth + household tenancy *(Phase 3)*
- Supabase Auth: email/password + magic link.
- Household creation, invite flow, `household_members` roles (owner/admin/member/viewer).
- RLS policies live and tested (adversarial cross-tenant tests — one household must never see another's rows) before any other epic builds on top of this.

## Epic 3 — Core records, MVP domains only *(trimmed Phase 4)*
- `assets`: home, vehicle types only.
- `organizations`, `obligations`: bill, subscription, warranty, insurance_policy types only.
- Manual create/edit forms for all of the above (this is what makes the inbox pipeline in Epic 4 testable end-to-end even before extraction is fully tuned).
- `relationships` table wired for the basic cases (asset↔obligation).

## Epic 4 — Universal Inbox: upload + paste + Tier 1/2 extraction *(trimmed Phase 5)*
- Upload (drag-drop + mobile camera capture via file input) and paste ingestion.
- Tier 1 deterministic extraction pipeline (dates/money/orgs/assets/recurrence detectors) per inbox-pipeline.md.
- Tier 2 Haiku 4.5 fallback for image-only/low-confidence input, run as a background job (ADR-007).
- Confidence-scored confirmation UI showing evidence per field — nothing auto-creates a record.
- On confirm: transactional creation of `obligations`/`assets`/`documents` rows + default reminders.

## Epic 5 — Email-forwarding ingestion *(fast-follow within Phase 5, not deferred)*
- Cloudflare Email Routing + Worker on a dedicated subdomain, per household forwarding address.
- Feeds the same Tier 1/2 pipeline Epic 4 built — no parallel extraction logic.
- This ships as its own epic (not bundled into Epic 4) so upload/paste can go live and get real usage data while this is being built.

## Epic 6 — Today dashboard *(pulled forward from Phase 8)*
- Now / Soon / Upcoming / Informational triage buckets, computed from `obligations.due_date` + status — deterministic, no AI required.
- Shipped early, deliberately, per pain-points.md's #3 finding (breadth without triage reads as overwhelming) — this is the answer to "what needs my attention," and research says it matters before the product has much data in it, not after.

## Epic 7 — Reminders delivery *(trimmed Phase 7)*
- Multi-stage cadence per obligation type (defaults in inbox-pipeline.md), user-customizable.
- Email delivery only for MVP (push via PWA and SMS are real but deferred — no new vendor needed for email).
- Scheduled via `processing_queue`.

## Epic 8 — Document vault views *(trimmed Phase 6)*
- Browse/filter documents by category and linked record; view original alongside extracted fields.
- No semantic search yet (Phase 9, deterministic keyword search first — see below).

## Epic 9 — Household collaboration polish *(trimmed Phase 10)*
- Invite-flow UX polish, assignment of an obligation to a person, shared-vs-private record visibility.
- Roles/RLS foundation already shipped in Epic 2; this epic is the UX layer on top, not new tenancy work.

## Epic 10 — Basic Life Search *(trimmed Phase 9)*
- Postgres full-text search (`tsvector`/`tsquery`) across obligations/documents/assets titles+metadata — $0, no external search service.
- Mission is explicit: "start deterministic, AI enhancement comes later" — this epic takes that literally.

## Epic 11 — Weekly Life Brief *(Phase 11, deterministic-only slice)*
- Digest email compiled from plain queries (due soon, renewals, recent activity) — mission requires this "remain useful even without generative AI," so build it that way from the start rather than retrofitting a non-AI fallback later.

## Epic 12 — Monetization *(Phase 12, scoped to what's needed to charge safely)*
- Stripe checkout, webhooks, customer portal; `plans`/`household_entitlements` wired through the centralized `getEntitlements`/`can()` check (ADR-009).
- Self-service, single-action cancellation shipped from the first release of this epic, not retrofitted — see docs/research/risks.md #4 on regulatory and trust grounds.

---

## Explicitly deferred past this MVP (not forgotten — tracked, not built)
Pets and appliances as asset types; licences, certifications, appointments, and maintenance as obligation types; the maintenance-history sub-domain; task/responsibility/chore assignment; tagging; referral/viral loops; analytics/growth instrumentation beyond basic activation events; SMS/push reminder channels; semantic (AI-assisted) search; the full security/accessibility/performance audit (Phase 14) and production hardening (Phase 15) — each picked up once the MVP loop above is validated with real households, per the mission's own instruction not to attempt every phase at once.

## What happens after Epic 12
Re-run the opportunity/activation assessment against real usage data (not projections) before deciding whether to widen domain scope (pets/licences/appointments/maintenance) or deepen the existing wedge (better extraction accuracy, richer Life Graph queries, search quality). That decision explicitly needs real data most of this document had to proceed without — noted here so it isn't skipped.
