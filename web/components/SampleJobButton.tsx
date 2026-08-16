"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API } from "@/lib/format";

const SAMPLE = {
  customer_name: "A. Rivera",
  address: "14 Palm Dr, Phoenix AZ",
  trade: "hvac",
  kind: "quote",
  notes: "2-ton condenser failed. Customer asked to add a thermostat.",
};

export default function SampleJobButton({ label = "Try a live sample quote" }: { label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API}/v1/jobs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(SAMPLE),
      });
      if (!res.ok) throw new Error("Could not reach the QuoteGate API on port 8000.");
      const json = await res.json();
      router.push(`/console/jobs/${json.job_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sample failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" className="btn btn-primary" disabled={busy} onClick={run}>
        {busy ? "Writing the quote…" : label}
      </button>
      {error ? <p className="alert" style={{ marginTop: 12 }}>{error}</p> : null}
    </div>
  );
}
