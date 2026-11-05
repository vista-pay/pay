import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Rendi Pay", template: "%s | Rendi Pay" },
  description: "Secure payments to Rendi people, businesses, and communities.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
