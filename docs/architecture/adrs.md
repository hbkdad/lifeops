# Architecture Decision Records

Status: Phase 1. Each ADR: Context → Decision → Alternatives considered → Consequences. Supersede by adding a new ADR that references the old one; don't edit history.

---

## ADR-001: Modular monolith on Next.js App Router, single deployable
**Context:** Mission mandates "modular monolith initially... do NOT create microservices prematurely."
**Decision:** One Next.js (App Router) application. Domain logic organized as modules under `src/modules/<domain>/` (inbox, documents, obligations, households, entitlements, life-graph, reminders), each exposing a single `index.ts` public API. ESLint import-boundary rule forbids deep cross-module imports (`src/modules/inbox/internal/*` unreachable from `src/modules/documents`). Server Actions + Route Handlers within the same app talk to modules directly — no internal network hop.
**Alternatives considered:** Separate API service (Node/Express or Fastify) behind the Next.js frontend — rejected, adds a second deployable, a second hosting bill line, and cross-service auth complexity with zero benefit at MVP scale. Microservices per domain — rejected outright per mission constraint and because team size (effectively one engineer at this stage) can't carry the operational overhead.
**Consequences:** Module boundaries are enforced by convention + lint, not process isolation — a bad import is a lint failure, not a build failure, until we add a stricter check. Revisit only if a specific module needs independent scaling (e.g., extraction workers under heavy load) — see ADR-007.

---

## ADR-002: Supabase (Postgres + Auth + Storage + RLS) as the sole backend platform
**Context:** Mission's default stack; zero-capital constraint requires justifying it, not assuming it.
**Decision:** Supabase for Postgres, authentication (email/password + magic link + OAuth), object storage (documents/photos), and Row Level Security as the tenant-isolation mechanism.
**Alternatives considered:** Firebase/Firestore — rejected: document model is a worse fit for the relational Life Graph (joins across obligations/assets/documents/people are core to the product, not incidental), and the Firebase MCP plugin failed to connect in our own tooling (see docs/tooling/tool-inventory.md), a weak signal but consistent with choosing the better-fitting tool anyway. Self-hosted Postgres (e.g., on Fly.io/Railway) — rejected for MVP: more ops burden (backups, connection pooling, auth-from-scratch) for no cost advantage at this scale (see docs/architecture/cost-model.md — Supabase free tier covers the first ~hundreds of users at $0).
**Consequences:** Free tier pauses projects after 7 days of inactivity and caps at 500MB DB / 1GB storage / 50k MAU — fine for solo development, **not** acceptable once any external user (even unpaid beta) is on the product; budget Supabase Pro ($25/mo) starting at first external user, not first paying user. RLS policies are load-bearing security, not defense-in-depth decoration — see docs/architecture/domain-model.md.

---

## ADR-003: Hosting — Vercel, with an explicit dollar-trigger for Pro
**Context:** Vercel Hobby (free) is restricted to **non-commercial personal use** per its own terms — confirmed in Phase 1 research, not assumed. LifeOps is a commercial SaaS from its first external user, even pre-revenue.
**Decision:** Develop on Vercel Hobby solo. Upgrade to **Vercel Pro ($20/seat/month, includes $20 usage credit, commercial-use rights)** at the point of onboarding the **first external user** (private beta), not at first Stripe charge. This is a real, if trivial, cost line — call it what it is rather than quietly relying on a ToS violation to keep the "$0" number.
**Alternatives considered:** Cloudflare Workers via the `@opennextjs/cloudflare` adapter — genuinely free at commercial-friendly volumes (100k req/day), no seat cost, and pairs naturally with R2/D1 if we're already using Cloudflare for email (ADR-008). Rejected as the *default* for now because the OpenNext adapter is a community-maintained compatibility layer, not first-party, and adds integration risk (edge-case Next.js features, deploy pipeline maturity) we don't want to carry while everything else is also new. **Documented fallback**: revisit if Vercel's metered overages become material at higher scale (see cost-model.md) or if the OpenNext adapter's maturity improves.
**Consequences:** $20/mo enters the budget at first beta user — small enough to not be a real zero-capital violation in spirit, but tracked explicitly rather than glossed over.

---

## ADR-004: Domain model uses type-discriminated tables + JSONB, not 40 separate tables
**Context:** Mission names 40+ entities (Bill, Warranty, Subscription, InsurancePolicy, Licence, Certification, Appointment, MaintenanceItem; Home, Vehicle, Appliance, Pet; etc.). Building 40 near-identical tables (each with title/date/status/recurrence/reminders) is schema sprawl that slows every future change (one migration touches N tables) without a corresponding benefit.
**Decision:** Two polymorphic backbone tables — `obligations` (type ∈ bill/subscription/warranty/insurance_policy/licence/certification/appointment/maintenance) and `assets` (type ∈ home/vehicle/appliance/pet/other) — each with shared core columns plus a `metadata jsonb` column for type-specific fields (e.g., `assets.metadata` holds `{vin, make, model}` for a vehicle, `{species, breed}` for a pet). Full mapping from every mission entity to its physical table is in [domain-model.md](domain-model.md) so nothing is silently dropped, only consolidated.
**Alternatives considered:** One table per entity (mission's literal reading) — rejected: 40-table sprawl, and most of these entities differ only in 2-3 fields and their reminder cadence defaults, not in structural shape. Fully generic EAV (entity-attribute-value) — rejected: loses type safety and makes "what's due this week" queries need to attribute-join instead of a plain `WHERE due_date < X`, which is the single most common query in the product.
**Consequences:** `type`-specific business rules (e.g., "insurance policies default to a 60/30/7/1-day reminder cadence, subscriptions default to 7-day only") live in application code keyed on `type`, not in the schema. A GIN index on `metadata` keeps type-specific field queries reasonably fast if/when we need to query into them.

---

## ADR-005: Life Graph = denormalized FK columns for hot paths + a generic `relationships` edge table for open-ended queries
**Context:** Mission's Life Graph needs to answer both structured hot-path questions ("what's due this month," answerable by a plain indexed column) and open-ended graph questions ("show everything connected to my truck," which needs arbitrary entity-to-entity traversal).
**Decision:** `obligations` carries direct FK columns for its 90%-case relationships (`related_asset_id`, `related_org_id`, `related_person_id`) for cheap indexed joins. A separate `relationships(from_type, from_id, to_type, to_id, relation)` edge table captures everything else (asset-contains-asset, document-relates-to-multiple-things, arbitrary future edge types) without a schema migration every time a new relationship shape appears.
**Alternatives considered:** Pure graph database (Neo4j etc.) — rejected: new infra category, new hosting cost, and the query patterns we actually need (per opportunity-score.md's execution-risk concern about scope) don't yet justify it. Pure edge-table-only (no FK columns) — rejected: makes the single most common query ("obligations due soon for this household") a join through the edge table instead of a plain indexed column scan.
**Consequences:** Two ways to represent a relationship exist simultaneously; the rule is FK columns for the specific, named, 1:1-ish relationships already on `obligations`/`assets`, edge table for everything else. Document this rule in code comments where both patterns are visible together, so it doesn't read as inconsistency.

---

## ADR-006: Universal Inbox extraction is tiered — deterministic first, AI-assisted only as a scoped fallback
**Context:** Mission: "Paid AI inference must not be required for the basic product to function," but also needs to handle photographed documents with no text layer, which deterministic parsing alone can't read.
**Decision:** Tier 1 (always, $0, deterministic): text-layer PDFs and forwarded emails go through open-source parsing (`pdf-parse`/`pdfjs-dist`) + rule-based detectors (`chrono-node` for dates, regex for money/currency, sender-domain + keyword heuristics for organizations) — no network call to any AI provider. Tier 2 (usage-based, only when Tier 1 confidence is low or the input is an image with no text layer): a single internal `ExtractionProvider` interface, with **Claude Haiku 4.5** ($1/$5 per MTok, vision-capable) as the reference implementation, called only for the subset of documents that need it. See [inbox-pipeline.md](inbox-pipeline.md) for the full pipeline and [cost-model.md](cost-model.md) for why this stays cheap even at 100k users.
**Alternatives considered:** AI-first extraction for everything (simplest to build) — rejected: violates the mission's no-mandatory-paid-inference rule and couples the core product loop to one vendor's uptime/pricing. Self-hosted open-weight OCR/VLM — rejected for MVP: no GPU infra in a $0 budget; revisit if Tier 2 volume/cost ever justifies the ops burden.
**Consequences:** `ExtractionProvider` must be a real interface from day one (input: file/text, output: typed fields + confidence + evidence), not a direct SDK call sprinkled through the codebase — this is what keeps the provider swappable per the mission's requirement, and what makes ADR-006 auditable later (can we prove Tier 1 alone handles most volume?).

---

## ADR-007: Background processing via Postgres-native queue, not a separate managed queue service
**Context:** Tier 2 AI extraction and any multi-second processing shouldn't run inline in a request (Vercel Hobby/Pro function timeouts, and a snappy UI shouldn't block on it).
**Decision:** A `processing_queue` table + `pg_cron`-scheduled polling worker (a Vercel cron function or Supabase Edge Function invoked on a schedule), entirely inside the already-provisioned Postgres — no new vendor.
**Alternatives considered:** Inngest, Trigger.dev, or a hosted queue (SQS+worker) — each has a free tier, but each is also a new vendor relationship, new credentials, and new failure mode to reason about before we have any evidence we need their throughput/retry sophistication. Rejected for MVP; reconsider explicitly if queue depth/throughput becomes a real operational problem (a concrete, measurable trigger, not a preemptive one).
**Consequences:** Retry/backoff/dead-letter logic has to be hand-rolled (a `status` + `attempts` column on `processing_queue`, retried with backoff by the poller) rather than inherited from a managed queue product. Acceptable at MVP volume; revisit the tradeoff if this becomes fragile in practice.

---

## ADR-008: Inbound email ingestion via Cloudflare Email Routing + Workers
**Context:** The "forward an email" ingestion path needs a real inbound-email mechanism. SendGrid Inbound Parse requires a paid plan ($19.95/mo+) to unlock; Mailgun's free tier (100/day ≈ 3,000/mo) is workable at low scale but becomes a paid line ($15–90+/mo) well before 100k users (see cost-model.md).
**Decision:** Cloudflare Email Routing (free, no per-volume metering at the plan level) configured on a dedicated subdomain (e.g., `inbox.lifeops.app`), routing each household's forwarding address to a Cloudflare Worker that parses the MIME message and posts it into the same `inbox_items` pipeline Tier 1/Tier 2 extraction already consumes.
**Alternatives considered:** Mailgun/SendGrid/Postmark — kept as a documented paid fallback if Cloudflare Email Routing's specific throughput/deliverability turns out to be a constraint at scale (not yet verified under real production email volume — flagged as **UNVERIFIED, confirm during Phase 5/6 implementation**, per the mission's anti-hallucination rule).
**Consequences:** Introduces a Cloudflare dependency for this one ingestion path even though hosting defaults to Vercel (ADR-003) — an intentional best-tool-per-job split, not an inconsistency; DNS/MX setup on the product's own domain is a one-time infra task to track in the Phase 5/6 implementation checklist.

---

## ADR-009: Entitlements centralized in one module, never scattered plan checks
**Context:** Mission: "Never scatter plan checks throughout components. Create centralized entitlement logic."
**Decision:** A single `src/modules/entitlements/` module exposing `getEntitlements(householdId)` and `can(householdId, capability)`. Every feature gate (storage cap, member-count cap, AI-tier usage cap) calls through this, never an ad hoc `if (plan === 'gold')` in a component or route handler. `plans` and `household_entitlements` tables (see domain-model.md) back it; Stripe webhook handlers (Phase 12) only ever write to `household_entitlements`, never read by feature code directly.
**Alternatives considered:** Feature flags scattered via env vars or component props — rejected per mission's explicit instruction and because it's the exact pattern that produces "which of our 40 components still check the old plan name" bugs.
**Consequences:** Every new feature that should be plan-gated has one obvious place to add the check; a missing check is a code-review catch (module not called), not a runtime mystery.

---

## ADR-010: MVP wedge scope — ratified
**Context:** Phase 0 research (competitors.md, differentiation.md, opportunity-score.md) recommended, as a proposal, narrowing the first build to 2–3 domains instead of the full 40+ entity model, given active competitors (Lifey, Babs) and the category's documented "comprehensive but overwhelming" failure mode (HomeZada).
**Decision:** Ratified. MVP domain scope = **documents/bills, home + warranties, vehicle**. In schema terms (ADR-004): `assets.type` ships with `home` and `vehicle` only; `obligations.type` ships with `bill`, `subscription`, `warranty`, `insurance_policy` only. `appliance`/`pet` asset types and `licence`/`certification`/`appointment`/`maintenance` obligation types are modeled in the schema's check constraints (cheap to leave in) but not built out in UI/pipeline until post-MVP.
**Alternatives considered:** Building the full 40-entity model before shipping anything usable — rejected per the mission's own instruction not to build toward hypothetical future requirements, and because research shows this is the specific failure mode that hurt HomeZada's perceived usability.
**Consequences:** See [docs/mvp-backlog.md](../mvp-backlog.md) for the concrete build sequence this produces. DECISIONS.md's earlier "proposed" entry on this is now superseded by this ADR.

---

## ADR-011: Multi-tenancy — `household_id` + Postgres RLS, four roles
**Context:** Threat model requires airtight tenant isolation (mission's PRIVACY + SECURITY section: IDOR, cross-tenant access, broken RLS are named threats).
**Decision:** Every tenant-scoped table carries a `household_id`. RLS policies restrict all access to rows where `household_id` is in the caller's `household_members` rows, with role (`owner`/`admin`/`member`/`viewer`) gating write policies — viewers get `SELECT`-only policies, no write policy exists for that role at all (not a runtime check, an absent grant). See [domain-model.md](domain-model.md) for the policy pattern.
**Alternatives considered:** Application-layer tenant checks only (no RLS) — rejected: a single missed `WHERE household_id = ?` in one query becomes a cross-tenant data leak, exactly the IDOR class of bug the mission calls out; RLS makes the database itself the enforcement point, not application code discipline alone.
**Consequences:** Every new table needs its RLS policy written and tested (adversarial tenant-isolation tests are in the mission's testing requirements) before it ships — treated as part of a table's definition of done, not a follow-up task.
