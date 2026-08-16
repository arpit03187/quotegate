# QuoteGate

Home-services **quote and change-order agent** with human-in-the-loop. The tech captures the job; the agent drafts price and the customer message; the owner **approves on a phone** before anything customer-visible is sent.

Vertical lock, Week-0 interviews, design-partner LOI, and v1 spec live in `docs/`. The runnable thin slice is Python (FastAPI + LangGraph) + Next.js + Expo.

## Why this, not the other four

Avoca already owns inbound voice. Jobber / Housecall Pro / ServiceTitan already own dispatch and estimate *presentation*. Nobody owns the money step: **owner looks at the number in the truck and lets it leave the company.** That is QuoteGate. See [docs/00-vertical-decision.md](docs/00-vertical-decision.md).

## Docs

| Artifact | Path |
|---|---|
| Vertical decision | [docs/00-vertical-decision.md](docs/00-vertical-decision.md) |
| Interview program + script | [docs/interviews/program.md](docs/interviews/program.md) |
| 10 interviews | [docs/interviews/notes.md](docs/interviews/notes.md) |
| Tracker | [docs/interviews/tracker.md](docs/interviews/tracker.md) |
| Synthesis → v1 requirements | [docs/interviews/synthesis.md](docs/interviews/synthesis.md) |
| Design-partner LOI (issued I-01) | [docs/interviews/loi-design-partner.md](docs/interviews/loi-design-partner.md) |
| v1 spec | [docs/v1-spec.md](docs/v1-spec.md) |

## Thin slice

```
ingest  →  proposal  →  policy  →  mobile HITL  →  execute  →  audit
                FastAPI + LangGraph interrupt          Jobber/HCP/mock
```

```bash
# API
cd backend && python3 -m venv .venv && source .venv/bin/activate
pip install -e . && uvicorn app.main:app --reload --port 8000

# Operator console
cd web && npm install && npm run dev

# Approver
cd mobile && npm install && npx expo start
```

I-01 demo payload (replacement quote, must gate):

```bash
curl -s localhost:8000/v1/jobs -H 'content-type: application/json' -d '{
  "customer_name": "A. Rivera",
  "address": "14 Palm Dr, Phoenix AZ",
  "trade": "hvac",
  "kind": "quote",
  "notes": "2-ton condenser failed. Customer asked to add a thermostat."
}'
```
