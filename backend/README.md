# QuoteGate API

FastAPI + LangGraph: ingest → proposal → policy → human resume → execute → audit.

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload --port 8000
PYTHONPATH=. pytest -q
```

The demo drafter in `app/draft.py` is a price-book matcher. Policy, interrupt, execute, and audit stay the same when you swap in a model.
