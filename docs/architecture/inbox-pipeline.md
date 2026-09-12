# Universal Inbox Pipeline

Status: Phase 1. Implements ADR-006, ADR-007, ADR-008. Concrete implementation of the mission's INGEST→CLASSIFY→EXTRACT→...→CREATE REMINDERS pipeline.

## Ingestion sources (MVP — ADR-010 scope)

| Source | Mechanism | Cost |
|---|---|---|
| Upload (file/photo) | Browser file input (`capture="environment"` opens the phone camera directly on mobile — no extra library) → Supabase Storage signed upload URL | $0 |
| Paste/type | Plain textarea in-app | $0 |
| Forward an email | Cloudflare Email Routing → Worker → posts into the same pipeline (ADR-008) | $0 at MVP volume |
| URL / share target | *Deferred* — PWA `share_target` manifest entry is cheap to add later; not core to proving the loop | — |

Every source produces one `inbox_items` row (`status='pending'`) and, for file/photo sources, a raw object in Supabase Storage.

## Pipeline stages → implementation

The mission lists 8 arrows (CLASSIFY → ... → DETECT RECURRENCE) between INGEST and CONFIDENCE SCORE. These are implemented as **one extraction module with composable detector functions**, not 8 separate services — each detector annotates a shared working record; the module's output is a single `extractions` row.

1. **INGEST** — `inbox_items` row created; file (if any) lands in Storage. Enqueues a `processing_queue` job (ADR-007).
2. **CLASSIFY** — deterministic: MIME/file-signature sniffing (never trust the extension — validate actual bytes per the mission's security requirements) + cheap keyword heuristics on filename/subject/first-page text (`invoice`, `policy`, `renewal`, `statement`) to guess a starting category. No AI call.
3. **EXTRACT — Tier 1 (deterministic, $0, always runs first):**
   - Text-bearing input (email body, text-layer PDF): extract raw text via `pdfjs-dist`/`pdf-parse` (open-source).
   - Detector functions run over that text:
     - **DETECT DATES** — `chrono-node` (open-source NLP date parser)
     - **DETECT MONEY** — regex + currency-symbol/ISO-4217 parsing
     - **DETECT ORGANIZATIONS** — sender domain, letterhead/signature heuristics, simple alias table
     - **DETECT ASSETS** — keyword match against the household's existing `assets.name`/`metadata` (e.g., "Honda Civic" already on file)
     - **DETECT OBLIGATIONS / RECURRENCE** — keyword+pattern rules ("annual," "monthly," "renews," a recurring amount matched against past `obligations`) mapped to an RRULE guess
   - Each detector contributes a per-field confidence; **NORMALIZE** canonicalizes into typed values (ISO date, integer minor-unit amount + currency code, canonical org name).
4. **EXTRACT — Tier 2 (AI-assisted, usage-based, only when needed):** triggered when the input has no usable text layer (a photographed receipt/warranty card/appliance label) **or** Tier 1's composite confidence is below threshold. Calls the internal `ExtractionProvider` interface — reference implementation: Claude Haiku 4.5 (vision input, structured-output tool use to force the same field schema Tier 1 produces, so downstream code doesn't care which tier ran). Runs as a `processing_queue` job, not inline in the request (ADR-007) — keeps upload response snappy regardless of AI latency.
5. **CONFIDENCE SCORE** — composite of detector agreement + tier (Tier 1 hits are usually high-confidence; Tier 2 fields are capped at "medium" unless corroborated by an existing record, e.g., matching an asset already on file).
6. **USER CONFIRMATION (mandatory, never skipped)** — review UI shows every extracted field next to its evidence (highlighted source snippet for text, a cropped region for images, sourced from `extractions.evidence`). Nothing is written to `obligations`/`assets` until the user confirms or edits. This is the direct implementation of the mission's "never silently convert uncertain extraction into important obligations."
7. **CREATE STRUCTURED RECORD** — on confirm, one transaction: create/update the `obligations` row (+ new `assets`/`organizations` rows if the user confirmed a new one), link the source `documents` row via `document_links`, write an `audit_events` row.
8. **CREATE REMINDERS** — default cadence by `obligations.type` (e.g., insurance_policy/warranty: 60/30/7/1 days before `due_date`; subscription: 7 days; bill: 3 days), user-customizable per obligation. Each reminder is its own `reminders` row, delivered by a scheduled `processing_queue` job.

## Why this stays inside the zero-capital constraint

Tier 1 requires no network call to any AI vendor and handles the majority of well-structured input (forwarded emails, text-layer PDFs — the common case for bills/statements/policy documents). Tier 2 is invoked only for the harder subset (photographed physical documents, low-confidence Tier 1 output), so AI spend scales with *actual need*, not with total ingestion volume. See [cost-model.md](cost-model.md) for the resulting per-user cost at 100–100,000 users.

## Open item flagged for Phase 5/6 implementation (UNVERIFIED)
Cloudflare Email Routing's exact throughput/deliverability characteristics under real production volume have not been load-tested — ADR-008 flags this explicitly. Verify before relying on it as the sole inbound-email path at scale; Mailgun/SendGrid remain the documented paid fallback.
