# Market & Competitive Risks

Status: Phase 0 research + synthesis. This document covers market/competitive/legal risk. Project execution/technical risk is tracked separately in the top-level [RISKS.md](../../RISKS.md) and updated continuously, not just at Phase 0.

## 1. Naming collision — "Family Operating System" is trademarked
Trustworthy operates under the registered mark "The Family Operating System®." LifeOps's own mission language ("Personal + Household Administration Operating System") is adjacent but not identical. **Action:** avoid using "Family Operating System" verbatim in any public-facing marketing; treat "LifeOps" itself as a working codename only until a trademark search is done before public launch.

## 2. The closest competitors are moving right now, not hypothetical
Lifey and Babs both launched/waitlisted in 2026 with a near-identical core mechanic ("forward it / photograph it, AI extracts and organizes"). Neither is fully shipped cross-platform yet (Lifey is Android-only; Babs is waitlist-only), which is our actual window — but it is a window measured in months, not years. **Action:** the MVP backlog should prioritize shipping the ingestion-to-obligation loop end-to-end fast, on a narrow domain wedge, over building out the full 40-entity domain model before anything is usable. See [differentiation.md](differentiation.md) wedge recommendation.

## 3. Monetization missteps are reputation-fatal in this category, not just revenue-neutral
Cozi's abrupt paywall change and Rocket Money's opaque success fees both produced sustained, public trust collapse (2.1★ and ongoing BBB complaints respectively) in a category where the product holds sensitive household/financial data. Trust, once lost here, appears to not recover based on the review history observed. **Action:** monetization changes must be additive (new tiers/features) rather than subtractive (removing previously-free capability), and any success-fee-style revenue must be pre-disclosed per instance, never retroactive.

## 4. Regulatory trend toward mandatory easy-cancellation ("click-to-cancel")
Rocket Money's cancellation-friction complaints sit inside a broader, active US regulatory trend (FTC negative-option/click-to-cancel rulemaking and parallel state laws) tightening requirements that cancellation be no harder than sign-up. **Action:** build self-service, single-action in-app cancellation from the first Stripe integration, not as a later compliance retrofit — cheaper to build right the first time than to retrofit under regulatory pressure.

## 5. Single-purpose competitor mortality is a real, demonstrated failure mode
Centriq (400,000+ homes) shut down outright in January 2025. If LifeOps ever narrows to a single-domain product under resourcing pressure, it inherits this same fragility. **Action:** the cross-domain graph is not just a product differentiator, it's the thing that makes LifeOps's retention/monetization more durable than any single-domain point solution it competes with — protect that scope discipline even under pressure to ship a narrower "good enough" v1.

## 6. Category is adjacent to extremely sensitive data, raising the stakes on every security lapse
Every competitor in this space (vaults, estate planning, home inventory tied to insurance) handles data that is meaningfully more sensitive than typical consumer SaaS (financial account numbers, passwords, estate instructions, insurance policies, ages/identities of household members including children in Babs's case). A breach or data-handling failure in this category is reputationally catastrophic in a way it might not be for, e.g., a to-do app. **Action:** security/privacy work (RLS, tenant isolation, upload validation, encryption) is not a Phase 14 afterthought — it must be load-bearing from Phase 3 (auth/tenancy) onward. See mission's own security requirements, which this research confirms are proportionate to the category, not excessive.

## 7. "Comprehensive but overwhelming" is a documented failure mode we could walk straight into
HomeZada's core complaint is exactly the risk profile of the mission's own 40+ entity domain model if shipped without a strong triage/attention layer. **Action:** the Today/triage screen is not a nice-to-have polish item — ship it early enough that it's true even when the data model is still small, and treat "does this increase or reduce perceived overwhelm" as a real product review gate, not just an aesthetic one.
