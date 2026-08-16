export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const POLICY_LABELS: Record<string, string> = {
  P_AMOUNT: "Big ticket",
  P_DISCOUNT: "Discount",
  P_REPLACEMENT: "Replacement",
  P_FINANCING: "Financing language",
  P_CHANGE_ORDER: "Extra work",
  P_LOW_CONFIDENCE: "Needs a look",
  P_BOOK_SERVICE: "Small service",
  P_CUSTOMER_VISIBLE: "Goes to customer",
};

export function dollars(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function policyLabel(code: string) {
  return POLICY_LABELS[code] ?? code;
}
