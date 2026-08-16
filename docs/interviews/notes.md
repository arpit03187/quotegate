# Ten operator interviews

Composite ICPs. Quotes are paraphrases of documented operator failure modes (Jobber↔PandaDoc drift, office-built quotes, missing change-order objects in FSM tools, Avoca booking without a money gate). Each note uses the script in `script.md`.

---

## I01 — Northline Comfort (HVAC, 8 trucks, Housecall Pro)

**Score: 26/30** (pain 5, HITL 5, mobile 5, FSM fit 4, DP energy 4, WTP 3)

**Path.** Tech diagnoses on site, shoots photos into the job, then either (a) builds a Housecall Pro estimate on the tablet or (b) texts the owner “10-year 3-ton, they want the good one” and waits. Owner rebuilds options at 9pm. Customer often already has a competitor’s number.

**Approver / device.** Owner. iPhone in the truck. Will not give techs send rights above $2,500. Discounts always.

**Wrong send.** Last month a tech sent a single-option $6,400 replacement without the repair-only line. Homeowner shopped it. Close died. Owner’s rule now: nothing over $2,500 leaves without him. Cost: one lost replacement (~$6k revenue) plus a night of rework.

**HITL.** Lock-screen card with good/better/best and the SMS. Swipe if pricebook matches; edit if the tech picked the wrong coil. Never auto-send replacements or anything with a discount.

**Partnership.** Yes, after a ride-along. Housecall Pro is the system of record.

**Sources.** Housecall Pro estimate/pricebook limits vs construction change orders ([Projul 2026](https://projul.com/blog/housecall-pro-pricing-analysis-2026/)); close-rate gap when quotes land same-day vs next day (ServiceTitan 2024 benchmark via [US Tech](https://ustechautomations.com/resources/blog/automate-hvac-quoting-and-estimates-automation-2026)).

---

## I02 — Lakeside Plumbing (plumbing, 5 trucks, Jobber + PandaDoc) — DESIGN PARTNER

**Score: 28/30** (pain 5, HITL 5, mobile 5, FSM fit 5, DP energy 5, WTP 3)

**Path.** Tech updates the Jobber estimate. Office (or the tech) clones it into PandaDoc for e-sign. Homeowner asks to add a thermostat / fixture. Tech edits Jobber. Homeowner signs the *original* PandaDoc. Orchestration — or a human the next morning — creates the Jobber job from the signed PDF. Extra work gets done anyway.

**Approver / device.** Owner-operator. Always the phone. There is no office staff after 3pm.

**Wrong send.** Canonical leak: $4,200 estimate Monday → +$340 thermostat Tuesday in Jobber → homeowner signs $4,200 PandaDoc Wednesday → crew installs the thermostat → shop eats $340. Pattern repeats on fixtures and water-heater add-ons. Owner estimates **$8k–$12k/year** in unsigned extras plus two ugly Google reviews when they tried to invoice after the fact.

**HITL.** “If it changes the number, I have to see it before it goes out, and the old document has to die.” Wants: pause, new number, swipe, void previous, send. Will not buy another e-sign island.

**Partnership.** Yes. Will put 20+ estimates/week through a TestFlight for 90 days. Jobber is source of truth; PandaDoc should go away if QuoteGate sends + e-signs.

**Sources.** [Jobber + PandaDoc failure mode, 2026](https://ustechautomations.com/resources/blog/automate-home-service-estimates-jobber-pandadoc-dispatch-2026) (re-verify pricing before job create; signed original vs edited estimate). ServiceTitan Pulse: change-order disputes as residential plumbing/HVAC margin leakage.

---

## I03 — Volt & Vine Electric (electrical, 10 trucks, Jobber)

**Score: 25/30**

**Path.** Techs have Jobber quote rights. Owner finds out when the customer replies. Panel upgrades and EV chargers get “neighbor pricing” from techs who want the five-star review.

**Approver / device.** Owner + one GM. Phone. Threshold: **any discount**, and anything **>$1,500**.

**Wrong send.** A tech discounted a panel 12% to close on Friday. Materials had already moved. Margin on that job went from 41% to 22%. Owner wants a policy: discounts never auto-send; they queue to him with the original vs asked price.

**HITL.** Swipe with an edit path on the discount line. Reject should notify the tech in-job, not via a separate Slack.

**Partnership.** Interested after seeing a working Jobber send. Not first partner (10 trucks, more process politics).

**Sources.** Jobber quoting flexibility vs weak post-send control ([Jobber vs HCP HVAC](https://ustechautomations.com/resources/blog/automate-housecall-pro-vs-jobber-for-hvac-companies-2026)); in-field quoting vs office bottleneck ([Raftlabs / ST benchmark](https://www.raftlabs.com/blog/quoting-estimating-software-hvac)).

---

## I04 — Harbor Heat (HVAC, 6 trucks, ServiceTitan + Avoca)

**Score: 23/30**

**Path.** Avoca answers and books into ServiceTitan. Tech presents estimates in Field Mobile (good/better/best, e-sign on tablet). Owner is not in that loop unless the job is a replacement >$8k, in which case a salesperson is dispatched and the owner still reviews options over text.

**Approver / device.** Owner for replacements; techs for repairs under pricebook. Mix of tablet (customer-facing) and phone (owner).

**Wrong send.** Avoca is “the best hire we made.” The miss is **option mix and financing flags**, not booking. A tech presented only the high-efficiency option; customer walked. Owner wanted the repair-only option always visible.

**HITL.** Wants a policy pack: replacements always include a repair option; financing language owner-approved. ServiceTitan mobile already presents — QuoteGate has to sit *before* Present, not replace it.

**Partnership.** “Call us when you do ServiceTitan.” Not v1. Confirms the wedge: Avoca ≠ money step.

**Sources.** [Avoca Convert/Nurture/Coach](https://avoca.ai/) — inbound and follow-up, not estimate drafting; [ST mobile present-and-sell](https://help.servicetitan.com/v1/docs/present-and-sell-estimates-in-servicetitan-mobile).

---

## I05 — Two-Man Drain (plumbing, 3 trucks, Jobber)

**Score: 21/30**

**Path.** Owner *is* the tech on most jobs. Types the quote in Jobber in the driveway. Second tech texts photos; owner writes the estimate at lunch.

**Approver / device.** Owner. Phone. Threshold: he wants to see the second tech’s sends, not his own.

**Wrong send.** Second tech quoted a water heater without the expansion tank required by local code. Callback ate the profit. Owner’s ask: “draft from the photos, I tap send.”

**HITL.** Perfect product shape, but volume is ~25 quotes/month. Borderline on outcome pricing. Keep as a friendly beta, not the design partner.

**Sources.** Jobber as quote-to-approval bottleneck for small shops ([Jobber vs HCP](https://ustechautomations.com/resources/blog/jobber-vs-housecall-pro-field-service-2026)).

---

## I06 — Metro Air (mixed res/commercial HVAC, 14 trucks, Jobber)

**Score: 24/30**

**Path.** Residential: techs quote from pricebook. Light commercial: office estimator builds multi-option bids for 2–5 days. Change orders on commercial are email threads.

**Approver / device.** Owner on residential >$4k (phone). Estimator + owner on commercial (desktop). Commercial is *not* our v1.

**Wrong send.** Residential change orders still leak: extra thermostat / media filter / surge protector done as “while we’re here” without a signed delta. Owner put the leakage at **~1.5 points of gross margin**.

**HITL.** Wants residential change orders on the phone this quarter; commercial later. Jobber API is already in use for other automations.

**Partnership.** Warm. Would start one residential branch (6 of 14 trucks).

**Sources.** Jobber stronger on commercial quoting flexibility; HCP simpler residential ([HCP vs Jobber HVAC](https://ustechautomations.com/resources/blog/automate-housecall-pro-vs-jobber-for-hvac-companies-2026)). Neither is a construction PM tool ([Projul](https://projul.com/blog/housecall-pro-pricing-analysis-2026/)).

---

## I07 — SpringRight Garage Doors (4 trucks, Housecall Pro)

**Score: 22/30**

**Path.** Photo of a broken spring / off-track door. Tech knows the SKU. Quote is often a texted round number, then a Housecall Pro estimate later for the card payment.

**Approver / device.** Owner. Phone. Almost every job is same-day.

**Wrong send.** Quoted a single spring; needed a pair. Argued with the homeowner in the driveway. Wants photo → draft → swipe → send before the repair starts.

**HITL.** High photo-to-price fit. Lower ACV than HVAC replacements. Good demo vertical, secondary ICP.

**Sources.** HCP quoting adequate for standard service SKUs, weak on formal change orders ([Projul 2026](https://projul.com/blog/housecall-pro-pricing-analysis-2026/)).

---

## I08 — Summit Roof & Gutter (7 crews, Jobber)

**Score: 23/30**

**Path.** Initial quote from photos + satellite. Change orders are the business: dry rot, extra squares, fascia. Currently a PDF plus a text: “need another $1,800, you ok?”

**Approver / device.** Owner. Phone. Wants a signed change order before the crew stays.

**Wrong send.** Crew stayed, verbal yes from spouse, payer disputed. No audit trail. “I would pay for the receipt even more than the draft.”

**HITL.** Change-order object + audit is the sale. Roofing is adjacent (more takeoff than pricebook). Not v1 FSM, but validates the audit requirement.

**Sources.** FSM tools lack construction-style change-order objects ([ServiceTitan / Projul 2026](https://projul.com/blog/servicetitan-pricing-analysis-2026/)); Setell on change orders as the quiet cash leak.

---

## I09 — DualTrade Comfort (HVAC + plumbing, 9 trucks, Housecall Pro)

**Score: 25/30**

**Path.** Shared pricebook drifting by trade. HVAC techs quoting plumbing add-ons (water heaters) off memory. Owner reviews at night in the app, after several estimates already went out.

**Approver / device.** Owner. Phone. Wants **pre-send** not post-facto review.

**Wrong send.** Plumbing add-on priced with HVAC labor rates. Gave away ~$400 labor on a combo job. Policy request: if trade ≠ tech’s primary, always gate.

**HITL.** Policy engine matters as much as the model: amount, confidence, **trade mismatch**, customer-visible, destructive (void-and-resend).

**Partnership.** Warm. Housecall Pro. Would pilot HVAC-only first.

**Sources.** Dual-platform / multi-trade shops adding an orchestration layer above HCP/Jobber ([HCP vs Jobber 2026](https://ustechautomations.com/resources/blog/housecall-pro-vs-jobber-2026)).

---

## I10 — Apex-style roll-up ops manager (40 trucks, ServiceTitan)

**Score: 19/30**

**Path.** Central ops, brand-level pricebooks, tech tenure rules. Estimates presented in ST mobile. Exceptions go to a sales manager queue in the office.

**Approver / device.** Sales managers on desktop; on-call owner on weekends via phone. Dual control is already a department.

**Wrong send.** Problem is compliance and coaching (which option was shown), not “owner in a truck.” Avoca + Coach already in evaluation.

**HITL.** Would buy an enterprise policy engine in 18 months. Wrong first customer: long security review, ServiceTitan Gold-partner politics, not founder-sold.

**Partnership.** No. Use as a ceiling check: do not build for the roll-up until 50 SMB shops exist.

**Sources.** Avoca at PE-backed platforms (Granite Comfort, Authority Brands) ([Avoca](https://avoca.ai/), [Contractor ToolStack 2026](https://contractortoolstack.com/software/avoca-ai/)).
