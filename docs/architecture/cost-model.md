# Cost Model

Status: Phase 1. Per the mission's requirement: for every paid service, identify the requirement, the free alternative, the tradeoff, and cost at 100/1,000/10,000/100,000 users. All unit prices below were verified via live search this session (Sept 2026); re-verify before budgeting against them at implementation time, and treat the usage assumptions (items/month, AI-tier hit rate) as planning estimates to replace with real telemetry once the product has users.

## Planning assumptions (explicit, revisit with real data)
- ~8 ingested items/user/month (documents, receipts, bills combined).
- ~40% of ingested items require Tier 2 AI-assisted extraction (photographed/low-confidence); 60% handled by Tier 1 deterministic parsing at $0.
- ~3 forwarded emails/user/month via Cloudflare Email Routing.
- 1 household ≈ 1–2 billed users on average for infra-sizing purposes (MAU/storage counted per household, not strictly per seat).

## Per-service decision summary

| Requirement | $0 approach used | Paid alternative considered | Why $0 approach wins at MVP scale |
|---|---|---|---|
| Postgres + Auth + Storage + RLS | Supabase Free → Pro at first external user | Self-hosted Postgres | Supabase Pro's $25/mo buys managed backups/no-pause well before self-hosting ops effort pays for itself (ADR-002) |
| App hosting | Vercel Hobby (solo dev) → Pro at first external user | Cloudflare Workers (OpenNext) | Vercel Pro's $20/mo/seat is trivial; avoids adapter-maturity risk (ADR-003) |
| Document/extraction AI | Claude Haiku 4.5, usage-based, Tier-2-only | AWS Textract / Google Document AI, or AI-for-everything | Tiered approach means AI spend tracks actual need, not total volume (ADR-006) |
| Inbound email | Cloudflare Email Routing + Workers | SendGrid Inbound Parse ($19.95/mo+), Mailgun ($15–90+/mo by volume) | Free at any modeled scale, no per-plan volume gate (ADR-008) — throughput unverified at scale, flagged in inbox-pipeline.md |
| Background jobs | Postgres `processing_queue` + scheduled poll | Inngest/Trigger.dev/SQS | Avoids a new vendor before there's evidence of need (ADR-007) |
| CI | GitHub Actions, public repo | — | Repo is public (`hbkdad/lifeops`) → **unlimited free Actions minutes**, not the 2,000 min/mo private-repo allowance |
| Payments | Stripe (standard ~2.9%+$0.30/transaction, verify at Phase 12) | — | Not a candidate for a $0 alternative — payments processing is inherently a paid, usage-based service; the mission's constraint is about avoiding *unnecessary* fixed costs, not this |

## Cost at scale

Figures are **monthly**, USD, and additive down each column. "Users" = individual signed-in people; households assumed ~1.3 users/household on average for MAU-counting purposes.

| Line item | 100 users | 1,000 users | 10,000 users | 100,000 users |
|---|---|---|---|---|
| Supabase | $0 (free tier; ~130 households, well under 500MB DB) | $25 (Pro — 1,000 users likely exceeds free DB/storage caps) | $25–~$60 (Pro base + storage/egress overage, est.) | ~$300–600 (Pro base + meaningful overage at 8GB DB / 100GB storage / 250GB egress ceilings — re-model with real per-user storage once measured) |
| Vercel | $0 (Hobby, solo dev only) | $20 (Pro, 1 seat) | $20–$40 (possible bandwidth overage beyond 1TB) | $20–~$150 (overage-dependent; revisit Cloudflare fallback per ADR-003 if this climbs) |
| Cloudflare Email Routing | $0 | $0 | $0 (unverified at this volume — flagged) | $0 (unverified — flagged, re-test) |
| AI extraction (Haiku 4.5, Tier 2 only) | ~$1.20 (100 × 8 × 40% × ~$0.004/doc) | ~$12 | ~$120 | ~$1,200 |
| GitHub Actions | $0 (public repo, unlimited minutes) | $0 | $0 | $0 |
| Stripe processing fees | pass-through, ~2.9%+$0.30/txn on whatever revenue exists | pass-through | pass-through | pass-through |
| **Total fixed infra (excl. Stripe passthrough)** | **~$1–2** | **~$57** | **~$165–225** | **~$1,520–1,950** |

**Read:** Infra cost stays well under $2/user/year even at 100,000 users, against a proposed Plus/Family pricing band of $70–160/user-household/year (pricing.md) — infra is not the constraint on unit economics at any modeled scale. The AI-extraction line is deliberately the largest variable cost because it's the one most directly tied to product usage (more engagement → more documents → more Tier 2 calls), which is the right thing for a cost line to track.

## What would break this model (watch for these, don't pre-solve them)
- Tier 2 AI hit rate meaningfully above the assumed 40% (e.g., if most users primarily photograph rather than forward) — cheap to re-measure once real usage data exists; Haiku 4.5 cost is low enough that even a 2–3x miss on this assumption doesn't change the qualitative conclusion.
- Per-household document storage meaningfully above Supabase Pro's 100GB pooled allowance at the 10k/100k tiers — worth instrumenting average document size early so this is caught before it's a surprise bill.
- Cloudflare Email Routing throughput limits at real volume (explicitly unverified, see inbox-pipeline.md) — test before assuming it holds at 10k+ users.
