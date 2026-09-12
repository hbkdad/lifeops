# Competitive Landscape

Status: Phase 0 research, Sept 2026. Every entry below is sourced from a live fetch or search this session, not from memory. Pricing/features change quickly — re-verify before quoting externally.

## Tier 1 — Closest philosophical match (AI ingestion → structured record)

### Lifey (lifeyai.app)
- **Pitch:** "Snap a photo of any document or forward an email" → on-device AI "extracts every important detail — dates, amounts, parties — and organizes it automatically."
- **Features:** AI document scanning, subscription/recurring-charge tracking, deadline reminders that "learn your habits," unified calendar (Google/Outlook/Apple sync).
- **Platform:** Android 13+ only; iOS is waitlist.
- **Pricing:** Not disclosed publicly.
- **Target:** Busy professionals (individual, not explicitly household/family framed).
- **Read on LifeOps:** This is the single closest match to our exact "forward it, photograph it" mechanic found in this research. It is individual-first and professional-framed rather than household-first, and is pre-iOS. Our household/family-graph angle (vehicles, home, pets, multiple members with roles) is the differentiation, but the ingestion mechanic itself is not unclaimed territory — assume a fast-moving competitor here.

### Babs (hellobabs.ai)
- **Pitch:** "Family life, auto-magically organized." Reads Gmail directly and extracts kid/school/activity action items without requiring the user to forward anything.
- **Features:** Auto-updated calendar, AI-generated to-do lists, contextual reminders, color-coded daily family lineup, task delegation.
- **Pricing:** Not disclosed; waitlist-only as of this research.
- **Target:** Parents managing children's schedules/school communication specifically — narrower than whole-household life admin.
- **Read on LifeOps:** Validates household-framing and inbox-native extraction, but scoped to kids/school logistics, not documents/warranties/vehicles/insurance. Passive Gmail-scanning (vs. explicit forward) is a UX choice worth evaluating — it lowers friction but raises privacy/consent questions we should design around deliberately (see [risks.md](risks.md)).

## Tier 2 — Digital vault / estate incumbents (document-storage-first, not extraction-first)

### Trustworthy — "The Family Operating System®" (trademarked name)
- **Pricing (verified from pricing page):**
  | Tier | Price | Storage | Notes |
  |---|---|---|---|
  | Free | $0 | 2GB | single member |
  | Silver | $10/mo (billed annually, $120/yr) | 10GB | household basics |
  | Gold | $20/mo (billed annually, $240/yr) | 100GB | "AI answers," priority support |
  | Platinum | $40/mo (billed annually, $480/yr) | Unlimited | 3 concierge hours, unlimited email addresses |
- **Features:** Passwords, insurance, taxes, property, financial accounts, emergency instructions, family archives; invite family members/advisors as collaborators; 50% discount for military/community heroes.
- **Read on LifeOps:** Manual-entry/vault-first, priced for higher-net-worth households, and — critically — **has already trademarked "Family Operating System."** LifeOps must not use that phrase in marketing/branding. Their AI ("Gold: fully automate with AI answers") is a paid-tier upsell, not the core ingestion loop; our AI-first, all-tiers-benefit approach is a real point of difference.

### Quicken LifeHub
- **Pricing:** $1.99/mo billed annually — the cheapest vault in the category. No free trial.
- **Features:** Document vault (PDF/photo upload, category tagging), "Quicken Assist" AI guidance, 30GB storage cap.
- **Gap (from reviewers):** Explicitly lacks automatic renewal reminders, expiration notifications, and AI-driven organization beyond basic category suggestions.
- **Read on LifeOps:** This is the clearest, most direct evidence of whitespace: a major incumbent shipped the vault half of this product and reviewers are calling out the exact obligation/reminder layer LifeOps is built around as missing.

### Everplans / GoodTrust / Estate Bee
- Single flat-fee ($99.99/yr Everplans) or one-tier estate/legacy vaults. Admin-controlled sharing (not granular). Narrower scope — end-of-life/legal focus, not ongoing household operations. GoodTrust: 4/5 Trustpilot but polarized (19% 1-star).
- **Read on LifeOps:** Adjacent, not directly competing on the ongoing-obligations use case, but likely to expand toward it.

## Tier 3 — Single-domain point solutions (the fragmentation LifeOps unifies)

| Domain | Player(s) | Signal |
|---|---|---|
| Home inventory/maintenance | HomeZada ($0/$99/$189/yr, est. 2012) | "Comprehensive but overwhelming"; mobile app ~2.9★; billing/auto-renewal complaints |
| Home manuals/warranty | Centriq (400k+ homes) | **Shut down Jan 31, 2025** — orphaned user base |
| Home inventory + warranty via receipt-forward | Vorby ($5–7/mo) | Forward email receipt → auto-creates inventory item + warranty; reminders at 90/30/7 days — closest match to our reminder cadence, but scoped to home inventory only |
| Family calendar | Cozi ($39.99/yr Gold) | 2024 paywall change (30-day free calendar limit) tanked Trustpilot to 2.1★, "bait and switch" backlash |
| Subscription tracking / bill negotiation | Rocket Money ($7–12/mo + 35–60% negotiation success fee) | Heavy complaints: opaque negotiation fees, deliberately hard cancellation flow |
| Personal CRM (adjacent category) | Dex ($12/mo), Clay/Mesh ($10–30/mo), Monica (free self-host / $10–15/mo hosted) | Validates "let software remember people for me"; Monica's open-source self-host option is a notable trust differentiator |
| Vehicle maintenance/insurance | GarageHub, MyAutoLog, "Policy Tracker & Reminder", Carfax Car Care | Fragmented, single-purpose, no household context |
| License/certification renewal | CertKeeper, My Certification Tracker | Mostly B2B/professional-compliance framed |
| Pet records | VitusVet, PetnotePlus, Pet Parents | Vet-record focused, no integration with rest of household |

## Synthesis

Every single domain in LifeOps's scope already has a funded or established point solution. That is validation, not a blocker — it means willingness-to-pay is proven per-domain. Nobody has connected them into one graph with one ingestion pipeline. The two products closest to our actual mechanic (Lifey, Babs) are both early/waitlisted and narrower in scope than the full household life-graph. This is a real, live, moving competitive window — not a blue ocean, and not yet won by anyone.

## Sources
- [Trustworthy Pricing](https://www.trustworthy.com/pricing) · [Trustworthy Reviews](https://www.trustworthy.com/reviews)
- [Quicken LifeHub review — CBS News](https://www.cbsnews.com/news/quicken-lifehub-product-review/) · [Kiplinger](https://www.kiplinger.com/personal-finance/shopping/quicken-launches-new-tool-to-protect-your-financial-documents-is-it-worth-it)
- [Everplans review — FindersList](https://www.finderslist.com/estate-planning-services/tools/everplans) · [Everplans vs GoodTrust vs Trustworthy](https://safekeep.co/everplans-vs-goodtrust-vs-trustworthy-review-2026/)
- [HomeZada pricing](https://www.homezada.com/homeowners/pricing) · [Home maintenance apps comparison](https://www.dwellpulse.com/blog/the-best-home-maintenance-apps-in-2026-an-honest-comparison/)
- [Centriq shutdown](https://homebeacon.app/alternatives/centriq-alternative)
- [Vorby warranty tracker](https://vorby.com/features/warranty-tracker) · [Vorby FAQ](https://vorby.com/faq)
- [Cozi review 2026](https://www.usecalendara.com/blog/cozi-review-2026) · [Cozi Trustpilot](https://www.trustpilot.com/review/cozi.com)
- [Rocket Money review](https://www.thepennyhoarder.com/budgeting/rocket-money-review/) · [Is Rocket Money legit](https://www.howthemarketworks.com/personal-finance/is-rocket-money-legit/)
- [Personal CRM list — Dex](https://getdex.com/blog/personal-crm-list/)
- [Lifey](https://www.lifeyai.app/) · [Babs](https://www.hellobabs.ai/)
