from __future__ import annotations

import re

from app.models import Job, LineItem, Proposal

REPLACEMENT = re.compile(
    r"\b(furnace|condenser|air handler|heat pump|panel|water heater|"
    r"replacement|replace the|full system)\b",
    re.I,
)
FINANCING = re.compile(r"\b(financ|apr|warranty upgrade|wisetack|0%\s*apr)\b", re.I)

DISCOUNT_RATIO = 0.08
CONFIDENCE_GATE = 0.72
AUTO_CONFIDENCE = 0.90


def _discounted(items: list[LineItem]) -> bool:
    return any(
        item.book_cents > 0 and item.unit_cents < item.book_cents * (1 - DISCOUNT_RATIO)
        for item in items
    )


def evaluate(job: Job, proposal: Proposal) -> Proposal:
    """Deterministic policy. LLM never sees this output as a tool it can skip."""
    hits: list[str] = []
    gate = False

    text = " ".join(
        [
            job.notes,
            job.transcript or "",
            proposal.customer_message,
            " ".join(i.description for i in proposal.line_items),
        ]
    )

    if proposal.subtotal_cents >= job.threshold_cents:
        hits.append("P_AMOUNT")
        gate = True
    if _discounted(proposal.line_items):
        hits.append("P_DISCOUNT")
        gate = True
    if REPLACEMENT.search(text):
        hits.append("P_REPLACEMENT")
        gate = True
    if FINANCING.search(text):
        hits.append("P_FINANCING")
        gate = True
    if job.kind == "change_order":
        hits.append("P_CHANGE_ORDER")
        gate = True
    if proposal.confidence < CONFIDENCE_GATE:
        hits.append("P_LOW_CONFIDENCE")
        gate = True

    book_service = (
        not gate
        and proposal.confidence >= AUTO_CONFIDENCE
        and job.kind != "change_order"
        and all(i.unit_cents == i.book_cents for i in proposal.line_items)
        and proposal.subtotal_cents < job.threshold_cents
    )
    if book_service:
        hits.append("P_BOOK_SERVICE")
        proposal.requires_hitl = False
    else:
        hits.append("P_CUSTOMER_VISIBLE")
        proposal.requires_hitl = True
        gate = True

    proposal.policy_hits = hits
    proposal.requires_hitl = gate or not book_service
    if book_service:
        proposal.requires_hitl = False
    return proposal
