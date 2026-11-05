export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src="/rendi-logo.svg"
        alt="Rendi"
        className="h-11 w-11 rounded-xl object-contain shadow-sm"
      />
      {!compact && (
        <span>
          <span className="block text-lg font-extrabold tracking-tight text-slate-950">Rendi Pay</span>
          <span className="block text-xs font-medium text-slate-500">Secure public checkout</span>
        </span>
      )}
    </span>
  );
}
