import { redirect } from "next/navigation";

export const instant = false;

export default async function LegacyPaymentPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  redirect(`/${encodeURIComponent(hash)}`);
}
