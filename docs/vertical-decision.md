# Vertical decision: QuoteGate

**Chosen:** QuoteGate — home-services estimate and change-order agent.  
**Date:** 2026-08-16  
**Decision owner:** founding team  
**Not chosen (this quarter):** RefundQueue, Clinic Denial Pilot, Independent Adjuster Workstation, FreightFix

## The job

A tech is on a driveway with photos, a voice note, and a messy scope. The owner is in another truck. QuoteGate drafts good / better / best from the pricebook, pauses on the money step, and lets the owner swipe approve / edit / reject on a phone. Only then does the estimate or change order go to the homeowner through Jobber or Housecall Pro.

Human-in-the-loop is the product: a wrong send is a wrong price, a wrong promise, or a change order that never got signed.

## Why this one

Scored against the plan’s filters: production-readiness gap, HITL as must-have, mobile-native buyer, not owned by a $100M+ ARR incumbent, SMB sales we can run ourselves, outcome metric a CFO already tracks.

| Filter | QuoteGate | Why it wins |
| --- | --- | --- |
| Production gap | High | Avoca (~unicorn, 2026) owns inbound voice and booking. Jobber / Housecall Pro / ServiceTitan own dispatch and pricebooks. Nobody owns **swipe-to-send-price**. |
| HITL is required | Yes | Quotes, discounts, and change orders are customer-visible and cash. Owners will not let a model auto-send. |
| Mobile-native buyer | Yes | The buyer *is* the approver *is* the user, and they live in a truck. |
| Incumbent hole | Open | FSM tools have estimates; they do not have a policy-gated agent that drafts and waits. Construction tools (Projul, Buildertrend) have change orders but are the wrong product for dispatch trades. |
| Sales motion | Founder-led | Owner-operators. One lunch, one TestFlight, one LOI. |
| Outcome metric | Quotes sent, close rate, change-order leakage | Already on the weekly scorecard. ServiceTitan 2024 benchmark: ~48% close when the quote lands in 4 hours vs ~29% after 24 hours. |

## Why not the other four (this quarter)

**RefundQueue** — cleanest self-serve GTM (Shopify / Stripe), textbook HITL. Cut because money-ops agents are a crowded adjacent category, the buyer is not mobile-native in the same way, and the demo is less distinctive than a truck-side swipe. Keep as a *second* product if we later extract the HITL kernel.

**Clinic Denial Pilot** — largest dollar pool, HITL legally required. Cut because PHI, clearinghouses, and payer-rule memory are a 12-month company, not a 30-day thin slice.

**Independent Adjuster Workstation** — ugly workflow, real willingness to pay. Cut because insurance distribution is slower than owner-operator trades and multimodal provenance is a heavier v1.

**FreightFix** — phone-first, high-dollar exceptions. Cut because EDI / TMS integrations are a worse first integration than Jobber’s public API.

**Later expansion on the same buyer:** SubPay (trade AP / pay apps). Same owner, same phone, after QuoteGate is in the truck.

## ICP lock

- Trades: residential HVAC first, plumbing and electrical immediately adjacent
- Size: 3–15 trucks, roughly $1M–$8M revenue
- Systems: Jobber or Housecall Pro (ServiceTitan is v1.5 — richer API, longer sales)
- Buyer: owner or GM who still approves anything above a dollar threshold
- Killer workflow: change orders and optioned replacement quotes, not $189 drain snaking

## Wedge vs Avoca and the FSMs

Avoca answers the phone and books the board. The FSM stores the pricebook and the job. QuoteGate sits on the **money step in between**: draft → gate → send → audit. We integrate; we do not replace either.

## Price sketch (from the interviews)

Hybrid, as the plan required:

- Platform: **$299 / month** per shop during paid conversion (waived in the 90-day design partnership)
- Outcome: **$2 per approved send** *or* **0.75% of quote value**, billed on executed sends only (approved and delivered to the customer)
- Floor: shops sending <40 quotes/month stay on the platform fee only

## What this decision locks

- Company name and repo: QuoteGate
- First 30 days: interviews (done as research + live-call tracker), one LOI (Lakeside Plumbing), thin-slice spec (this repo)
- Stack: Python / FastAPI / LangGraph, Next.js, Expo
- First FSM: Jobber

No other vertical work until a design partner is live or this ICP is disproved in the field.
