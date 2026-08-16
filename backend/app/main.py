from __future__ import annotations

import uuid
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langgraph.types import Command

from app.draft import drafter_status
from app.graph import compiled
from app.models import Decision, DecisionRequest, IngestRequest, Job, Proposal, utcnow
from app.store import store

app = FastAPI(title="QuoteGate", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _config(job_id: str) -> dict[str, Any]:
    return {"configurable": {"thread_id": job_id}}


@app.post("/v1/jobs", status_code=201)
def ingest(body: IngestRequest):
    job = Job(id=str(uuid.uuid4()), **body.model_dump())
    proposal_id = str(uuid.uuid4())
    store.put_job(job)
    result = compiled.invoke(
        {"job": job.model_dump(mode="json"), "proposal": {"id": proposal_id}},
        _config(job.id),
    )
    proposal = Proposal.model_validate(store.proposals[proposal_id])
    status = "pending" if proposal.requires_hitl else "sent"
    if result.get("execute_result", {}).get("status") == "failed":
        status = "failed"
    item = store.enqueue(proposal, job, status)
    return {
        "job_id": job.id,
        "proposal_id": proposal.id,
        "requires_hitl": proposal.requires_hitl,
        "policy_hits": proposal.policy_hits,
        "subtotal_cents": proposal.subtotal_cents,
        "customer_message": proposal.customer_message,
        "drafter": proposal.drafter,
        "queue_item": item.model_dump(mode="json"),
        "interrupted": bool(result.get("__interrupt__")),
    }


@app.get("/v1/queue")
def queue(status: str | None = None):
    items = [i.model_dump(mode="json") for i in store.queue.values()]
    if status:
        items = [i for i in items if i["status"] == status]
    items.sort(key=lambda i: i["created_at"], reverse=True)
    counts: dict[str, int] = {}
    for item in store.queue.values():
        counts[item.status] = counts.get(item.status, 0) + 1
    return {"items": items, "counts": counts}


@app.get("/v1/proposals/{proposal_id}")
def get_proposal(proposal_id: str):
    proposal = store.proposals.get(proposal_id)
    if not proposal:
        raise HTTPException(404, "proposal not found")
    job = store.jobs.get(proposal.job_id)
    item = store.queue.get(proposal_id)
    return {
        "job": job.model_dump(mode="json") if job else None,
        "proposal": proposal.model_dump(mode="json"),
        "queue": item.model_dump(mode="json") if item else None,
    }


@app.get("/v1/jobs/{job_id}")
def get_job(job_id: str):
    job = store.jobs.get(job_id)
    if not job:
        raise HTTPException(404, "job not found")
    proposal = next((p for p in store.proposals.values() if p.job_id == job_id), None)
    item = store.queue.get(proposal.id) if proposal else None
    snap = compiled.get_state(_config(job_id))
    return {
        "job": job.model_dump(mode="json"),
        "proposal": proposal.model_dump(mode="json") if proposal else None,
        "queue": item.model_dump(mode="json") if item else None,
        "graph_next": list(snap.next) if snap else [],
    }


@app.post("/v1/proposals/{proposal_id}/decision")
def decide(proposal_id: str, body: DecisionRequest):
    proposal = store.proposals.get(proposal_id)
    if not proposal:
        raise HTTPException(404, "proposal not found")
    item = store.queue.get(proposal_id)
    if not item or item.status != "pending":
        raise HTTPException(409, "proposal is not waiting on a human")
    if body.action == "edit" and not body.edited_items:
        raise HTTPException(400, "edit requires edited_items")
    if body.action == "reject" and not body.reason:
        raise HTTPException(400, "reject requires reason")

    if body.action == "edit" and body.edited_items:
        proposal = proposal.model_copy(
            update={
                "line_items": body.edited_items,
                "subtotal_cents": int(sum(i.unit_cents * i.qty for i in body.edited_items)),
            }
        )
        store.put_proposal(proposal)

    decision = Decision(
        id=str(uuid.uuid4()),
        proposal_id=proposal_id,
        actor_id=body.actor_id,
        action=body.action,
        edited_items=body.edited_items,
        reason=body.reason,
        channel=body.channel,
        decided_at=utcnow(),
    )
    result = compiled.invoke(
        Command(resume=decision.model_dump(mode="json")),
        _config(proposal.job_id),
    )
    status = {"approve": "sent", "edit": "sent", "reject": "rejected"}[body.action]
    if result.get("execute_result", {}).get("status") == "failed":
        status = "failed"
    store.set_status(proposal_id, status)
    return {
        "decision": decision.model_dump(mode="json"),
        "execute_result": result.get("execute_result"),
        "status": status,
    }


@app.get("/v1/jobs/{job_id}/audit")
def audit(job_id: str):
    if job_id not in store.jobs:
        raise HTTPException(404, "job not found")
    return {"events": [e.model_dump(mode="json") for e in store.audit.get(job_id, [])]}


@app.get("/health")
def health():
    return {"ok": True, "jobs": len(store.jobs), "drafter": drafter_status()}


def run() -> None:
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
