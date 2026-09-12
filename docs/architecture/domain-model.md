# Domain Model

Status: Phase 1. Implements ADR-004, ADR-005, ADR-011. Core tables only (MVP wedge — ADR-010); deferred entities are listed at the bottom, not built.

## Core tenancy

```sql
-- profiles extends Supabase-managed auth.users
profiles (
  id uuid primary key references auth.users(id),
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

household_members (
  household_id uuid references households(id),
  user_id uuid references profiles(id),
  role text not null default 'member' check (role in ('owner','admin','member','viewer')),
  invited_by uuid references profiles(id),
  joined_at timestamptz default now(),
  primary key (household_id, user_id)
);

people ( -- household members who may or may not have a login (e.g. a child)
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id),
  profile_id uuid references profiles(id), -- null if no login
  organization_id uuid, -- set if this "person" is actually a contact at an org (see organizations below)
  display_name text not null,
  relationship text, -- 'self','spouse','child','other'
  created_at timestamptz default now()
);
```

## Life Graph backbone (ADR-004, ADR-005)

```sql
assets (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id),
  type text not null check (type in ('home','vehicle','appliance','pet','other')), -- MVP ships home, vehicle only
  name text not null,
  owner_person_id uuid references people(id),
  metadata jsonb not null default '{}', -- vehicle:{vin,year,make,model}; home:{address,sqft}; appliance:{brand,model,serial}; pet:{species,breed,dob}
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

organizations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id), -- household's own record of this org, not a shared global directory
  name text not null,
  category text, -- 'insurer','utility','healthcare','school','government','retailer','other'
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

obligations (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id),
  type text not null check (type in ('bill','subscription','warranty','insurance_policy','licence','certification','appointment','maintenance')), -- MVP ships bill, subscription, warranty, insurance_policy
  title text not null,
  status text not null default 'active' check (status in ('active','completed','cancelled','expired')),
  amount_cents integer,
  currency text default 'USD',
  due_date date,
  recurrence_rule text, -- RRULE string; null = one-time
  related_asset_id uuid references assets(id),
  related_org_id uuid references organizations(id),
  related_person_id uuid references people(id),
  confidence_score numeric(3,2), -- null = manually entered
  source_extraction_id uuid references extractions(id),
  metadata jsonb not null default '{}', -- type-specific: insurance policy_number; maintenance interval_days
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

relationships ( -- generic Life Graph edges, beyond the FK columns above
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id),
  from_type text not null, -- 'asset'|'obligation'|'document'|'person'|'organization'
  from_id uuid not null,
  to_type text not null,
  to_id uuid not null,
  relation text not null, -- 'contains','owns','insures','requires', etc.
  created_at timestamptz default now()
);
```

## Universal Inbox

```sql
inbox_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id),
  source text not null check (source in ('upload','email','paste','photo')),
  raw_storage_path text, -- Cloudflare R2 object key; null for paste
  raw_text text, -- paste content, or extracted email body
  status text not null default 'pending' check (status in ('pending','processing','needs_review','confirmed','rejected','failed')),
  submitted_by uuid references people(id),
  created_at timestamptz default now()
);

extractions (
  id uuid primary key default gen_random_uuid(),
  inbox_item_id uuid references inbox_items(id),
  tier text not null check (tier in ('deterministic','ai_assisted')),
  extracted_fields jsonb not null, -- {title, amount, currency, due_date, org_name, asset_hint, recurrence}
  evidence jsonb, -- snippets/spans backing each field, shown in the confirmation UI
  confidence_score numeric(3,2) not null,
  ai_provider text, -- null for deterministic tier
  ai_model text,
  created_at timestamptz default now()
);

reminders (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid references obligations(id),
  fire_at timestamptz not null,
  channel text not null default 'email' check (channel in ('email','push','sms')), -- MVP ships email only
  status text not null default 'scheduled' check (status in ('scheduled','sent','dismissed','snoozed')),
  created_at timestamptz default now()
);

processing_queue ( -- ADR-007
  id uuid primary key default gen_random_uuid(),
  job_type text not null, -- 'extract_tier2','send_reminder','weekly_brief'
  payload jsonb not null,
  status text not null default 'queued' check (status in ('queued','processing','done','failed')),
  attempts int not null default 0,
  run_after timestamptz not null default now(),
  created_at timestamptz default now()
);
```

## Documents

```sql
documents (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id),
  storage_path text not null, -- Cloudflare R2 object key (ADR-012), not Supabase Storage
  original_filename text,
  mime_type text not null,
  file_size_bytes bigint,
  category text, -- 'receipt','warranty','insurance','tax','other'
  source_inbox_item_id uuid references inbox_items(id),
  created_at timestamptz default now()
);

document_links ( -- many-to-many: one document can relate to several things
  document_id uuid references documents(id),
  linked_type text not null check (linked_type in ('obligation','asset','person')),
  linked_id uuid not null,
  primary key (document_id, linked_type, linked_id)
);
```

## Entitlements (ADR-009) & audit

```sql
plans (
  id text primary key, -- 'free','plus','family','pro'
  name text not null,
  price_cents integer not null default 0,
  features jsonb not null default '{}'
);

household_entitlements (
  household_id uuid primary key references households(id),
  plan_id text not null references plans(id) default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'active' check (status in ('active','past_due','canceled')),
  updated_at timestamptz default now()
);

audit_events (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id),
  actor_person_id uuid references people(id),
  action text not null, -- 'document.created','obligation.updated','member.invited'
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);
```

## RLS pattern (ADR-011)

Applied to every tenant-scoped table; shown once here, repeated per-table in migrations:

```sql
alter table obligations enable row level security;

create policy household_isolation_select on obligations
  for select using (
    household_id in (select household_id from household_members where user_id = auth.uid())
  );

create policy household_isolation_insert on obligations
  for insert with check (
    household_id in (
      select household_id from household_members
      where user_id = auth.uid() and role in ('owner','admin','member')
    )
  );

create policy household_isolation_update on obligations
  for update using (
    household_id in (
      select household_id from household_members
      where user_id = auth.uid() and role in ('owner','admin','member')
    )
  );
-- no policy grants 'viewer' write access — the absence of a policy is the enforcement, not a runtime role check
```

## Traceability: mission entity → physical table

| Mission entity | Physical table | Note |
|---|---|---|
| User | `auth.users` + `profiles` | Supabase-managed |
| Household | `households` | |
| HouseholdMember | `household_members` | role enum |
| Person | `people` | |
| Asset, Home, Vehicle, Appliance, Pet | `assets` (type discriminator) | appliance/pet types reserved, not built in MVP |
| Organization | `organizations` | |
| Contact | `people` with `organization_id` set | not a separate table |
| Document, DocumentVersion | `documents` | version history deferred until first real need (Supabase Storage retains object history in the interim) |
| Record | *(conceptual)* | realized as rows in obligations/assets/documents |
| Obligation, Bill, Warranty, InsurancePolicy, Licence, Certification, Appointment, MaintenanceItem | `obligations` (type discriminator) | licence/certification/appointment/maintenance types reserved, not built in MVP |
| MaintenanceHistory | *(deferred)* | add when maintenance domain is built post-MVP |
| Event | *(deferred)* | `obligations` type='appointment' covers calendar-like dates for MVP; dedicated non-obligation calendar events deferred |
| Subscription | `obligations` type='subscription' | |
| Receipt | `documents` category='receipt' | |
| Expense | *(deferred)* | not a budgeting/ledger product; out of scope unless research later shows otherwise |
| Responsibility, Task | *(deferred)* | Phase 10 household collaboration |
| RecurringRule | `obligations.recurrence_rule` | RRULE string, not a separate table |
| Notification | `reminders` (+ delivery log, added at Phase 7 multi-channel work) | |
| InboxItem | `inbox_items` | |
| Extraction, ExtractionEvidence | `extractions` (evidence is a jsonb column) | |
| Tag | *(deferred)* | add with a generic taggable join table at Phase 9 (search) |
| Relationship | `relationships` | the Life Graph edges |
| AuditEvent | `audit_events` | |
| UserPreference | `profiles` (preferences jsonb column, added when first preference exists) | |
| Consent | *(deferred to Phase 3)* | added alongside auth/privacy work, not before it's needed |
| Integration | *(deferred)* | no third-party integrations in MVP |
| Referral | *(deferred)* | Phase 13 growth loops |
| Plan, Entitlement | `plans`, `household_entitlements` | |

Nothing in the mission's domain model is discarded — everything not yet a physical table is either consolidated into a type-discriminated table (with the constraint value already reserved) or explicitly deferred to the phase that needs it.
