# Pricing Landscape & Recommendation

Status: Phase 0 research + synthesis, Sept 2026. Tier prices below are as-verified in this research pass; re-check before external use.

## Comparable pricing (verified)

| Product | Free tier? | Entry paid tier | Top tier | Model |
|---|---|---|---|---|
| Quicken LifeHub | No trial | $1.99/mo (annual) | — (single tier) | Flat vault, 30GB cap |
| Trustworthy | Yes, 2GB | $10/mo → $120/yr (Silver) | $40/mo → $480/yr (Platinum, concierge) | 4-tier, storage + service gated |
| Everplans | 60-day trial | $99.99/yr | — (single tier) | Flat |
| Vorby | 14-day trial | $5/mo (annual) – $7/mo (monthly) | — | Flat |
| Dex (personal CRM, adjacent) | Trial | $12/mo | — | Flat |
| Clay/Mesh (personal CRM, adjacent) | — | ~$10/mo | $30+/mo | Tiered |
| Monica (personal CRM, adjacent) | Free self-host | $10–15/mo hosted | — | Self-host vs. hosted |
| Rocket Money | Yes | $7–12/mo "pay what you want" + 35–60% negotiation success fee | — | Freemium + success fee |
| Cozi | Yes (ad-supported, 30-day calendar limit) | $39.99/yr (Gold) | — | Freemium |
| HomeZada | Yes (Essentials) | $99/yr (Premium) | $189/yr (Deluxe, 3 homes) | 3-tier |

## What this tells us

- The category spans roughly **$2/mo to $40/mo**, with most serious paid products clustering at **$8–20/mo** ($96–240/yr).
- Products priced under $5/mo (Quicken LifeHub) are reviewer-confirmed to be feature-thin on automation — cheap correlates with "just a filing cabinet" in this category.
- Products priced over $20/mo (Trustworthy Gold/Platinum) bundle concierge/human service, not just software — that's a different cost structure (labor) we should not assume we need to match at MVP.
- Group/household pricing (Cozi's single-subscription-covers-everyone model) is well received; per-seat pricing is not common in this category and would likely read as hostile to the "household" framing.
- A success-fee or revenue-share model (Rocket Money) generates disproportionate complaint volume relative to its revenue upside — avoid.

## Recommended LifeOps pricing bands (proposal, not final — revisit in architecture/monetization phase)

| Tier | Target price | Positioning |
|---|---|---|
| **Free** | $0 | Full inbox/extraction pipeline, capped storage + record count. Automation NOT gated (see differentiation.md) — only scale is gated. |
| **Plus** | $7–9/mo ($70–90/yr annual) | Individual, uncapped-ish storage, full reminder cadence, full Life Graph. Priced at parity with a single point-solution (Vorby, Dex) it replaces several of. |
| **Family** | $13–16/mo ($130–160/yr) | Multi-member household, roles (owner/admin/member/viewer), shared + private records. Single subscription covers the household (Cozi-style), not per-seat. |
| **Pro** (later) | TBD | Concierge/white-glove or higher storage/integration ceiling for power users — only build once Plus/Family retention is proven; do not front-load complexity here. |

This undercuts Trustworthy's household tiers (Silver/Gold at $120–240/yr) while being priced above Quicken LifeHub in a way that's defensible because automation is not gated behind it. Final numbers should be revisited against actual COGS (storage, AI inference, SMS/email costs) once the architecture is set — see [FINOPS cost model, to be produced in Phase 1].
