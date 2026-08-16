# Letter of Intent — QuoteGate design partner

**Status:** Issued 2026-08-16 against interview **I-01** (residential HVAC, 8 trucks, Jobber).  
**Purpose:** Countersignable LOI. Fill the highlighted fields when a named company agrees; terms below are the ones I-01 already accepted in substance.

This is a **non-binding** commercial LOI except for the confidentiality, data-use, and exclusivity-window clauses in §6, which are binding once signed.

---

**QuoteGate** (“Vendor”)  
and  
**________________________________** (“Company”)  
**Primary contact:** ________________________________  
**FSM:** Jobber / Housecall Pro (circle) **Tenant ID:** ________  
**Effective date:** ________

## 1. What we are building together

A 30-day design partnership for QuoteGate: technicians capture job notes and photos; an agent drafts scope, price, and the customer message; a Company approver **must approve, edit, or reject on a phone** before any customer-visible quote or change order is sent; every decision is written to an audit log; approved documents are written back to Company’s FSM.

Vendor will **not** replace Company’s FSM, dispatch, or inbound phone answering.

## 2. Company commitments

During the 30-day pilot, Company will:

1. Designate one owner/GM as the primary approver and install the Expo TestFlight/Android build on that person’s phone.
2. Route at least **20 real quotes or change orders** through QuoteGate (target: all replacement quotes and any estimate ≥ $1,500).
3. Join a **20-minute weekly** working session (same weekday).
4. Provide read/write access to a Jobber or Housecall Pro sandbox or production tenant under Company’s control, plus a price book export.
5. Give written product feedback on: time-to-approve, wrong-price catches, and any quote they would not have sent.

Company is **not** obligated to pay during the pilot. Company is **not** obligated to buy after the pilot.

## 3. Vendor commitments

Vendor will:

1. Deliver the thin slice: ingest → proposal → mobile HITL → execute → audit, hosted for Company only.
2. Gate, by default: customer-visible send, amounts over Company’s threshold (default **$1,500**), discounts **>8%** below book, replacement-option quotes, financing/warranty language.
3. Auto-approve (if Company opts in) book-priced service items under the threshold.
4. Keep an immutable audit trail Company can export (CSV/JSON).
5. SLA target: push notification to approve within **15 seconds** of proposal; Company-side approve is human. Vendor will instrument time-to-notify.
6. Provide a single Slack/SMS escalation contact.

## 4. Commercial sketch (not an invoice)

If Company continues after day 30, the intended v1 price is:

- Platform: **$499/month**
- Outcome: **$2 per quote or change order actually sent** (not drafted)
- Cap during months 2–3: **$799/month** all-in while we tune

Either party may walk at day 30 with no fee. If Company continues, first paid month starts on the first of the following month.

## 5. Success criteria (how we know it worked)

The pilot is a success if **all** of the following are true:

| Metric | Target |
|---|---|
| Quotes processed | ≥ 20 |
| Median time, proposal → push received | < 30 seconds |
| Median time, push received → approve/edit/reject | < 2 minutes on jobs where the approver is available |
| Wrong-sends caught | ≥ 1 documented catch **or** zero customer-visible pricing incidents |
| Approver would keep using | “Yes” on the exit call |

## 6. Binding clauses

**Confidentiality.** Each party will not disclose the other’s non-public information for 2 years. Company customer PII stays in Company’s tenant; Vendor stores only what is needed to draft, gate, send, and audit, and will delete on written request within 30 days after the pilot unless Company converts to paid.

**Data use.** Vendor may use **de-identified** product telemetry (approve latency, edit rates, policy-hit rates) to improve QuoteGate. Vendor will not train public models on Company’s customer names, addresses, or photos.

**Exclusivity window.** For 60 days from the effective date, Company will not sign a competing “quote/change-order HITL agent” design partnership. Company may keep Jobber/HCP/ST, Avoca, and any existing tools.

**No partnership / no hire restriction.** This LOI does not create a legal partnership. No non-solicit unless a paid MSA says otherwise.

**Publicity.** Vendor will not name Company without written approval. A joint case study is optional after a successful pilot.

## 7. Term

Pilot: **30 days** from the first production quote ingested. Either party may terminate the pilot with 3 days’ email notice. §§6–7 survive.

## 8. Signatures

The parties intend to negotiate a short MSA if the pilot succeeds. Until then, this LOI is the whole agreement.

| | QuoteGate | Company |
|---|---|---|
| Signature | ________________ | ________________ |
| Name | ________________ | ________________ |
| Title | Founder | ________________ |
| Date | ________________ | ________________ |

---

### Internal issue record

| Field | Value |
|---|---|
| Issued to profile | I-01 — 8-truck residential HVAC, Jobber, Phoenix ICP |
| Why this partner | 23/25 score; named $2–4k/mo leakage; lock-screen approver; Jobber tenant; “don’t let techs send replacements” |
| Backup if I-01 declines | I-05 (HCP, fee-sensitive) then I-02 (HCP plumbing) |
| Owner | Founding team |
| Next live action | Send outreach SMS from program.md; attach this LOI the same day they say yes |
