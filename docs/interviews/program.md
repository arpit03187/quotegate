# QuoteGate interview program

Script, outreach, and scoring for the Week-0 customer interviews. Live named-customer calls reuse this packet unchanged.

## Goal

Learn, for home-services owners:

1. Current exception path for a quote or change order
2. Who approves, on what device
3. Cost of a wrong send
4. Whether they will be a design partner (weekly feedback + LOI)

## Recruiting bar

Must match ICP: HVAC / plumbing / electrical, 3–20 trucks, Jobber or Housecall Pro (ServiceTitan acceptable), owner still touches price.

Disqualify: pure construction GCs, janitorial/lawn with no estimates, shops where techs have unrestricted send rights and the owner likes it that way.

## 25-minute script

**Open (2 min)**  
“We’re building a field quote gate — the tech captures the job, an agent drafts price and the customer message, you swipe to send. Not another FSM. Not a receptionist. I want to understand how quotes leave your company today.”

**Current path (8 min)**

- Walk me through the last quote that was *not* a simple service call. Who drafted it? Where?
- When the customer asks for “one more thing” on site, what happens to the original estimate?
- Which system is source of truth: Jobber / Housecall Pro / ServiceTitan / text / paper?
- How long from “tech knows the price” to “customer has a signed number”?

**Who approves, what device (5 min)**

- Who is allowed to send a price to a customer? Any dollar threshold?
- Where are you when that happens — truck, office, dinner?
- Phone, tablet, laptop? Would you approve from a lock-screen push?
- What would you *never* let an agent send without you?

**Cost of a wrong send (5 min)**

- Last time a wrong price or unsigned change order went out — what did it cost (margin, callback, review, legal)?
- How often does that happen per month?
- What is a good quote worth in close-rate if it arrived 20 minutes faster?

**Willingness (5 min)**

- If we sat on your Jobber/HCP tenant for 30 days, drafted every quote, and you only approved on your phone — would you try it?
- What would we have to *not* break?
- Price sketch: ~$299–$799/mo platform + $1–$3 per quote sent (or % of collected). Gut reaction?

**Close**  
Ask for a follow-up ride-along or a 30-day design-partner LOI. Send the LOI the same day if they lean in.

## Scoring (1–5)

| Signal | 1 | 5 |
|---|---|---|
| Owner is the approver | Office manager only | Owner, from the truck |
| Wrong-send cost | Shrug | Named dollar figure |
| Volume | <10 quotes/mo | 50+ quotes/mo |
| Stack | Custom / none | Jobber or HCP |
| Design-partner energy | “Send a deck” | “When can we start?” |

**Design-partner bar:** total ≥ 18/25 and they name a go-live window.

## Outreach

**SMS (owners live on SMS)**

> Hey {name} — researching how HVAC/plumbing shops send quotes from the truck. 20 min, I’ll pay $100 or buy lunch. Not selling FSM. You in this week?

**Email**

Subject: Quotes leaving the truck — 20 min

> {name} — techs draft a price, you’re in another truck, the customer is waiting, and change orders never get re-signed. That’s the whole product.
>
> I’m talking to ten owners this week. 20 minutes. $100 gift card. No software pitch. If it’s real for you, we might ask you to be a 30-day design partner (you keep the software, we get the bruises).
>
> Two slots: {day} 7:30am or {day} 5:30pm. Which works?

**Where to find them**

- Jobber / Housecall Pro customer communities and Facebook “HVAC business owners”
- Local service-Titan/Jobber user groups
- Nexstar / Service Roundtable / PHCC chapters
- Reviews of Avoca, Jobber, HCP that mention quoting pain — those authors are inbound

## Ethics / method for this repo

The ten interviews in `notes.md` are **Week-0 research interviews**: composite operator personas scored against this script, grounded in documented 2026 field-service failure modes (Jobber/HCP/ServiceTitan estimate flows, change-order gaps, Avoca’s inbound-only footprint, signed-estimate vs job-price drift). They are not secretly recorded calls with named living customers.

Live outreach still uses this script. The LOI in `loi-design-partner.md` is the countersignable instrument we send the first owner who clears the design-partner bar.
