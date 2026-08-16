const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type QueueItem = {
  proposal_id: string;
  job_id: string;
  customer_name: string;
  address: string;
  kind: string;
  subtotal_cents: number;
  policy_hits: string[];
  status: string;
  due_at: string | null;
};

async function loadQueue(): Promise<QueueItem[]> {
  try {
    const pending = await fetch(`${API}/v1/queue?status=pending`, { cache: "no-store" });
    const sent = await fetch(`${API}/v1/queue?status=sent`, { cache: "no-store" });
    const a = pending.ok ? ((await pending.json()).items as QueueItem[]) : [];
    const b = sent.ok ? ((await sent.json()).items as QueueItem[]) : [];
    return [...a, ...b];
  } catch {
    return [];
  }
}

function dollars(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function QueuePage() {
  const items = await loadQueue();
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>HITL queue</h1>
      <p style={{ color: "#9aa3b2" }}>
        Backup console. Owners approve on the phone; this is audit and overflow.
      </p>
      {items.length === 0 ? (
        <p style={{ color: "#9aa3b2" }}>
          No jobs yet. POST to <code>/v1/jobs</code> on the API (default localhost:8000).
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#9aa3b2", fontSize: 12 }}>
              <th style={{ padding: "8px 0" }}>Customer</th>
              <th>Kind</th>
              <th>Amount</th>
              <th>Policy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.proposal_id} style={{ borderTop: "1px solid #2a2f3a" }}>
                <td style={{ padding: "12px 0" }}>
                  <a href={`/jobs/${item.job_id}`} style={{ color: "#e8eaed" }}>
                    {item.customer_name}
                  </a>
                  <div style={{ color: "#9aa3b2", fontSize: 12 }}>{item.address}</div>
                </td>
                <td>{item.kind}</td>
                <td>{dollars(item.subtotal_cents)}</td>
                <td style={{ fontSize: 12 }}>{item.policy_hits.join(", ")}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
