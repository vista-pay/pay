import type { InputHTMLAttributes } from "react";

export function Field({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        {...props}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0735B5] focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
