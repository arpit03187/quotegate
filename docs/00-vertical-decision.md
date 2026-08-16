# Vertical decision: QuoteGate

**Chosen:** QuoteGate — home-services estimate and change-order agent with mobile HITL.

**Date:** 2026-08-16  
**Decision owner:** founding team  
**Status:** locked for v1. Other top-5 verticals are parked, not killed.

## Decision

We will build **QuoteGate** first: voice/photo/job notes in, agent drafts scope + price + customer message, owner **approves the quote or change order before it leaves the truck**.

This is the only top-5 idea where the buyer, the daily user, and the approver are the same person (the owner or GM), the money step is still unowned, and a credible thin slice can ship this quarter.

## Scorecard (why this one)

Criteria from the plan: production-readiness gap, HITL as must-have, mobile-native buyer, not owned by a $100M+ ARR incumbent, SMB/mid-market sales we can run ourselves, outcome metric a CFO already tracks.

| Criterion | QuoteGate | RefundQueue | Denial Pilot | Adjuster Workstation | FreightFix |
|---|---|---|---|---|---|
| HITL is legally/financially required | High (customer-visible price) | High (money out) | Highest (PHI + payer) | High (coverage call) | High (credits) |
| Mobile-native approver | **Highest** (truck) | Medium (ops desk) | Low (biller at desktop) | Medium | High |
| Time to first design partner | **Fastest** | Fast (Shopify app) | Slow (PHI/BAA) | Medium | Slow (EDI) |
| Incumbent owns the *money* step | **No** (Avoca owns inbound voice) | Partial (Gorgias/Sierra chat) | Partial (Abridge is clinical) | Yes at enterprise CMS | TMS incumbents, not exceptions |
| Outcome a buyer already tracks | Quotes sent, close rate, margin | Refunds, chargeback win rate | $ collected / A/R days | Cycle time, leakage | Exception $ recovered |
| Founding-engineer demo beauty | **Highest** | High | Ugly PDFs | Ugly packets | EDI-ugly |
| Sales cycle we can run | Owner, 1–2 calls | Self-serve | Clinic + compliance | IA networks | 3PL procurement |

QuoteGate wins on **speed + proof**. RefundQueue is the runner-up if we later want a cleaner self-serve wedge. Denial Pilot / Adjuster are the “deeper moat, slower start” pair. FreightFix is the phone-first ops play if we land 2–3 3PL partners.

## Why not the others *as v1*

- **RefundQueue** — cleanest APIs and Shopify/Stripe distribution, but the approver is a finance/ops person at a laptop, and we would be selling a money-ops widget rather than a job-site product. Keep as a second product only if QuoteGate distribution stalls.
- **Clinic Denial Pilot** — largest dollar pool, HITL non-negotiable, but PHI, clearinghouses, and payer-rule memory push first revenue past a quarter. Revisit after we have an HITL kernel in production.
- **Independent Adjuster Workstation** — insurance is deploying agents; independents are ignored. Packet assembly is a LangGraph gift. Sales motion is network-by-network, not owner-by-owner. Park until we want a claims company.
- **FreightFix** — underserved and high-dollar, but EDI + rate tables are a worse first integration than Jobber/Housecall Pro. Revisit if a 3PL design partner shows up unsolicited.

**Explicitly cut (from the original 10):** OfferGuard, AccessTap, Redline Partner, Credit Exception Desk. **SubPay** is the expansion: same construction/trade buyer, later, once QuoteGate owns the jobsite approve gesture.

## ICP for v1

- Residential HVAC, plumbing, or electrical
- 3–20 trucks, roughly $1M–$8M revenue
- Already on **Jobber** or **Housecall Pro** (ServiceTitan in v1.1)
- Owner or GM still personally gates quotes / change orders
- 30+ estimates per month
- Pain: techs draft in the field, owner is in another truck, customer waits, wrong price goes out, change orders never re-signed

## What we will not build in v1

- A generic “approval layer for any agent”
- Inbound call answering (Avoca’s job)
- Full FSM replacement (Jobber/HCP/ST stay the system of record)
- Construction takeoffs / Gantt / subs (that is Projul/Buildertrend; different buyer)

## Shared stack (locked with the vertical)

- Backend: Python, FastAPI, LangGraph interrupts, Postgres, Redis, S3
- Web: Next.js operator console
- Mobile: Expo swipe-to-approve
- HITL kernel extracted as an internal library once the vertical loop works

## First 30 days (from this decision)

1. Ten customer interviews in this vertical (done as Week-0 research interviews; live named-customer calls continue in parallel).
2. One design-partner LOI (drafted against the strongest ICP; ready to countersign).
3. Thin slice spec: ingest → proposal → mobile HITL → execute → audit.

No other vertical work until QuoteGate has a paying design partner or we explicitly reopen this decision.
