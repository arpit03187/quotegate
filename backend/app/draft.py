from __future__ import annotations

from app.models import Job, LineItem, Proposal

PRICE_BOOK: dict[str, tuple[str, int]] = {
    "SVC-DIAG": ("Diagnostic and safety check", 12_900),
    "HVAC-COND-2T": ("2-ton condenser replacement", 420_000),
    "HVAC-TSTAT": ("Wi-Fi thermostat", 34_000),
    "HVAC-CAP": ("Run capacitor", 18_500),
    "PLB-WH-50": ("50-gallon water heater", 210_000),
    "ELE-PANEL-200": ("200A panel replacement", 380_000),
}


def _add(notes: str, sku: str) -> bool:
    needles = {
        "HVAC-COND-2T": ("condenser", "compressor", "2-ton", "2 ton"),
        "HVAC-TSTAT": ("thermostat",),
        "HVAC-CAP": ("capacitor",),
        "PLB-WH-50": ("water heater",),
        "ELE-PANEL-200": ("panel",),
        "SVC-DIAG": ("diagnostic", "service call", "tune-up"),
    }
    text = notes.lower()
    return any(n in text for n in needles[sku])


def draft(job: Job, proposal_id: str) -> Proposal:
    skus: list[str] = []
    blob = f"{job.notes} {job.transcript or ''}"
    for sku in ("HVAC-COND-2T", "HVAC-TSTAT", "HVAC-CAP", "PLB-WH-50", "ELE-PANEL-200"):
        if _add(blob, sku):
            skus.append(sku)
    if not skus:
        skus = ["SVC-DIAG"]

    items = [
        LineItem(sku=sku, description=PRICE_BOOK[sku][0], qty=1, unit_cents=PRICE_BOOK[sku][1], book_cents=PRICE_BOOK[sku][1])
        for sku in skus
    ]
    subtotal = sum(i.unit_cents * i.qty for i in items)
    names = ", ".join(i.description for i in items)
    dollars = subtotal / 100
    message = (
        f"Hi {job.customer_name.split()[0]}, based on what we found at {job.address}, "
        f"I recommend: {names}. Total ${dollars:,.2f}. Reply yes to approve and we'll schedule."
    )
    confidence = 0.91 if len(skus) == 1 and skus[0] == "SVC-DIAG" else 0.84
    rationale = f"Matched price-book SKUs {skus} from notes/transcript. No LLM in the demo drafter."
    return Proposal(
        id=proposal_id,
        job_id=job.id,
        line_items=items,
        subtotal_cents=int(subtotal),
        confidence=confidence,
        customer_message=message,
        rationale=rationale,
    )
