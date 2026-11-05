const SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  GHS: "₵",
  KES: "KSh",
  ZAR: "R",
};

export function money(amount: string | number, currency: string) {
  const numeric = Number(amount);
  const value = (Number.isFinite(numeric) ? numeric : 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${SYMBOLS[currency] ?? `${currency} `}${value}`;
}

export function date(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function idempotencyKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `pay-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

export function paymentUrl(hash: string) {
  const base = (process.env.NEXT_PUBLIC_PAYMENT_BASE_URL ?? "https://pay.rendi.ng").replace(/\/+$/, "");
  return `${base}/${hash}`;
}
