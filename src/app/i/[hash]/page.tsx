"use client";

import { use, useEffect, useState } from "react";
import { Brand } from "@/components/brand";
import { SecurityFooter } from "@/components/security-footer";
import { payApi, type PublicInvoice } from "@/lib/api";
import { date, money, paymentUrl } from "@/lib/format";

export default function InvoicePage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);
  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    payApi.invoice(hash)
      .then((value) => active && setInvoice(value))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "This invoice is unavailable."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [hash]);

  async function download() {
    if (!invoice) return;
    const { downloadInvoice } = await import("@/lib/invoice-pdf");
    downloadInvoice(invoice, paymentUrl(invoice.linkHash ?? hash));
  }

  const merchantName = invoice?.merchantName ?? invoice?.businessName ?? "Rendi merchant";
  const merchantEmail = invoice?.merchantEmail ?? invoice?.businessEmail;
  const paid = invoice?.status.toUpperCase() === "PAID";

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <section className="mx-auto w-full max-w-[760px] rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,.08)] sm:p-10">
        {loading ? (
          <div className="flex min-h-96 items-center justify-center"><span className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-[#0735B5]" /></div>
        ) : !invoice ? (
          <div className="py-14 text-center"><Brand /><h1 className="mt-7 text-2xl font-extrabold">Invoice unavailable</h1><p className="mt-2 text-sm text-slate-500">{error}</p></div>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div><Brand /><h1 className="mt-6 text-xl font-extrabold text-slate-950">{merchantName}</h1>{merchantEmail && <p className="mt-1 text-sm text-slate-500">{merchantEmail}</p>}</div>
              <div className="text-right"><p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#0735B5]">Invoice</p><p className="mt-1 font-semibold text-slate-800">{invoice.invoiceNumber}</p></div>
            </div>
            <hr className="my-7 border-slate-200" />
            <div className="grid gap-5 sm:grid-cols-3">
              <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Billed to</p><p className="mt-1 font-bold text-slate-950">{invoice.customerName}</p><p className="text-sm text-slate-500">{invoice.customerEmail}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Issued</p><p className="mt-1 font-semibold">{date(invoice.createdAt)}</p></div>
              <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Due</p><p className="mt-1 font-semibold">{date(invoice.dueDate)}</p></div>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead><tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><th className="px-3 py-3">Description</th><th className="px-3 py-3 text-right">Qty</th><th className="px-3 py-3 text-right">Unit price</th><th className="px-3 py-3 text-right">Total</th></tr></thead>
                <tbody>{invoice.items.map((item) => <tr key={item.id} className="border-b border-slate-100"><td className="px-3 py-4 font-semibold">{item.description}</td><td className="px-3 py-4 text-right">{item.quantity}</td><td className="px-3 py-4 text-right">{money(item.unitPrice, invoice.currencyCode)}</td><td className="px-3 py-4 text-right font-bold">{money(item.totalAmount, invoice.currencyCode)}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="mt-7 flex justify-end"><div className="flex w-full max-w-sm items-center justify-between border-t-2 border-slate-900 pt-4"><span className="font-bold">{paid ? "Total paid" : "Total due"}</span><span className="text-2xl font-extrabold text-[#0735B5]">{money(invoice.totalAmount, invoice.currencyCode)}</span></div></div>
            <div className="mt-8 flex flex-wrap gap-3">
              {paid ? <p className="flex h-12 flex-1 items-center justify-center rounded-xl bg-emerald-50 px-5 font-bold text-emerald-700">Paid {date(invoice.paidAt)}</p> : <a href={paymentUrl(invoice.linkHash ?? hash)} className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#0735B5] px-6 font-bold text-white hover:bg-[#05288D]">Pay {money(invoice.totalAmount, invoice.currencyCode)}</a>}
              <button type="button" onClick={download} className="h-12 rounded-xl border border-slate-200 bg-white px-6 font-bold text-slate-800 hover:bg-slate-50">Download PDF</button>
            </div>
            <SecurityFooter />
          </>
        )}
      </section>
    </main>
  );
}
