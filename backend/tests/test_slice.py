from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_replacement_quote_gates_then_resumes():
    ingest = client.post(
        "/v1/jobs",
        json={
            "customer_name": "A. Rivera",
            "address": "14 Palm Dr",
            "trade": "hvac",
            "notes": "2-ton condenser failed. Customer asked to add a thermostat.",
        },
    )
    assert ingest.status_code == 201
    body = ingest.json()
    assert body["requires_hitl"] is True
    assert "P_REPLACEMENT" in body["policy_hits"]
    assert body["subtotal_cents"] == 454_000

    decision = client.post(
        f"/v1/proposals/{body['proposal_id']}/decision",
        json={"action": "approve", "channel": "mobile"},
    )
    assert decision.status_code == 200
    assert decision.json()["status"] == "sent"
    assert decision.json()["execute_result"]["sent_cents"] == 454_000

    audit = client.get(f"/v1/jobs/{body['job_id']}/audit").json()["events"]
    types = [e["type"] for e in audit]
    assert types == [
        "ingested",
        "proposed",
        "policy_evaluated",
        "gated",
        "notified_approver",
        "resumed",
        "executed",
    ]
    assert all(e["hash"] for e in audit)
    assert audit[0]["prev_hash"] == "0" * 64
    for prev, nxt in zip(audit, audit[1:]):
        assert nxt["prev_hash"] == prev["hash"]


def test_book_diagnostic_autosends():
    ingest = client.post(
        "/v1/jobs",
        json={"customer_name": "Sam Lee", "address": "9 Oak St", "notes": "diagnostic tune-up"},
    )
    body = ingest.json()
    assert body["requires_hitl"] is False
    assert body["queue_item"]["status"] == "sent"
    types = [e["type"] for e in client.get(f"/v1/jobs/{body['job_id']}/audit").json()["events"]]
    assert "auto_approved" in types
    assert "executed" in types
    assert "gated" not in types
