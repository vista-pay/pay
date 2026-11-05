"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Brand } from "@/components/brand";

function CompleteContent() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref") ?? "";
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,.10)]">
        <Brand />
        <span className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600">✓</span>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-950">Payment received</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Your payment is being confirmed and will reflect shortly.</p>
        {reference && <button type="button" onClick={() => navigator.clipboard?.writeText(reference)} className="mt-5 w-full rounded-xl bg-slate-50 px-4 py-3"><span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">Reference</span><span className="mt-1 block break-all font-mono text-sm font-bold text-slate-800">{reference}</span></button>}
        <p className="mt-5 text-xs leading-5 text-slate-500">You can close this page and return to the app or merchant that sent you here.</p>
        <p className="mt-5 border-t border-slate-100 pt-5 text-[11px] leading-5 text-slate-400">Keep the reference for your records. For help, contact the merchant you paid or support@rendi.ng.</p>
      </section>
    </main>
  );
}

export default function CompletePage() {
  return <Suspense fallback={<main className="flex min-h-screen items-center justify-center"><span className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-[#0735B5]" /></main>}><CompleteContent /></Suspense>;
}
