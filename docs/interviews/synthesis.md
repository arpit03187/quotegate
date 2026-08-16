# Interview synthesis

Ten interviews. One design-partner LOI (I02 Lakeside Plumbing). Four warm follow-ups (I01, I03, I06, I09).

## Answers to the four plan questions

| Question | Pattern |
| --- | --- |
| Current exception path | Tech captures photos/notes in the FSM. Quote is typed later — by the tech, the owner at 9pm, or an office clone into PandaDoc. Change orders are texts and verbal “while we’re here.” |
| Who approves | The owner (sometimes a GM). Techs have send rights only under a dollar cap, and even then owners regret it (I03 discounts, I09 trade mismatch). |
| Device | Phone. Desktop only shows up at 14+ trucks or PE roll-ups (I06 commercial, I10). V1 is mobile. Web is the audit/policy console. |
| Cost of a wrong send | Unsigned extras ($340–$1,800 a pop; I02 $8–12k/year), lost replacements when options are missing (I01, I04), margin given away on discounts (I03), callbacks from incomplete scope (I05), disputes with no receipt (I08). |

## What must never auto-send

Consensus gate list (feeds the v1 policy engine):

1. Amount ≥ owner threshold (cluster: **$1,500–$2,500**; replacements always)
2. Any **discount**
3. Any **change order** / void-and-resend
4. **Trade mismatch** (HVAC tech quoting plumbing)
5. Model **confidence** below shop threshold
6. Customer-visible copy the shop has not templated (financing, warranty)

Repairs on-pricebook, under threshold, high confidence: auto-send is acceptable later. Not in v1. V1 gates **every** customer send so the owner trusts the queue.

## Product implications

- **Jobber first.** I02 (LOI), I03, I05, I06, I08. Housecall Pro is a close second (I01, I07, I09). ServiceTitan is v1.5 (I04, I10).
- **Change-order object is the wedge**, not “AI estimates.” I02 and I08 will pay for void-old / send-new / audit even if drafting is mediocre.
- **Good/better/best** is expected on replacements (I01, I04). Single-line repairs can stay single-option.
- **Notify the tech in-job** on reject (I03). Do not invent a second chat tool.
- **Pricebook + photos** beat voice for v1 accuracy. Voice is a note, not the source of truth.
- **Do not sell to roll-ups first** (I10). Policy theater, long security, Avoca already in the stack.

## Willingness to pay

No one quoted a hard number. Ranges that did not get a no:

- $200–$400/month platform felt “like another seat”
- Per-send of $1–$3 or sub-1% of quote value on **executed** sends only
- I02 will do 90 days at $0 in exchange for killing PandaDoc drift

## Design-partner ranking

1. **Lakeside Plumbing (I02)** — LOI. Pain is named, Jobber, owner is the user, volume is enough, PandaDoc is the enemy.
2. Northline Comfort (I01) — backup if Lakeside slips. HCP.
3. DualTrade (I09) / Volt & Vine (I03) — policy-engine design partners in month two.
