// 9100 is the port the `vista_api` container publishes — the same API the
// mobile app, community portal and admin console use. This previously
// defaulted to 9001, where nothing listens.
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:9100/api/v1").replace(/\/+$/, "");

/**
 * Which application this is, on every call to the API.
 *
 * Recorded on the central activity stream so Super Admin oversight can tell a
 * payment taken on the hosted pay page from one taken in the app. Provenance
 * only — nothing is authorised off it.
 */
const SURFACE_HEADERS = { "X-Rendi-Surface": "PAY" } as const;

type ApiEnvelope<T> = { data?: T; message?: string | string[]; error?: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...SURFACE_HEADERS, ...(init?.headers ?? {}) },
  });
  const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T> | T;
  if (!response.ok) {
    const envelope = payload as ApiEnvelope<T>;
    const raw = envelope.message ?? envelope.error ?? `Request failed (${response.status})`;
    throw new Error(Array.isArray(raw) ? raw.join(", ") : raw);
  }
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
}

export const payApi = {
  paymentLink: (hash: string) => request<PublicPaymentLink>(`/payment-links/${encodeURIComponent(hash)}`),
  pay: (hash: string, body: PayRequest, idempotencyKey: string) =>
    request<PaymentStart>(`/payment-links/${encodeURIComponent(hash)}/pay`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "idempotency-key": idempotencyKey },
    }),
  invoice: (hash: string) => request<PublicInvoice>(`/public/invoices/${encodeURIComponent(hash)}`),
};

export type PublicPaymentLink = {
  id: string;
  linkHash: string;
  title: string;
  description?: string | null;
  amount?: string | null;
  currency: string;
  isFixedAmount: boolean;
  merchantName?: string | null;
};

export type PayRequest = {
  customerName: string;
  customerEmail: string;
  amount?: string;
};

export type PaymentStart = {
  checkoutUrl?: string;
  authorizationUrl?: string;
  reference?: string;
  paymentReference?: string;
  amount?: string;
  currency?: string;
  /**
   * Pay-by-transfer coordinates. Present instead of a checkout URL when the
   * provider collects through a one-time virtual account (Providus): the
   * payer transfers to this account and the payment confirms itself through
   * the bank's credit notification.
   */
  virtualAccount?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
    expiresAt?: string;
  };
};

export type PublicInvoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  currencyCode: string;
  status: string;
  dueDate: string;
  createdAt?: string;
  paidAt?: string | null;
  merchantName?: string | null;
  merchantEmail?: string | null;
  businessName?: string | null;
  businessEmail?: string | null;
  linkHash?: string | null;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: string;
    totalAmount: string;
  }>;
};
