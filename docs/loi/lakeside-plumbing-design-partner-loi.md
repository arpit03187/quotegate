# Letter of Intent — QuoteGate design partnership

**Status:** Landed as the design-partner instrument from interview I02. Ready for countersignature.  
**Date:** 16 August 2026  
**Parties:** QuoteGate (“Company”) and Lakeside Plumbing (“Partner”)

This letter is a non-binding statement of intent except for the sections marked **Binding**: Confidentiality, Data, and Publicity.

## 1. Purpose

Partner will be QuoteGate’s first design partner for a human-in-the-loop quote and change-order agent: ingest job photos/notes → draft proposal → owner approve/edit/reject on mobile → send through Jobber → immutable audit trail.

Partner’s stated job (interview I02): stop signed-document drift between Jobber and PandaDoc, and stop unsigned extras from being installed.

## 2. Term

Ninety (90) days from the later of (a) countersignature and (b) Partner’s first live send in the TestFlight / internal-track mobile app (“Pilot Start”). Either party may exit with 14 days’ written notice. No kill fee.

## 3. What Partner provides

- One owner-approver (primary) and up to two technicians
- Jobber as system of record; sandbox first, then live jobs Partner designates
- Target volume: **~20 quote or change-order drafts per week** after week 2
- Weekly 30-minute review (phone or shop) for the first six weeks, biweekly thereafter
- Pricebook export and written send policy (dollar threshold, discount rule, change-order rule)
- Prompt flagging of wrong drafts (wrong SKU, wrong customer copy, missed void of an old document)

## 4. What Company provides

- Expo mobile app (approve / edit / reject) and Next.js operator console (queue, policy, audit)
- Python agent on Partner’s pricebook and Jobber jobs
- Onboarding, a named engineer/founder Slack (or text) channel, and same-day response on failed sends during business hours
- **$0 platform fee and $0 per-send fee** for the 90 days
- A written retro at day 90 with metrics below

## 5. Success metrics (shared scoreboard)

| Metric | Baseline (Partner’s current path) | Pilot target |
| --- | --- | --- |
| Time, site-ready → customer sees a number | Often next morning / PandaDoc lag | Median **< 20 minutes** after owner swipe |
| Unsigned extras / signed-document drift incidents | Several per month; ~$8–12k/year estimated | **Zero** on QuoteGate-sent jobs |
| Owner taps (approve / edit / reject) on phone | After-the-fact in Jobber | **100%** of QuoteGate sends |
| Quotes processed through QuoteGate | 0 | ≥ 20/week from week 3 |

Vanity metrics we will **not** optimize: model tokens, “autonomy %.” Autonomy only rises when Partner lowers a policy threshold in writing.

## 6. Commercial conversion (not binding until a paid order)

If Partner continues after day 90, the intended paid shape is:

- **$299 / month** platform
- **$2 per executed send** (approved and delivered to the customer via Jobber) *or* 0.75% of quote value, Partner’s choice at conversion
- Month-to-month after the pilot; 30-day out

No exclusivity. Partner may keep Jobber, drop PandaDoc, or run both.

## 7. Binding — Confidentiality, data, publicity

- Each party’s non-public business information stays confidential for two years.
- Partner owns job, customer, and pricebook data. Company may use **anonymized edit traces** (human corrections to drafts) to improve matching for Partner first; not resell raw customer data.
- No public case study, logo, or review without Partner’s written OK. Internal anonymized metrics are allowed.
- PHI/PII: residential job data is handled as confidential customer PII (names, addresses, photos of homes). Not a HIPAA product.

## 8. Out of scope for the pilot

ServiceTitan, payroll, dispatch, inbound voice (Avoca-class), financing applications, and commercial bid desks. Repairs and residential change orders on Jobber only.

## 9. Next steps

1. Countersign this letter
2. Jobber connected app (read jobs/pricebook, write estimates) + Expo TestFlight seats
3. Policy workshop (30 min): thresholds, discount rule, void-and-resend
4. First live send on a Partner-designated job

**QuoteGate**  
Name: ______________________  Date: ______________

**Lakeside Plumbing**  
Name: ______________________  Title: Owner  Date: ______________
