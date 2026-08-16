# QuoteGate v1 spec

Thin slice for Lakeside Plumbing (Jobber): **ingest → proposal → mobile HITL → execute → audit**.

Nothing customer-visible sends without an owner action. Autonomy is a policy the owner writes, not a default.

```
Inbound job / photos / notes
        → Python agent (LangGraph)
        → Policy engine
              ├─ (v1: never) auto-execute
              └─ HITL queue
                    ├─ Expo swipe (owner)
                    └─ Next.js console (audit / edit / policy)
                          → resume graph
                          → Jobber estimate send + void prior doc
                          → immutable audit log
```

## 1. Users and jobs-to-be-done

| Actor | Device | Job |
| --- | --- | --- |
| Owner (approver) | iPhone / Android, Expo | See a draft in <15s, swipe approve, edit a line, reject with reason |
| Tech | Existing Jobber mobile | Capture photos + a voice/text note on the job. Does not send price. |
| Operator (often the same owner at night) | Next.js | Queue, traces, policies, audit export |

V1 is single-shop, single-approver, Jobber-only.

## 2. Ingest

### 2.1 Triggers

| Trigger | Source | Payload |
| --- | --- | --- |
| `job.note_ready` | Expo “Send to QuoteGate” on the job, or Jobber webhook + poll | `job_id`, tech_id, customer_id |
| Photos | Uploaded to S3 via API; Jobber attachments pulled by id | image URLs, EXIF stripped |
| Voice | Expo m4a → Whisper (or equivalent) transcript stored as a note | transcript, confidence |
| Text note | Tech one-liner (“add thermostat, they want honeywell”) | raw text |
| Pricebook snapshot | Nightly Jobber sync + on-demand | items: sku, name, trade, price, cost, taxable |
| Prior estimates | Jobber estimates on this job | id, total, status, line items, document URLs |

### 2.2 API

`POST /v1/jobs/{job_id}/ingest`

```json
{
  "source": "expo" | "jobber_webhook",
  "photos": [{ "s3_key": "...", "caption": "water heater plate" }],
  "voice_s3_key": "optional",
  "note": "homeowner asked to add a thermostat",
  "requested_kind": "estimate" | "change_order"
}
```

Returns `{ "run_id": "run_...", "status": "queued" }`. Ingest is idempotent on `(job_id, client_ingest_id)`.

### 2.3 Normalization

Write `IngestBundle` to Postgres (JSONB) + S3:

- stripped PII-capable fields listed in audit (customer name, address)
- photo keys
- transcript
- pricebook_version_id
- existing_estimate_ids

Then start the graph.

## 3. Proposal (Python agent)

LangGraph, checkpointer = Postgres. Thread id = `run_id`.

### 3.1 State

```python
class QuoteState(TypedDict):
    run_id: str
    shop_id: str
    job_id: str
    kind: Literal["estimate", "change_order"]
    ingest: IngestBundle
    findings: list[Finding]          # equipment, symptoms, requested extras
    options: list[QuoteOption]       # good / better / best or single
    customer_message: str            # SMS / email body
    confidence: float                # 0-1
    policy: PolicyDecision
    human: HumanDecision | None
    execution: ExecutionResult | None
```

### 3.2 Graph

```
extract_findings
    → match_pricebook
    → draft_options          # 1 option for repair; 3 for replacement
    → draft_customer_copy
    → score_confidence
    → policy_gate            # always HITL in v1
    → interrupt wait_for_human
    → apply_human_edits
    → execute_send
    → persist_audit
```

`interrupt()` after `policy_gate` with payload the mobile app renders. Resume with `Command(resume=HumanDecision)`.

### 3.3 Draft rules (v1, not a general LLM soup)

- Every line item must map to a pricebook sku **or** be flagged `unmatched` (forces HITL edit — already true).
- Replacements (detected by findings or job type): emit good / better / best. Good includes a repair-only option when a repair sku exists (I01, I04).
- Change orders: delta vs the latest **sent or signed** estimate; never vs an unsynced side document.
- Customer copy: shop template + option totals + “reply YES / open link”. No financing language unless a shop template includes it.
- Confidence drops on: unmatched skus, trade mismatch vs tech, missing photos, transcript confidence < 0.7, delta vs prior estimate > 15%.

### 3.4 Models (suggested)

- Findings / copy: a current multimodal model with shop-scoped pricebook in context (top-k retrieval, not the whole book).
- Matching: embeddings on sku name + description + common aliases learned from human edits (the moat).

Do not call Jobber from inside the LLM tool loop. Tools are typed Python nodes.

## 4. Policy engine

Config per shop, versioned, audited.

```yaml
shop_id: lakeside
version: 1
always_hitl: true          # v1 lock
thresholds:
  amount_cents: 0          # 0 = everything
  discount_percent: 0      # any discount → HITL (already)
  confidence_below: 1.0
rules:
  - change_order
  - customer_visible
  - unmatched_sku
  - trade_mismatch
  - void_and_resend
sla_seconds: 900           # 15 min owner SLA; escalate SMS at 10 min
assignee: owner
```

When we later allow auto-send, `always_hitl: false` plus `amount_cents: 150000` ($1,500) matches I03. Not in v1 execute path.

## 5. Mobile HITL (Expo)

Owner-only app. Push via APNs/FCM.

### 5.1 Screens

1. **Lock / push:** “Lakeside · change order · +$340 · 2 line items”
2. **Queue:** SLA-colored list (green <5m, amber <15m, red past SLA)
3. **Review:** photos, findings, options (totals + line items), customer message, confidence, policy reasons, prior estimate if change order
4. **Actions:**
   - **Approve** — swipe right / primary button
   - **Edit** — change qty, swap sku, edit message, toggle option visibility
   - **Reject** — reason enum: `wrong_sku`, `wrong_price`, `wrong_customer`, `not_now`, `other` + text
5. **Done:** “Sent via Jobber · estimate #… · audit …”

### 5.2 API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/v1/queue` | Open HITL items for this approver |
| GET | `/v1/runs/{run_id}` | Full review payload |
| POST | `/v1/runs/{run_id}/decision` | `{ action, edits?, reason? }` |

Decision body:

```json
{
  "action": "approve" | "edit_approve" | "reject",
  "edits": {
    "options": [],
    "customer_message": "optional"
  },
  "reason": "wrong_sku",
  "reason_text": "that's a 50gal not 40"
}
```

Idempotent on `Idempotency-Key`. Reject resumes the graph into a `notify_tech` node (Jobber note on the job) and does **not** send.

### 5.3 UX constraints from interviews

- One thumb. Owner is driving or standing in a driveway (I01, I02, I05).
- Edit is line-level, not a prompt box.
- Reject tells the tech in Jobber (I03).
- Change order shows **old total → new total** and “will void prior send” (I02).

## 6. Web console (Next.js)

Not the approval surface for v1 (phone is). Console is:

- Queue mirror (can approve if the phone is dead — same API)
- Run trace (node timings, model versions, pricebook version)
- Policy editor
- Audit log search + CSV export
- Shop settings: Jobber OAuth, assignee, templates

App router, server components for lists, one authenticated shop.

## 7. Execute

Only after resume with approve or edit_approve.

### 7.1 Jobber

1. If `kind=change_order` and a prior estimate was sent: void / archive prior Jobber estimate (and any e-sign request we created). Never leave two live numbers (I02).
2. Create estimate with chosen option line items (pricebook ids, not hallucinated prices).
3. Send to customer via Jobber’s client email/SMS path. If we own e-sign in v1, send **one** document from this estimate; do not clone to PandaDoc.
4. Write a job note: “QuoteGate send {run_id} approved by {user} at {ts}.”
5. Persist Jobber ids on `execution`.

Failures: retry with backoff; surface to owner push “send failed — tap to retry.” Do not silently mark sent.

### 7.2 Out of scope for execute v1

Housecall Pro write, ServiceTitan Present, payments, financing, dispatch, PDF pretty-print beyond Jobber’s native estimate.

## 8. Audit

Append-only `audit_events` table. No updates, no deletes. Hash-chain optional in v1; timestamp + actor + run_id is enough for the pilot.

| event_type | payload (minimum) |
| --- | --- |
| `ingest.received` | source, photo count, note hash |
| `proposal.drafted` | option totals, sku ids, confidence, model+prompt versions |
| `policy.decided` | rule hits, shop policy version |
| `human.notified` | channel (push), sla deadline |
| `human.decided` | action, edits diff, reason, device |
| `execute.sent` | jobber estimate id, voided ids, customer destination |
| `execute.failed` | error class |
| `tech.notified` | on reject |

GET `/v1/runs/{run_id}/audit` powers the console. CSV export for the LOI retro.

Human edits are stored as the pricebook-memory flywheel: `(raw_finding, chosen_sku, shop_id)`.

## 9. Data model (Postgres)

```
shops
users                 -- owner, tech (tech may only ingest)
jobber_connections    -- oauth tokens (encrypted)
pricebook_versions
pricebook_items
jobs                  -- mirrored subset
ingest_bundles
runs                  -- graph thread
run_state             -- checkpointer / LangGraph
hitl_tasks            -- queue projection
human_decisions
executions
audit_events          -- append-only
edit_memory           -- finding → sku corrections
```

Redis: queue fanout, push debounce, SLA timers.  
S3: photos, voice, estimate snapshots.

## 10. Repo layout

```
apps/api      FastAPI + LangGraph (this thin slice)
apps/web      Next.js console
apps/mobile   Expo app
packages/     none in v1 — keep the HITL kernel inside apps/api until a second vertical
```

Shared types: OpenAPI from FastAPI → `openapi.json` consumed by web and mobile.

## 11. Auth and tenancy

- Shop-scoped JWTs (owner vs tech vs operator).
- Jobber OAuth per shop.
- Mobile: email magic link for the pilot (Lakeside has one owner).
- Every query filtered by `shop_id`. No cross-shop retrieval for the model.

## 12. Non-goals (v1)

- Auto-send
- Multi-approver / dual control
- ServiceTitan / Housecall Pro writes (HCP read may wait)
- Inbound voice agent (Avoca’s job)
- Commercial bid desk
- Offline-first conflict sync (online-only; queue cached)

## 13. Pilot SLOs (Lakeside)

| SLO | Target |
| --- | --- |
| Ingest → push on owner phone | p95 < 45s |
| Decision API → Jobber sent or failed-push | p95 < 20s |
| Wrong-send incidents on QuoteGate jobs | 0 |
| Audit completeness | 100% of runs have ingest + decision + execute/fail |

## 14. Build order (after this spec)

1. Jobber OAuth + pricebook sync + `audit_events`
2. Graph with canned findings (no model) → HITL interrupt → fake send
3. Expo review + swipe against the real queue API
4. Jobber estimate create/send + void prior
5. Multimodal draft + confidence
6. Next.js console (trace + policy + export)
7. Lakeside live on designated jobs

## 15. Hybrid price (product, not code)

$0 during 90-day LOI. Then $299/mo + $2/executed send (see LOI). Meter = `execute.sent` events.
