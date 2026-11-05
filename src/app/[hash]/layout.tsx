import { Suspense, type ReactNode } from "react";

export const instant = false;

export default function PaymentHashLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteLoading />}>{children}</Suspense>;
}

function RouteLoading() {
  return <main className="flex min-h-screen items-center justify-center"><span className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#0735B5]" /></main>;
}
