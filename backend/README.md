# QuoteGate HITL kernel

FastAPI + LangGraph interrupt loop for ingest → proposal → policy → human resume → execute → audit.

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload --port 8000
```

Demo (I-01 condenser + thermostat — must HITL):

```bash
curl -s localhost:8000/v1/jobs -H 'content-type: application/json' -d '{
  "customer_name": "A. Rivera",
  "address": "14 Palm Dr, Phoenix AZ",
  "trade": "hvac",
  "kind": "quote",
  "notes": "2-ton condenser failed. Customer asked to add a thermostat."
}'
```

Auto-send path (book diagnostic under threshold):

```bash
curl -s localhost:8000/v1/jobs -H 'content-type: application/json' -d '{
  "customer_name": "Sam Lee",
  "address": "9 Oak St",
  "notes": "diagnostic tune-up"
}'
```

Approve from mobile/web:

```bash
curl -s localhost:8000/v1/proposals/{proposal_id}/decision -H 'content-type: application/json' -d '{
  "action": "approve",
  "channel": "mobile"
}'
```

The demo drafter is a price-book matcher (no LLM key). Production replaces `app/draft.py` with the LLM node; policy, interrupt, execute, and audit stay the same.

```bash
PYTHONPATH=. pytest -q tests/test_slice.py
```

Covers the gated I-01 replacement quote (interrupt → mobile approve → send → hash chain) and the auto-send diagnostic.
