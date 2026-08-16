export type LineItem = {
  sku: string;
  description: string;
  qty: number;
  unit_cents: number;
  book_cents: number;
};

export type QueueItem = {
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

export type Job = {
  id: string;
  customer_name: string;
  address: string;
  trade: string;
  kind: string;
  notes: string;
  fsm: string;
};

export type Proposal = {
  id: string;
  job_id: string;
  line_items: LineItem[];
  subtotal_cents: number;
  confidence: number;
  customer_message: string;
  rationale: string;
  drafter: string;
  policy_hits: string[];
  requires_hitl: boolean;
};

export type AuditEvent = {
  type: string;
  actor: string;
  hash: string;
  prev_hash: string;
  at: string;
};
