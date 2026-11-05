export function SecurityFooter() {
  return (
    <div className="mt-6 border-t border-slate-100 pt-5 text-center">
      <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        Encrypted and secured by Rendi
      </p>
      <p className="mt-2 text-[11px] leading-4 text-slate-400">Rendi will never ask for your PIN or OTP on this page.</p>
    </div>
  );
}
