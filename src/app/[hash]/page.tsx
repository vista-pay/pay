"use client";

import { use, useEffect, useState } from "react";
import { Brand } from "@/components/brand";
import { Field } from "@/components/field";
import { SecurityFooter } from "@/components/security-footer";
import { idempotencyKey, money } from "@/lib/format";
import { payApi, type PaymentStart, type PublicPaymentLink } from "@/lib/api";

export default function CheckoutPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);
  const [link, setLink] = useState<PublicPaymentLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [transfer, setTransfer] = useState<PaymentStart["virtualAccount"] | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    payApi.paymentLink(hash)
      .then((value) => active && setLink(value))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "This payment link is unavailable."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [hash]);

  const numericAmount = link?.isFixedAmount ? Number(link.amount ?? 0) : Number(amount);
  const validEmail = /^\S+@\S+\.\S+$/.test(email.trim());
  const canPay = Boolean(link && name.trim() && validEmail && numericAmount > 0 && !paying);

  async function startPayment() {
    if (!link || !canPay) return;
    setPaying(true);
    setError(null);
    try {
      const result = await payApi.pay(
        link.linkHash,
        {
          customerName: name.trim(),
          customerEmail: email.trim().toLowerCase(),
          ...(!link.isFixedAmount ? { amount: String(numericAmount) } : {}),
        },
        idempotencyKey(),
      );
      const checkout = result.checkoutUrl ?? result.authorizationUrl;
      if (checkout) {
        window.location.assign(checkout);
        return;
      }
      // No hosted page means pay-by-transfer: the provider opened a one-time
      // account for exactly this payment, and the transfer itself confirms it.
      if (result.virtualAccount) {
        setTransfer(result.virtualAccount);
        setReference(result.paymentReference ?? result.reference ?? null);
        return;
      }
      setReference(result.paymentReference ?? result.reference ?? "Payment initialised");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The payment could not be started.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:py-12">
      <section className="w-full max-w-[500px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,.10)]">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8"><Brand /></div>
        <div className="px-6 py-7 sm:px-8">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center"><span className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-[#0735B5]" /></div>
          ) : !link ? (
            <div className="py-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">×</span>
              <h1 className="mt-4 text-xl font-extrabold text-slate-950">Link unavailable</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">{error ?? "This payment link is no longer active."}</p>
            </div>
          ) : transfer ? (
            <div className="py-6">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Pay by bank transfer</p>
              <h1 className="mt-2 text-xl font-extrabold text-slate-950">
                Transfer {numericAmount > 0 ? money(numericAmount, link?.currency ?? "NGN") : "the amount due"} to
              </h1>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                This account was created just for this payment. Send the exact amount from any Nigerian bank — your payment confirms automatically once the transfer lands.
              </p>
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-[.08em] text-blue-700">{transfer.bankName}</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="font-mono text-3xl font-extrabold tracking-wide text-[#0735B5]">{transfer.accountNumber}</p>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(transfer.accountNumber);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="shrink-0 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0735B5] transition hover:bg-blue-100"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700">{transfer.accountName}</p>
              </div>
              {reference && (
                <p className="mt-4 text-center text-xs text-slate-400">
                  Reference: <span className="font-mono font-semibold text-slate-600">{reference}</span>
                </p>
              )}
            </div>
          ) : reference ? (
            <div className="py-10 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600">✓</span>
              <h1 className="mt-5 text-2xl font-extrabold text-slate-950">Payment started</h1>
              <p className="mt-2 text-sm text-slate-500">Reference: <span className="font-mono font-bold text-slate-800">{reference}</span></p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Paying</p>
              <div className="mt-2 flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-950">{link.merchantName ?? "Rendi merchant"}</h1>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white" title="Verified merchant">✓</span>
              </div>
              <p className="mt-5 text-sm font-semibold text-slate-700">{link.title}</p>
              {link.description && <p className="mt-1 text-sm leading-5 text-slate-500">{link.description}</p>}

              <div className="mt-5 rounded-2xl bg-blue-50 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-[.08em] text-blue-700">Amount due</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-[#0735B5]">
                  {numericAmount > 0 ? money(numericAmount, link.currency) : "Enter an amount"}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {!link.isFixedAmount && <Field label="Amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ""))} placeholder="0.00" />}
                <Field label="Full name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" />
                <Field label="Email address" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
              </div>

              {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button type="button" onClick={startPayment} disabled={!canPay} className="mt-6 h-13 w-full rounded-xl bg-[#0735B5] text-[15px] font-bold text-white transition hover:bg-[#05288D] disabled:cursor-not-allowed disabled:bg-slate-300">
                {paying ? "Preparing your payment…" : numericAmount > 0 ? `Pay ${money(numericAmount, link.currency)}` : "Pay now"}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">You’ll get a dedicated bank account to transfer to — payment confirms automatically.</p>
            </>
          )}
          <SecurityFooter />
        </div>
      </section>
    </main>
  );
}
