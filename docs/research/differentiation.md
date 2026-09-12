# Differentiation Strategy

Status: Phase 0 synthesis, based on [market.md](market.md), [competitors.md](competitors.md), [pain-points.md](pain-points.md). This is our point of view, not a citation-backed document.

## What is NOT open territory
- "Forward an email or photograph a document, AI extracts structured data" — Lifey and Vorby both do this today, in production, for their respective scopes (professional life-admin; home inventory).
- "Family Operating System" as a brand phrase — trademarked by Trustworthy.
- Passive inbox-scanning for a household — Babs does this for school/kids logistics already.
- Digital vault + collaborator sharing — Trustworthy, Everplans, GoodTrust, Quicken LifeHub all do this.

We should not position LifeOps as inventing any of these mechanics. We should position it as the first to connect all of them into one continuously-useful graph, with a trust posture the incumbents have each visibly failed at in some dimension (see pain-points.md).

## What IS open territory

1. **The full life-graph, not a single domain.** Every competitor found owns at most one or two nodes (home OR vault OR calendar OR subscriptions OR vehicle). None model the relationships between them (vehicle → insurance policy → renewal date; home → appliance → warranty → maintenance interval). The mission's "Life Graph" concept — answering "what's connected to my truck?" or "what expires this year?" across domains — has no direct competitor doing it end-to-end.

2. **Attention-triage as the default home screen, not a record list.** HomeZada's "comprehensive but overwhelming" complaint is a direct opening: ship "Now / Soon / Upcoming / Informational" as the first thing a user sees, ever. This is cheap to build relative to its perceived value and directly answers a documented complaint.

3. **Automation-first at every tier, not just the top tier.** Trustworthy gates "AI answers" behind its $240/yr Gold plan; Quicken LifeHub's automation is reviewer-confirmed weak at any price. Making extraction/reminders/normalization work on the free tier (with storage/scope limits, not automation limits) is a legitimate wedge — it's also consistent with the mission's "AI is an implementation detail, not the product" principle.

4. **Trust-by-design as a marketed feature, not boilerplate legal copy:**
   - No retroactive paywalling of previously-free functionality (direct answer to Cozi backlash).
   - No opaque success fees anywhere in the monetization model (direct answer to Rocket Money backlash).
   - Data export/portability promoted proactively (direct answer to Centriq's shutdown leaving 400k households stranded).
   - Transparent, single-click cancellation (direct answer to Rocket Money's cancellation complaints, and increasingly a legal requirement — see risks.md).

5. **Price positioning below Trustworthy, above Quicken LifeHub, competitive with single-domain apps.** Quicken LifeHub ($1.99/mo) is cheap but functionally thin. Trustworthy Silver/Gold ($120–240/yr) is full-featured but vault-first and priced for a narrower affluent household. A LifeOps "Plus" tier around $6–9/mo and "Family" around $12–15/mo would undercut Trustworthy meaningfully while being priced in line with what users already pay for a single point solution like Vorby or Dex — i.e., LifeOps should cost about the same as ONE of the point solutions it replaces, not the sum of all of them. See [pricing.md](pricing.md).

## Recommended wedge (not the whole product)

Given competitors are already shipping pieces of this, the MVP should not attempt the full 40+ entity domain model on day one. The strongest defensible wedge, informed by this research:

**Start with the ingestion pipeline + obligation/reminder layer + Today screen, applied across just 2–3 domains first (documents/bills + home/warranties + vehicle), rather than 1 domain done narrowly (like Vorby) or a full vault with weak automation (like Trustworthy/Quicken LifeHub).** This is narrower than the mission's full 40-entity domain model but wide enough to prove the cross-domain graph thesis that nobody else has, without competing head-on with a single-domain incumbent on their own turf. Household collaboration and the remaining domains (pets, licenses, appointments) layer on after the graph + inbox loop is validated. This should be revisited explicitly in the architecture/MVP-backlog proposal.
