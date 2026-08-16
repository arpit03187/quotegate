"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SampleJobButton from "@/components/SampleJobButton";
import { API, dollars, policyLabel } from "@/lib/format";
import type { QueueItem } from "@/lib/types";

const FILTERS = ["all", "pending", "sent", "rejected", "failed"] as const;

export default function QueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("pending");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch(`${API}/v1/queue`, { cache: "no-store" });
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setItems(json.items ?? []);
      setCounts(json.counts ?? {});
      setError(null);
    } catch {
      setError("The API is not running. Start it on port 8000, then refresh.");
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, []);

  const visible = filter === "all" ? items : items.filter((i) => i.status === filter);
  const pending = counts.pending ?? 0;

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">Waiting for you</p>
          <h1>{pending ? `${pending} quote${pending === 1 ? "" : "s"} to send` : "No quotes waiting"}</h1>
          <p className="muted">
            These have not gone to the homeowner yet. Open one, check the
            number, then send or reject.
          </p>
        </div>
        <Link href="/console/new" className="btn btn-primary">
          New quote
        </Link>
      </div>

      {error ? <p className="alert">{error}</p> : null}

      <div className="filters">
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            className={`chip ${filter === key ? "on" : ""}`}
            onClick={() => setFilter(key)}
          >
            {key === "all" ? "All" : key}
            {key === "all" ? ` ${items.length}` : counts[key] ? ` ${counts[key]}` : ""}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <h3>Nothing waiting for you</h3>
          <p className="muted">
            Start with a job the tech would text you. We’ll write the quote and
            hold it here until you send it to the customer.
          </p>
          <div className="samples">
            <SampleJobButton label="Load the condenser sample" />
            <Link href="/console/new" className="btn btn-ghost">
              Use your own notes
            </Link>
          </div>
        </div>
      ) : (
        <div className="queue">
          {visible.map((item) => (
            <Link key={item.proposal_id} href={`/console/jobs/${item.job_id}`} className="queue-item">
              <div>
                <div className="who">{item.customer_name}</div>
                <div className="muted">{item.address}</div>
                <div className="pills">
                  <span className="pill">{item.kind.replace("_", " ")}</span>
                  {item.policy_hits.slice(0, 3).map((hit) => (
                    <span key={hit} className="pill">
                      {policyLabel(hit)}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`status ${item.status}`}>{item.status}</div>
              <div className="amt">{dollars(item.subtotal_cents)}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
