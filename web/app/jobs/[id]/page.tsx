const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function loadJob(id: string) {
  const [jobRes, auditRes] = await Promise.all([
    fetch(`${API}/v1/jobs/${id}`, { cache: "no-store" }),
    fetch(`${API}/v1/jobs/${id}/audit`, { cache: "no-store" }),
  ]);
  if (!jobRes.ok) return null;
  return {
    detail: await jobRes.json(),
    audit: auditRes.ok ? await auditRes.json() : { events: [] },
  };
}

function dollars(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadJob(id);
  if (!data) return <p>Job not found. Is the API running on :8000?</p>;
  const { job, proposal } = data.detail;
  const events = data.audit.events as Array<{ type: string; actor: string; hash: string; at: string }>;
  return (
    <div>
      <a href="/" style={{ color: "#9aa3b2" }}>
        ← Queue
      </a>
      <h1 style={{ fontSize: 22 }}>
        {job.customer_name} · {job.kind.replace("_", " ")}
      </h1>
      <p style={{ color: "#9aa3b2" }}>{job.address}</p>
      <p>{job.notes}</p>
      {proposal && (
        <>
          <h2 style={{ fontSize: 16, marginTop: 24 }}>Proposal {dollars(proposal.subtotal_cents)}</h2>
          <p style={{ color: "#9aa3b2" }}>{proposal.customer_message}</p>
          <ul>
            {proposal.line_items.map((line: { sku: string; description: string; unit_cents: number; book_cents: number }) => (
              <li key={line.sku}>
                {line.description} · {dollars(line.unit_cents)}{" "}
                {line.unit_cents !== line.book_cents ? `(book ${dollars(line.book_cents)})` : ""}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 13, color: "#9aa3b2" }}>Policy: {proposal.policy_hits.join(" · ")}</p>
        </>
      )}
      <h2 style={{ fontSize: 16, marginTop: 24 }}>Audit chain</h2>
      <ol>
        {events.map((e) => (
          <li key={e.hash} style={{ marginBottom: 8 }}>
            <strong>{e.type}</strong> · {e.actor}
            <div style={{ fontSize: 11, color: "#9aa3b2", fontFamily: "ui-monospace, monospace" }}>
              {e.hash.slice(0, 16)}…
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
