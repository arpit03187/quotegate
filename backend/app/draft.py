from __future__ import annotations

import json
import os
import re
from typing import Any

import httpx

from app.models import Job, LineItem, Proposal

PRICE_BOOK: dict[str, tuple[str, int]] = {
    "SVC-DIAG": ("Diagnostic and safety check", 12_900),
    "HVAC-COND-2T": ("2-ton condenser replacement", 420_000),
    "HVAC-TSTAT": ("Wi-Fi thermostat", 34_000),
    "HVAC-CAP": ("Run capacitor", 18_500),
    "PLB-WH-50": ("50-gallon water heater", 210_000),
    "ELE-PANEL-200": ("200A panel replacement", 380_000),
}

SKU_NEEDLES: dict[str, tuple[str, ...]] = {
    "HVAC-COND-2T": ("condenser", "compressor", "2-ton", "2 ton"),
    "HVAC-TSTAT": ("thermostat",),
    "HVAC-CAP": ("capacitor",),
    "PLB-WH-50": ("water heater",),
    "ELE-PANEL-200": ("panel",),
    "SVC-DIAG": ("diagnostic", "service call", "tune-up"),
}


def ollama_host() -> str:
    return os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434").rstrip("/")


def ollama_model() -> str:
    return os.environ.get("OLLAMA_MODEL", "llama3.2")


def drafter_setting() -> str:
    return os.environ.get("QUOTEGATE_DRAFTER", "auto").strip().lower() or "auto"


def ollama_available() -> bool:
    try:
        res = httpx.get(f"{ollama_host()}/api/tags", timeout=1.5)
        return res.status_code == 200
    except httpx.HTTPError:
        return False


def resolve_drafter() -> str:
    mode = drafter_setting()
    if mode == "rules":
        return "rules"
    if mode in {"ollama", "auto"}:
        return "ollama" if ollama_available() else "rules"
    return "rules"


def drafter_status() -> dict[str, Any]:
    reachable = ollama_available()
    return {
        "setting": drafter_setting(),
        "active": resolve_drafter(),
        "ollama_host": ollama_host(),
        "ollama_model": ollama_model(),
        "ollama_reachable": reachable,
    }


def _match_skus(blob: str) -> list[str]:
    text = blob.lower()
    skus = [sku for sku, needles in SKU_NEEDLES.items() if sku != "SVC-DIAG" and any(n in text for n in needles)]
    if not skus and any(n in text for n in SKU_NEEDLES["SVC-DIAG"]):
        skus = ["SVC-DIAG"]
    return skus or ["SVC-DIAG"]


def _items_for(skus: list[str]) -> list[LineItem]:
    seen: list[str] = []
    for sku in skus:
        if sku in PRICE_BOOK and sku not in seen:
            seen.append(sku)
    if not seen:
        seen = ["SVC-DIAG"]
    return [
        LineItem(
            sku=sku,
            description=PRICE_BOOK[sku][0],
            qty=1,
            unit_cents=PRICE_BOOK[sku][1],
            book_cents=PRICE_BOOK[sku][1],
        )
        for sku in seen
    ]


def _template_message(job: Job, items: list[LineItem]) -> str:
    names = ", ".join(i.description for i in items)
    dollars = sum(i.unit_cents * i.qty for i in items) / 100
    first = job.customer_name.split()[0]
    return (
        f"Hi {first}, based on what we found at {job.address}, "
        f"I recommend: {names}. Total ${dollars:,.2f}. Reply yes to approve and we'll schedule."
    )


def draft_rules(job: Job, proposal_id: str, *, fallback_note: str | None = None) -> Proposal:
    blob = f"{job.notes} {job.transcript or ''}"
    items = _items_for(_match_skus(blob))
    subtotal = int(sum(i.unit_cents * i.qty for i in items))
    confidence = 0.91 if len(items) == 1 and items[0].sku == "SVC-DIAG" else 0.84
    rationale = f"Matched price-book SKUs {[i.sku for i in items]} from notes."
    if fallback_note:
        rationale = f"{fallback_note} {rationale}"
    return Proposal(
        id=proposal_id,
        job_id=job.id,
        line_items=items,
        subtotal_cents=subtotal,
        confidence=confidence,
        customer_message=_template_message(job, items),
        rationale=rationale,
        drafter="rules",
    )


def _parse_ollama_payload(raw: str) -> dict[str, Any]:
    text = raw.strip()
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.S)
        if not match:
            raise
        data = json.loads(match.group(0))
    if not isinstance(data, dict):
        raise ValueError("ollama json was not an object")
    return data


def ollama_complete(job: Job) -> dict[str, Any]:
    book = [
        {
            "sku": sku,
            "description": desc,
            "price_usd": round(cents / 100, 2),
        }
        for sku, (desc, cents) in PRICE_BOOK.items()
    ]
    system = (
        "You are QuoteGate, a home-service quoting assistant. "
        "Pick SKUs only from the provided price book. Never invent a SKU. "
        "price_usd is the only legal price; write money as dollars (e.g. $4,200.00), never as cents. "
        "Write a short SMS the technician can send to the homeowner. "
        "No financing, APR, or warranty-upgrade language. "
        "Respond with JSON only."
    )
    user = json.dumps(
        {
            "customer_name": job.customer_name,
            "address": job.address,
            "trade": job.trade,
            "kind": job.kind,
            "notes": job.notes,
            "transcript": job.transcript,
            "price_book": book,
            "json_schema": {
                "skus": ["SKU", "..."],
                "customer_message": "sms",
                "rationale": "why these skus",
                "confidence": 0.0,
            },
        }
    )
    res = httpx.post(
        f"{ollama_host()}/api/chat",
        json={
            "model": ollama_model(),
            "stream": False,
            "format": "json",
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        },
        timeout=60.0,
    )
    res.raise_for_status()
    content = res.json().get("message", {}).get("content", "")
    return _parse_ollama_payload(content)


def draft_ollama(job: Job, proposal_id: str) -> Proposal:
    payload = ollama_complete(job)
    raw_skus = payload.get("skus") or []
    if isinstance(raw_skus, str):
        raw_skus = [raw_skus]
    skus = [str(s) for s in raw_skus]
    items = _items_for(skus)
    if not any(s in PRICE_BOOK for s in skus):
        items = _items_for(_match_skus(f"{job.notes} {job.transcript or ''}"))
    subtotal = int(sum(i.unit_cents * i.qty for i in items))
    message = str(payload.get("customer_message") or "").strip() or _template_message(job, items)
    rationale = str(payload.get("rationale") or "Ollama selected SKUs from the price book.")
    try:
        confidence = float(payload.get("confidence", 0.8))
    except (TypeError, ValueError):
        confidence = 0.8
    confidence = min(0.99, max(0.4, confidence))
    return Proposal(
        id=proposal_id,
        job_id=job.id,
        line_items=items,
        subtotal_cents=subtotal,
        confidence=confidence,
        customer_message=message,
        rationale=rationale,
        drafter=f"ollama:{ollama_model()}",
    )


def draft(job: Job, proposal_id: str) -> Proposal:
    if resolve_drafter() != "ollama":
        return draft_rules(job, proposal_id)
    try:
        return draft_ollama(job, proposal_id)
    except Exception as exc:  # noqa: BLE001 — local demo fallback
        return draft_rules(job, proposal_id, fallback_note=f"Ollama failed ({exc.__class__.__name__}).")
