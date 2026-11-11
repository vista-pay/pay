import { jsPDF } from "jspdf";
import type { PublicInvoice } from "./api";
import { date, money } from "./format";

export function downloadInvoice(invoice: PublicInvoice, checkoutUrl: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 48;
  const right = 547;
  let y = 72;
  const merchant = invoice.merchantName ?? invoice.businessName ?? "Rendi merchant";

  doc.setFillColor("#FFFFFF");
  doc.rect(0, 0, 595, 842, "F");
  doc.setFillColor("#0735B5");
  doc.rect(0, 0, 595, 124, "F");
  doc.setFillColor("#FFFFFF");
  doc.roundedRect(left, 36, 36, 36, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor("#0735B5");
  doc.text("R", left + 18, 61, { align: "center" });
  doc.setFontSize(22);
  doc.setTextColor("#FFFFFF");
  doc.text("RENDI", left + 48, 61);

  y = 168;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#111B31");
  doc.text(merchant, left, y);
  doc.setFontSize(12);
  doc.setTextColor("#2453E6");
  doc.text("INVOICE", right, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#475569");
  doc.text(invoice.invoiceNumber, right, y + 16, { align: "right" });

  y += 44;
  doc.setDrawColor("#E2E8F0");
  doc.line(left, y, right, y);
  y += 28;
  doc.setTextColor("#64748B");
  doc.text("BILLED TO", left, y);
  doc.text("ISSUED", 330, y);
  doc.text("DUE", 445, y);
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#0F172A");
  doc.text(invoice.customerName, left, y);
  doc.setFont("helvetica", "normal");
  doc.text(date(invoice.createdAt), 330, y);
  doc.text(date(invoice.dueDate), 445, y);
  y += 15;
  doc.setTextColor("#64748B");
  doc.text(invoice.customerEmail, left, y);

  y += 34;
  doc.setFillColor("#EDF3FF");
  doc.rect(left, y - 14, right - left, 25, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#475569");
  doc.text("DESCRIPTION", left + 10, y);
  doc.text("QTY", 350, y, { align: "right" });
  doc.text("UNIT PRICE", 440, y, { align: "right" });
  doc.text("TOTAL", right - 10, y, { align: "right" });
  y += 28;

  for (const item of invoice.items) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#0F172A");
    const lines = doc.splitTextToSize(item.description, 250) as string[];
    doc.text(lines, left + 10, y);
    doc.text(String(item.quantity), 350, y, { align: "right" });
    doc.text(money(item.unitPrice, invoice.currencyCode), 440, y, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(money(item.totalAmount, invoice.currencyCode), right - 10, y, { align: "right" });
    y += Math.max(lines.length * 13, 13) + 12;
    if (y > 720) { doc.addPage(); y = 64; }
  }

  y += 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#0F172A");
  doc.text("Total due", 440, y, { align: "right" });
  doc.setTextColor("#2453E6");
  doc.text(money(invoice.totalAmount, invoice.currencyCode), right - 10, y, { align: "right" });
  if (invoice.status !== "PAID") {
    y += 38;
    doc.setFontSize(10);
    doc.setTextColor("#64748B");
    doc.text("Pay this invoice online:", left, y);
    doc.setTextColor("#0735B5");
    doc.textWithLink(checkoutUrl, left, y + 15, { url: checkoutUrl });
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#64748B");
  doc.text("Generated securely by RENDI Pay", left, 790);
  doc.text("support@rendi.ng  |  rendi.ng", right, 790, { align: "right" });
  doc.save(`${invoice.invoiceNumber}.pdf`);
}
