from app.draft import draft, draft_rules
from app.models import Job


def test_rules_matcher_condenser_and_thermostat():
    job = Job(
        id="j1",
        customer_name="A. Rivera",
        address="14 Palm Dr",
        trade="hvac",
        notes="2-ton condenser failed. Customer asked to add a thermostat.",
    )
    proposal = draft_rules(job, "p1")
    assert [i.sku for i in proposal.line_items] == ["HVAC-COND-2T", "HVAC-TSTAT"]
    assert proposal.subtotal_cents == 454_000
    assert proposal.drafter == "rules"


def test_ollama_prices_come_from_book(monkeypatch):
    monkeypatch.setenv("QUOTEGATE_DRAFTER", "ollama")
    monkeypatch.setattr("app.draft.ollama_available", lambda: True)

    def fake_complete(_job):
        return {
            "skus": ["HVAC-COND-2T", "MADE-UP"],
            "customer_message": "Hi Ana, condenser swap is $1. Reply yes.",
            "rationale": "notes mention condenser",
            "confidence": 0.77,
        }

    monkeypatch.setattr("app.draft.ollama_complete", fake_complete)
    job = Job(
        id="j2",
        customer_name="Ana Diaz",
        address="1 Main",
        trade="hvac",
        notes="condenser is dead",
    )
    proposal = draft(job, "p2")
    assert [i.sku for i in proposal.line_items] == ["HVAC-COND-2T"]
    assert proposal.line_items[0].unit_cents == 420_000
    assert proposal.drafter.startswith("ollama:")
    assert "Ana" in proposal.customer_message
