import { Brand } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Brand />
        <p className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-[#0735B5]">404</p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-950">Payment page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">Check the link with the sender. It may be incomplete or no longer available.</p>
      </section>
    </main>
  );
}
