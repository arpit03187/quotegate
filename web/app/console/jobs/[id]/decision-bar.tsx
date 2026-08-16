"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API, dollars } from "@/lib/format";
import type { LineItem } from "@/lib/types";

export default function DecisionBar({
  proposalId,
  status,
  lineItems,
}: {
  proposalId: string;
  status: string;
  lineItems: LineItem[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");
  const [items, setItems] = useState(lineItems);
  const [error, setError] = useState<string | null>(null);

  if (status !== "pending") {
    return (
      <p className="muted">
        This quote is <strong>{status}</strong>. The customer already has it, or it was stopped.
      </p>
    );
  }

  async function decide(action: "approve" | "edit" | "reject") {
    setBusy(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { action, channel: "web" };
      if (action === "reject") body.reason = reason || "Rejected from console";
      if (action === "edit") body.edited_items = items;
      const res = await fetch(`${API}/v1/proposals/${proposalId}/decision`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decision failed");
    } finally {
      setBusy(false);
    }
  }

  const edited = items.some(
    (item, i) => item.unit_cents !== lineItems[i]?.unit_cents || item.qty !== lineItems[i]?.qty,
  );
  const total = items.reduce((sum, item) => sum + item.unit_cents * item.qty, 0);

  return (
    <div className="card" style={{ marginTop: 8 }}>
      <h3>Send it?</h3>
      <p className="muted">The homeowner has not seen this yet. Fix a price if you need to, then send — or stop it.</p>
      {items.map((item, index) => (
        <label key={item.sku} className="field" style={{ marginTop: 12 }}>
          {item.description} · book {dollars(item.book_cents)}
          <input
            type="number"
            min={0}
            step={1}
            value={(item.unit_cents / 100).toFixed(2)}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...item, unit_cents: Math.round(Number(e.target.value) * 100) };
              setItems(next);
            }}
          />
        </label>
      ))}
      <p style={{ fontFamily: "var(--font-display), serif", fontSize: 28, margin: "12px 0" }}>
        {dollars(total)}
      </p>
      <label className="field">
        Reject reason
        <input placeholder="Wrong SKU, wait for parts…" value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      {error ? <p className="alert">{error}</p> : null}
      <div className="cta-row" style={{ marginTop: 14 }}>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => decide(edited ? "edit" : "approve")}>
          {busy ? "Working…" : edited ? "Save edits & send" : "Approve & send"}
        </button>
        <button type="button" className="btn btn-danger" disabled={busy} onClick={() => decide("reject")}>
          Reject
        </button>
      </div>
    </div>
  );
}
