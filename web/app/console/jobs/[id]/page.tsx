import Link from "next/link";
import DecisionBar from "./decision-bar";
import { API, dollars, policyLabel } from "@/lib/format";
import type { AuditEvent, Job, Proposal } from "@/lib/types";

const EVENT_LABELS: Record<string, string> = {
  ingested: "Job came in",
  proposed: "Quote written",
  policy_evaluated: "Checked whether you need to see it",
  gated: "Held for you",
  notified_approver: "Put in your queue",
  resumed: "You decided",
  executed: "Sent to the customer",
  auto_approved: "Sent on its own (small service)",
};

function eventLabel(type: string) {
  return EVENT_LABELS[type] ?? type.replaceAll("_", " ");
}

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

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadJob(id);
  if (!data) {
    return (
      <div className="empty">
        <h3>Job not found</h3>
        <p className="muted">Start the API on port 8000, then draft a quote from the queue.</p>
        <Link href="/console" className="btn btn-ghost">
          Back to queue
        </Link>
      </div>
    );
  }
  const job = data.detail.job as Job;
  const proposal = data.detail.proposal as Proposal | null;
  const queue = data.detail.queue as { status: string } | null;
  const events = data.audit.events as AuditEvent[];
  const status = queue?.status ?? (proposal?.requires_hitl ? "pending" : "sent");

  return (
    <div>
      <Link href="/console" className="muted">
        ← Queue
      </Link>
      <div className="page-head" style={{ marginTop: 12 }}>
        <div>
          <p className="kicker">
            {job.kind.replace("_", " ")} · {job.trade}
          </p>
          <h1>{job.customer_name}</h1>
          <p className="muted">{job.address}</p>
        </div>
        <div className={`status ${status}`}>{status}</div>
      </div>

      <p className="card" style={{ marginBottom: 20 }}>
        <strong>Tech notes. </strong>
        {job.notes}
      </p>

      <div className="split">
        <div>
          {proposal ? (
            <>
              <p className="kicker">Draft</p>
              <h2 style={{ fontSize: 42, margin: "0 0 8px" }}>{dollars(proposal.subtotal_cents)}</h2>
              <p className="muted">{proposal.customer_message}</p>
              <ul>
                {proposal.line_items.map((line) => (
                  <li key={line.sku}>
                    {line.description} · {dollars(line.unit_cents)}
                    {line.unit_cents !== line.book_cents ? ` (book ${dollars(line.book_cents)})` : ""}
                  </li>
                ))}
              </ul>
              <div className="pills">
                {proposal.policy_hits.map((hit) => (
                  <span key={hit} className="pill">
                    {policyLabel(hit)}
                  </span>
                ))}
              </div>
              <DecisionBar proposalId={proposal.id} status={status} lineItems={proposal.line_items} />
            </>
          ) : (
            <p className="muted">No proposal yet.</p>
          )}
        </div>
        <aside className="card">
          <h3>What happened</h3>
          <p className="muted">If the customer argues about the number later, this is the trail.</p>
          <ol className="audit" style={{ marginTop: 16 }}>
            {events.map((e) => (
              <li key={e.hash}>
                <strong>{eventLabel(e.type)}</strong>
                <div className="hash">{e.hash.slice(0, 20)}…</div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
