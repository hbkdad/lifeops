# Cost Model

Status: Phase 1. Per the mission's requirement: for every paid service, identify the requirement, the free alternative, the tradeoff, and cost at 100/1,000/10,000/100,000 users. All unit prices below were verified via live search this session (Sept 2026); re-verify before budgeting against them at implementation time, and treat the usage assumptions (items/month, AI-tier hit rate) as planning estimates to replace with real telemetry once the product has users.

## Planning assumptions (explicit, revisit with real data)
- ~8 ingested items/user/month (documents, receipts, bills combined).
- ~40% of ingested items require Tier 2 AI-assisted extraction (photographed/low-confidence); 60% handled by Tier 1 deterministic parsing at $0.
- ~3 forwarded emails/user/month via Cloudflare Email Routing.
- 1 household ≈ 1–2 billed users on average for infra-sizing purposes (MAU/storage counted per household, not strictly per seat).

## Per-service decision summary

**Revised 2026-09-12** — deeper free-alternative research (prompted by user request) found the original hosting/DB cost triggers were more pessimistic than necessary. See ADR-002/ADR-003/ADR-012 for full reasoning.

| Requirement | $0 approach used | Paid alternative considered | Why $0 approach wins at MVP scale |
|---|---|---|---|
| Postgres + Auth + RLS | Supabase Free — commercial use is ToS-permitted; 7-day pause solved with a free GitHub Actions keep-alive ping (Epic 0) | Neon (comparable free tier + Neon Auth, seriously considered, not switching — ADR-002); Supabase Pro ($25/mo) once DB size/MAU telemetry actually approaches the free cap | No forced upgrade trigger at "first user" as originally assumed — real trigger is 500MB DB / 50k MAU, not a launch-day certainty |
| Document/photo storage | Cloudflare R2 (10GB free, $0 egress always) | Supabase Storage (1GB free, bundled into Pro) | Larger free allowance, zero egress cost as documents accumulate, and removes storage from Supabase's constraint budget entirely (ADR-012) |
| App hosting | Cloudflare Workers via OpenNext (GA Feb 2026) — free at commercial-friendly volume (100k req/day), no seat cost | Vercel Pro ($20/seat/mo) — kept as documented fallback if a Node-compat validation fails (ADR-003) | No non-commercial restriction (unlike Vercel Hobby), no per-seat cost ever, consolidates with email (Cloudflare) and storage (R2) onto one platform |
| Document/extraction AI | Claude Haiku 4.5, usage-based, Tier-2-only | AWS Textract / Google Document AI, or AI-for-everything | Tiered approach means AI spend tracks actual need, not total volume (ADR-006) |
| Inbound email | Cloudflare Email Routing + Workers | SendGrid Inbound Parse ($19.95/mo+), Mailgun ($15–90+/mo by volume) | Free at any modeled scale, no per-plan volume gate (ADR-008) — throughput unverified at scale, flagged in inbox-pipeline.md |
| Background jobs | Postgres `processing_queue` + scheduled poll | Inngest/Trigger.dev/SQS | Avoids a new vendor before there's evidence of need (ADR-007) |
| CI | GitHub Actions, public repo | — | Repo is public (`hbkdad/lifeops`) → **unlimited free Actions minutes**, not the 2,000 min/mo private-repo allowance |
| Payments | Stripe (standard ~2.9%+$0.30/transaction, verify at Phase 12) | — | Not a candidate for a $0 alternative — payments processing is inherently a paid, usage-based service; the mission's constraint is about avoiding *unnecessary* fixed costs, not this |

## Cost at scale

Figures are **monthly**, USD, and additive down each column. "Users" = individual signed-in people; households assumed ~1.3 users/household on average for MAU-counting purposes.

| Line item | 100 users | 1,000 users | 10,000 users | 100,000 users |
|---|---|---|---|---|
| Supabase (DB+Auth only, no file storage) | $0 (free; metadata-only rows, nowhere near 500MB) | $0 (free tier plausibly still covers this — re-check actual DB size, not a calendar date) | $0–$25 (Pro only if 500MB DB or 50k MAU is actually approached) | $25 (Pro — DB size at this scale likely does warrant it) |
| Cloudflare R2 (document storage) | $0 (well under 10GB) | $0 | $0–$15 (est., depends on avg. document size/retention — instrument early) | ~$15–40 (est.) |
| Cloudflare Workers (hosting) | $0 | $0 | $0 (well under 100k req/day) | $0–modest (re-check request volume against the free allowance as it's confirmed at this scale) |
| Cloudflare Email Routing | $0 | $0 | $0 (unverified at this volume — flagged) | $0 (unverified — flagged, re-test) |
| AI extraction (Haiku 4.5, Tier 2 only) | ~$1.20 (100 × 8 × 40% × ~$0.004/doc) | ~$12 | ~$120 | ~$1,200 |
| GitHub Actions | $0 (public repo, unlimited minutes) | $0 | $0 | $0 |
| Stripe processing fees | pass-through, ~2.9%+$0.30/txn on whatever revenue exists | pass-through | pass-through | pass-through |
| **Total fixed infra (excl. Stripe passthrough)** | **~$1–2** | **~$12** | **~$120–160** | **~$1,240–1,265** |

**Read:** With storage moved to R2 and hosting moved to Cloudflare Workers, genuine $0 infra cost plausibly extends into the thousands of users — materially better than the original model's "$20–45/mo starting at first user" story, and the correction came directly from being asked to look harder rather than accept the first reasonable-sounding answer. The AI-extraction line remains the dominant variable cost by design (ADR-006) because it's the one line that scales with actual product usage rather than headcount.

## What would break this model (watch for these, don't pre-solve them)
- Tier 2 AI hit rate meaningfully above the assumed 40% (e.g., if most users primarily photograph rather than forward) — cheap to re-measure once real usage data exists; Haiku 4.5 cost is low enough that even a 2–3x miss on this assumption doesn't change the qualitative conclusion.
- Per-household document storage meaningfully above Supabase Pro's 100GB pooled allowance at the 10k/100k tiers — worth instrumenting average document size early so this is caught before it's a surprise bill.
- Cloudflare Email Routing throughput limits at real volume (explicitly unverified, see inbox-pipeline.md) — test before assuming it holds at 10k+ users.
