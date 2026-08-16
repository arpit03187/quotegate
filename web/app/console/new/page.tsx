"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { API } from "@/lib/format";

const EXAMPLES = [
  {
    label: "HVAC replacement",
    notes: "2-ton condenser failed. Customer asked to add a thermostat.",
    kind: "quote",
    trade: "hvac",
  },
  {
    label: "Change order",
    notes: "Homeowner wants to add a Wi-Fi thermostat to the signed water heater job.",
    kind: "change_order",
    trade: "plumbing",
  },
  {
    label: "Diagnostic",
    notes: "diagnostic tune-up",
    kind: "quote",
    trade: "hvac",
  },
];

export default function NewJobPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    address: "",
    trade: "hvac",
    kind: "quote",
    notes: "",
  });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API}/v1/jobs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      router.push(`/console/jobs/${json.job_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <Link href="/console" className="muted">
        ← Queue
      </Link>
      <div className="page-head" style={{ marginTop: 12 }}>
        <div>
          <p className="kicker">New quote</p>
          <h1>What did the tech find?</h1>
          <p className="muted">
            Type it like a text from the truck. We’ll write the quote and wait
            for you before the customer sees it.
          </p>
        </div>
      </div>

      <div className="samples" style={{ marginBottom: 18 }}>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            className="chip"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                notes: ex.notes,
                kind: ex.kind,
                trade: ex.trade,
                customer_name: prev.customer_name || "A. Rivera",
                address: prev.address || "14 Palm Dr, Phoenix AZ",
              }))
            }
          >
            {ex.label}
          </button>
        ))}
      </div>

      <form className="form" onSubmit={submit}>
        <label className="field">
          Customer
          <input required value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} />
        </label>
        <label className="field">
          Address
          <input required value={form.address} onChange={(e) => set("address", e.target.value)} />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label className="field">
            Trade
            <select value={form.trade} onChange={(e) => set("trade", e.target.value)}>
              <option value="hvac">HVAC</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
            </select>
          </label>
          <label className="field">
            Kind
            <select value={form.kind} onChange={(e) => set("kind", e.target.value)}>
              <option value="quote">Quote</option>
              <option value="change_order">Change order</option>
            </select>
          </label>
        </div>
        <label className="field">
          Tech notes
          <textarea
            required
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="2-ton condenser failed. Customer asked to add a thermostat."
          />
        </label>
        {error ? <p className="alert">{error}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Drafting…" : "Draft the quote"}
        </button>
      </form>
    </div>
  );
}
