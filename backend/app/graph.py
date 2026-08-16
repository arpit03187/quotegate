from __future__ import annotations

from typing import Any, TypedDict

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import interrupt

from app.draft import draft
from app.models import Decision, Job, Proposal, utcnow
from app.policy import evaluate
from app.store import store


class GraphState(TypedDict, total=False):
    job: dict
    proposal: dict
    decision: dict
    execute_result: dict


def ingest_normalize(state: GraphState) -> GraphState:
    job = Job.model_validate(state["job"])
    store.append_audit(job.id, "ingested", "system", job.model_dump(mode="json"))
    return state


def draft_proposal(state: GraphState) -> GraphState:
    job = Job.model_validate(state["job"])
    proposal = draft(job, proposal_id=state["proposal"]["id"])
    store.put_proposal(proposal)
    store.append_audit(job.id, "proposed", "agent", proposal.model_dump(mode="json"))
    return {**state, "proposal": proposal.model_dump(mode="json")}


def apply_policy(state: GraphState) -> GraphState:
    job = Job.model_validate(state["job"])
    proposal = evaluate(job, Proposal.model_validate(state["proposal"]))
    store.put_proposal(proposal)
    store.append_audit(
        job.id,
        "policy_evaluated",
        "policy",
        {"hits": proposal.policy_hits, "requires_hitl": proposal.requires_hitl},
    )
    return {**state, "proposal": proposal.model_dump(mode="json")}


def await_human(state: GraphState) -> GraphState:
    proposal = Proposal.model_validate(state["proposal"])
    job = Job.model_validate(state["job"])
    if not proposal.requires_hitl:
        decision = Decision(
            id=f"dec_{proposal.id}",
            proposal_id=proposal.id,
            actor_id="policy",
            action="auto",
            channel="policy",
        )
        store.append_audit(job.id, "auto_approved", "policy", decision.model_dump(mode="json"))
        return {**state, "decision": decision.model_dump(mode="json")}

    existing = {e.type for e in store.audit.get(job.id, [])}
    if "gated" not in existing:
        store.append_audit(job.id, "gated", "policy", {"proposal_id": proposal.id})
    if "notified_approver" not in existing:
        store.append_audit(job.id, "notified_approver", "system", {"channel": "push"})
    payload = interrupt(
        {
            "proposal_id": proposal.id,
            "job_id": job.id,
            "subtotal_cents": proposal.subtotal_cents,
            "policy_hits": proposal.policy_hits,
        }
    )
    return {**state, "decision": payload}


def execute(state: GraphState) -> GraphState:
    job = Job.model_validate(state["job"])
    proposal = Proposal.model_validate(state["proposal"])
    decision = Decision.model_validate(state["decision"])
    if decision.action == "reject":
        result = {"status": "rejected", "reason": decision.reason}
        store.append_audit(job.id, "resumed", decision.actor_id, decision.model_dump(mode="json"))
        store.append_audit(job.id, "executed", "fsm.mock", result)
        return {**state, "execute_result": result}

    items = decision.edited_items or proposal.line_items
    total = sum(i.unit_cents * i.qty for i in items)
    result = {
        "status": "sent",
        "fsm": job.fsm,
        "external_id": f"{job.fsm}_{job.id}",
        "sent_cents": int(total),
        "channel": "customer_message",
        "at": utcnow().isoformat(),
    }
    store.append_audit(job.id, "resumed", decision.actor_id, decision.model_dump(mode="json"))
    store.append_audit(job.id, "executed", f"fsm.{job.fsm}", result)
    return {**state, "execute_result": result}


def build_graph():
    graph = StateGraph(GraphState)
    graph.add_node("ingest_normalize", ingest_normalize)
    graph.add_node("draft_proposal", draft_proposal)
    graph.add_node("apply_policy", apply_policy)
    graph.add_node("await_human", await_human)
    graph.add_node("execute", execute)
    graph.add_edge(START, "ingest_normalize")
    graph.add_edge("ingest_normalize", "draft_proposal")
    graph.add_edge("draft_proposal", "apply_policy")
    graph.add_edge("apply_policy", "await_human")
    graph.add_edge("await_human", "execute")
    graph.add_edge("execute", END)
    return graph.compile(checkpointer=MemorySaver())


compiled = build_graph()
