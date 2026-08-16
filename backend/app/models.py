from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class LineItem(BaseModel):
    sku: str
    description: str
    qty: float = 1
    unit_cents: int
    book_cents: int
    taxable: bool = True


class Job(BaseModel):
    id: str
    tenant_id: str = "demo"
    fsm: Literal["jobber", "housecall_pro", "mock"] = "mock"
    fsm_job_id: str | None = None
    customer_name: str
    address: str
    trade: Literal["hvac", "plumbing", "electrical"]
    kind: Literal["quote", "change_order"] = "quote"
    notes: str
    transcript: str | None = None
    photo_urls: list[str] = Field(default_factory=list)
    threshold_cents: int = 150_000
    created_at: datetime = Field(default_factory=utcnow)


class Proposal(BaseModel):
    id: str
    job_id: str
    line_items: list[LineItem]
    subtotal_cents: int
    confidence: float
    customer_message: str
    rationale: str
    policy_hits: list[str] = Field(default_factory=list)
    requires_hitl: bool = True
    created_at: datetime = Field(default_factory=utcnow)


class Decision(BaseModel):
    id: str
    proposal_id: str
    actor_id: str
    action: Literal["approve", "edit", "reject", "auto"]
    edited_items: list[LineItem] | None = None
    reason: str | None = None
    channel: Literal["mobile", "web", "policy"]
    decided_at: datetime = Field(default_factory=utcnow)


class AuditEvent(BaseModel):
    id: str
    job_id: str
    type: str
    actor: str
    payload: dict
    at: datetime = Field(default_factory=utcnow)
    prev_hash: str = "0" * 64
    hash: str = ""


class QueueItem(BaseModel):
    proposal_id: str
    job_id: str
    customer_name: str
    address: str
    kind: str
    subtotal_cents: int
    policy_hits: list[str]
    requires_hitl: bool
    status: Literal["pending", "auto", "sent", "rejected", "failed"]
    created_at: datetime
    due_at: datetime | None = None


class IngestRequest(BaseModel):
    fsm: Literal["jobber", "housecall_pro", "mock"] = "mock"
    customer_name: str
    address: str
    trade: Literal["hvac", "plumbing", "electrical"] = "hvac"
    kind: Literal["quote", "change_order"] = "quote"
    notes: str
    transcript: str | None = None
    photo_urls: list[str] = Field(default_factory=list)
    threshold_cents: int = 150_000


class DecisionRequest(BaseModel):
    action: Literal["approve", "edit", "reject"]
    edited_items: list[LineItem] | None = None
    reason: str | None = None
    channel: Literal["mobile", "web"] = "mobile"
    actor_id: str = "owner"
