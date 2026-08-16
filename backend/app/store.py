from __future__ import annotations

import hashlib
import json
import uuid
from datetime import timedelta

from app.models import AuditEvent, Job, Proposal, QueueItem, utcnow


def _canonical(payload: dict) -> str:
    return json.dumps(payload, sort_keys=True, default=str, separators=(",", ":"))


class Store:
    def __init__(self) -> None:
        self.jobs: dict[str, Job] = {}
        self.proposals: dict[str, Proposal] = {}
        self.queue: dict[str, QueueItem] = {}
        self.audit: dict[str, list[AuditEvent]] = {}
        self.graph_state: dict[str, dict] = {}

    def put_job(self, job: Job) -> None:
        self.jobs[job.id] = job

    def put_proposal(self, proposal: Proposal) -> None:
        self.proposals[proposal.id] = proposal

    def enqueue(self, proposal: Proposal, job: Job, status: str) -> QueueItem:
        due = utcnow() + timedelta(minutes=2) if status == "pending" else None
        item = QueueItem(
            proposal_id=proposal.id,
            job_id=job.id,
            customer_name=job.customer_name,
            address=job.address,
            kind=job.kind,
            subtotal_cents=proposal.subtotal_cents,
            policy_hits=proposal.policy_hits,
            requires_hitl=proposal.requires_hitl,
            status=status,  # type: ignore[arg-type]
            created_at=proposal.created_at,
            due_at=due,
        )
        self.queue[proposal.id] = item
        return item

    def set_status(self, proposal_id: str, status: str) -> None:
        item = self.queue[proposal_id]
        self.queue[proposal_id] = item.model_copy(update={"status": status})

    def append_audit(self, job_id: str, type: str, actor: str, payload: dict) -> AuditEvent:
        chain = self.audit.setdefault(job_id, [])
        prev = chain[-1].hash if chain else "0" * 64
        body = {"type": type, "actor": actor, "payload": payload, "prev": prev}
        digest = hashlib.sha256((prev + _canonical(body)).encode()).hexdigest()
        event = AuditEvent(
            id=str(uuid.uuid4()),
            job_id=job_id,
            type=type,
            actor=actor,
            payload=payload,
            prev_hash=prev,
            hash=digest,
        )
        chain.append(event)
        return event


store = Store()
