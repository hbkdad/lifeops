# Project Risk Register

Execution/technical risk, updated continuously as the project progresses. Market/competitive risk is tracked separately in [docs/research/risks.md](docs/research/risks.md) (a Phase 0 snapshot); this file is the living register.

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scope creep: building toward the full 40+ entity domain model before the core ingestion→obligation loop is validated | High | High | Narrow MVP wedge recommended in Phase 0 (see ROADMAP.md open question) — needs Phase 1 ratification. |
| Competitive window closing: Lifey/Babs ship a cross-domain graph before we do | Medium | High | Prioritize end-to-end thin-slice speed over domain-model completeness; revisit at each phase gate. |
| AI extraction errors presented as confident structured data | Medium | High (this is a trust product — a wrong renewal date is worse than a missing one) | Mission already requires confidence scoring + user confirmation before creating obligations from extracted data; do not weaken this in implementation. |
| Zero-capital constraint erodes under real usage (storage/inference costs scale with users) | Medium | Medium | Cost modeling at 100/1k/10k/100k users required before each paid-service decision, per mission's own rule; revisit in Phase 1 architecture and again at Phase 12 (payments). |
| Monetization missteps (surprise paywalls, opaque fees) — category has documented, severe precedent (Cozi, Rocket Money) | Low (if we follow our own decisions) | Severe | See DECISIONS.md trust-by-design commitments; treat as a hard constraint on the Phase 12 payments design, not a suggestion. |
| Solo-architect execution: no real specialized review (security, accessibility, a11y) until subagent roles are actually created | Medium | Medium | Create the specific subagent role right before the phase that needs it (e.g., security-auditor before Phase 3 ships auth) rather than deferring indefinitely. |
| This document goes stale and stops being trusted | Medium | Low–Medium | Update at the end of every meaningful work session, per the mission's PROJECT MEMORY requirement — treat a stale RISKS.md as itself a signal something was skipped. |
| Supabase's default/shared auth email sender has a low rate limit | Confirmed (hit it during Epic 2 testing after 2 signups in a few minutes) | Medium — blocks real signup testing/onboarding at even light volume | Configure a custom SMTP provider (e.g. Resend, which has a workable free tier) in Supabase Auth settings before any real user testing or launch — not needed for solo development, but treat it as a Phase 3 exit criterion, not a Phase 12 surprise. |
