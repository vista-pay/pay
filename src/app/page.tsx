import { Brand } from "@/components/brand";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,.08)]">
        <Brand />
        <h1 className="mt-7 text-2xl font-extrabold tracking-tight text-slate-950">A secure payment link is required</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Open the complete link shared by the person, business, or community you want to pay.
        </p>
        <a href="https://rendi.ng" className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-[#0735B5] px-6 text-sm font-bold text-white hover:bg-[#05288D]">
          Visit Rendi
        </a>
      </section>
    </main>
  );
}
