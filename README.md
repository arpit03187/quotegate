# QuoteGate

QuoteGate drafts a home-service quote or change order from job notes, then waits for the owner to approve on a phone before anything is sent to the customer.

A technician captures the job. The agent matches the price book and writes the customer message. Policy decides whether the owner must look. After approve or edit, QuoteGate sends through the shop’s field-service tool (Jobber / Housecall Pro, mock in this slice) and writes an audit chain.

```
ingest → proposal → policy → owner HITL → execute → audit
```

Nothing customer-visible leaves the company until a human says so — except on-book diagnostics under the shop’s dollar threshold.

## Repo

| Path | What |
| --- | --- |
| `backend/` | FastAPI + LangGraph (ingest, draft, policy, interrupt, send, audit) |
| `web/` | Next.js operator console (queue, create job, overflow approve, receipts) |
| `mobile/` | Expo app (owner queue, approve / reject) |

## Run locally

API first (required by web and mobile):

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload --port 8000
```

Operator console:

```bash
cd web
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

Owner phone:

```bash
cd mobile
npm install
EXPO_PUBLIC_API_URL=http://localhost:8000 npx expo start
```

On a physical device, point `EXPO_PUBLIC_API_URL` at your machine’s LAN IP, not `localhost`.

## Local LLM (Ollama)

Local mode uses Ollama when it is running. This machine already has `llama3.2`. The model picks SKUs and writes the customer SMS; **prices always come from the price book** — the model cannot invent a dollar amount. If Ollama is down, QuoteGate falls back to the keyword matcher.

```bash
# default: auto (Ollama if reachable)
export OLLAMA_HOST=http://127.0.0.1:11434
export OLLAMA_MODEL=llama3.2
export QUOTEGATE_DRAFTER=auto

# force the matcher
export QUOTEGATE_DRAFTER=rules
```

`GET /health` reports `drafter.active` (`ollama` or `rules`). The first draft after a model load can take a few seconds.

The demo drafter is a price-book matcher when Ollama is off. Policy, interrupt, execute, and audit stay the same either way.

## Demo

Replacement quote (gates to the owner):

```bash
curl -s localhost:8000/v1/jobs -H 'content-type: application/json' -d '{
  "customer_name": "A. Rivera",
  "address": "14 Palm Dr, Phoenix AZ",
  "trade": "hvac",
  "kind": "quote",
  "notes": "2-ton condenser failed. Customer asked to add a thermostat."
}'
```

Then open the landing page at [http://localhost:3000](http://localhost:3000). The live console is at [http://localhost:3000/console](http://localhost:3000/console).

On-book diagnostic (auto-sends under threshold):

```bash
curl -s localhost:8000/v1/jobs -H 'content-type: application/json' -d '{
  "customer_name": "Sam Lee",
  "address": "9 Oak St",
  "notes": "diagnostic tune-up"
}'
```

```bash
cd backend && PYTHONPATH=. pytest -q
```

## Policy (v1)

A proposal is gated when any of these fire: amount at or above the shop threshold (default $1,500), any discount off book, replacement equipment, financing language, change order, or low confidence. Only a high-confidence, on-book, under-threshold service call auto-sends.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/v1/jobs` | Ingest notes → draft → policy → queue or send |
| `GET` | `/v1/queue` | Approver queue (`?status=pending\|sent\|rejected\|failed`) |
| `GET` | `/v1/jobs/{id}` | Job + proposal + graph cursor |
| `POST` | `/v1/proposals/{id}/decision` | `approve` / `edit` / `reject` (resumes LangGraph) |
| `GET` | `/v1/jobs/{id}/audit` | Hash-chained events |
| `GET` | `/health` | Liveness |
