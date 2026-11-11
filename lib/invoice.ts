export interface InvoiceOrderItem {
  id?: string;
  title?: string;
  variantTitle?: string;
  price?: number;
  quantity?: number;
  isGift?: boolean;
  customName?: string;
}

export interface InvoiceShippingDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface InvoiceOrderInput {
  orderId?: string;
  id?: string;
  createdAt?: string | Date | { toDate?: () => Date } | { seconds?: number };
  status?: string;
  paymentMethod?: string;
  paymentMode?: string;
  transactionId?: string;
  txnid?: string;
  deliveryMethod?: string;
  total?: number;
  amountPaid?: number;
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  promoCode?: string | null;
  shippingDetails?: InvoiceShippingDetails;
  shipping?: InvoiceShippingDetails;
  items?: InvoiceOrderItem[];
}

function formatPdfCurrency(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
  return `Rs. ${safe.toLocaleString("en-IN")}`;
}

function resolveInvoiceDate(raw: InvoiceOrderInput["createdAt"]): string {
  if (!raw) {
    return new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  if (typeof raw === "string") return raw;
  if (raw instanceof Date) {
    return raw.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  if (typeof raw === "object") {
    if ("toDate" in raw && typeof raw.toDate === "function") {
      return raw.toDate().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    if ("seconds" in raw && typeof raw.seconds === "number") {
      return new Date(raw.seconds * 1000).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }
  return new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function downloadOrderInvoicePDF(order: InvoiceOrderInput): Promise<void> {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;

  const orderId = order.orderId || order.id || "ORD-OCTOPUS";
  const dateLabel = resolveInvoiceDate(order.createdAt);
  const customer = order.shippingDetails || order.shipping || {};
  const rawItems = Array.isArray(order.items) ? order.items : [];

  const computedSubtotal =
    typeof order.subtotal === "number" && order.subtotal > 0
      ? order.subtotal
      : rawItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);

  const shippingFee =
    typeof order.shippingFee === "number"
      ? order.shippingFee
      : order.deliveryMethod === "international"
      ? 1500
      : 0;

  const finalTotal = Number(order.total ?? order.amountPaid ?? 0);
  const discountAmount =
    typeof order.discountAmount === "number" && order.discountAmount >= 0
      ? order.discountAmount
      : Math.max(0, computedSubtotal + shippingFee - finalTotal);

  // Obsidian Header Band
  doc.setFillColor(20, 18, 16);
  doc.rect(0, 0, pageWidth, 42, "F");

  // Champagne Bronze Accent Line
  doc.setFillColor(154, 121, 83);
  doc.rect(0, 42, pageWidth, 1.4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("OCTOPUS PERFUMES", margin, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(212, 175, 122);
  doc.text("AUTHENTIC DESIGNER & NICHE FRAGRANCE HOUSE  |  INDIA", margin, 27);
  doc.setTextColor(190, 185, 178);
  doc.text("octopusperfume.in   |   orders@octopusperfume.in", margin, 33);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("TAX INVOICE", pageWidth - margin, 20, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(212, 175, 122);
  doc.text(`Order #${orderId}`, pageWidth - margin, 27, { align: "right" });
  doc.setTextColor(190, 185, 178);
  doc.text(`Issued: ${dateLabel}`, pageWidth - margin, 33, { align: "right" });

  // Customer & Payment Summary Cards
  const cardTop = 52;
  const cardWidth = (pageWidth - margin * 2 - 8) / 2;

  doc.setFillColor(247, 246, 243);
  doc.setDrawColor(232, 230, 225);
  doc.roundedRect(margin, cardTop, cardWidth, 38, 2, 2, "FD");
  doc.roundedRect(margin + cardWidth + 8, cardTop, cardWidth, 38, 2, 2, "FD");

  // Left Card: Billed & Shipped To
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(154, 121, 83);
  doc.text("BILLED & SHIPPED TO", margin + 5, cardTop + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(36, 36, 36);
  doc.text(customer.name || "Valued Patron", margin + 5, cardTop + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(92, 89, 84);
  const addressLine1 = customer.address ? String(customer.address).slice(0, 44) : "Verified Shipping Address";
  const cityLine = [customer.city, customer.state, customer.zip].filter(Boolean).join(", ");
  doc.text(addressLine1, margin + 5, cardTop + 20);
  if (cityLine) {
    doc.text(cityLine, margin + 5, cardTop + 25);
  }
  const contactLine = [customer.phone ? `+91 ${customer.phone}` : "", customer.email || ""]
    .filter(Boolean)
    .join("  |  ");
  if (contactLine) {
    doc.text(contactLine.slice(0, 48), margin + 5, cardTop + 31);
  }

  // Right Card: Transaction & Fulfillment Info
  const rightX = margin + cardWidth + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(154, 121, 83);
  doc.text("ORDER & PAYMENT DETAILS", rightX + 5, cardTop + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(36, 36, 36);
  const statusLabel = order.status || "Order Confirmed";
  const paymentLabel =
    order.paymentMode || (order.paymentMethod === "cod" ? "Prepaid Dispatch Reserve" : "Prepaid Verified");
  const shippingMethodLabel =
    order.deliveryMethod === "international" ? "International Air Courier" : "Complimentary Express Air";
  const refTxn = order.transactionId || order.txnid || orderId;

  doc.text(`Status: ${statusLabel}`, rightX + 5, cardTop + 14);
  doc.text(`Payment Mode: ${paymentLabel}`, rightX + 5, cardTop + 20);
  doc.text(`Shipping Tier: ${shippingMethodLabel}`, rightX + 5, cardTop + 26);
  doc.setTextColor(92, 89, 84);
  doc.text(`Reference: ${refTxn}`, rightX + 5, cardTop + 32);

  // Itemized Product Table
  const tableRows: Array<[string, string, string, string]> = rawItems.map((item) => {
    const qty = Number(item.quantity || 1);
    const price = Number(item.price || 0);
    const labelParts = [item.title || "Signature Eau De Parfum"];
    if (item.variantTitle) labelParts.push(`Edition: ${item.variantTitle}`);
    if (item.customName) labelParts.push(`Personalization: ${item.customName}`);
    return [
      labelParts.join(" — "),
      String(qty),
      price === 0 ? "Complimentary" : formatPdfCurrency(price),
      price === 0 ? "Complimentary" : formatPdfCurrency(price * qty),
    ];
  });

  const hasGiftAlready = rawItems.some((item) =>
    (item.title || "").toLowerCase().includes("paradox") || item.isGift
  );
  if (!hasGiftAlready) {
    tableRows.push([
      "Complimentary 7ML Paradox Discovery Vial (Prepaid Gift)",
      "1",
      "Complimentary",
      "Rs. 0",
    ]);
  }

  autoTable(doc, {
    startY: 98,
    margin: { left: margin, right: margin },
    head: [["FRAGRANCE / ITEM DESCRIPTION", "QTY", "UNIT PRICE", "AMOUNT"]],
    body: tableRows,
    theme: "plain",
    headStyles: {
      fillColor: [20, 18, 16],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
    },
    bodyStyles: {
      textColor: [36, 36, 36],
      fontSize: 9,
      cellPadding: { top: 4.5, right: 4, bottom: 4.5, left: 4 },
      lineColor: [232, 230, 225],
      lineWidth: { bottom: 0.3 },
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 16, halign: "center" },
      2: { cellWidth: 32, halign: "right" },
      3: { cellWidth: 32, halign: "right", fontStyle: "bold" },
    },
  });

  const tableEndY =
    (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 150;

  // Summary Block
  const summaryTop = tableEndY + 8;
  const summaryWidth = 76;
  const summaryX = pageWidth - margin - summaryWidth;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(92, 89, 84);

  let rowY = summaryTop;
  doc.text("Catalog Subtotal", summaryX, rowY);
  doc.text(formatPdfCurrency(computedSubtotal), pageWidth - margin, rowY, { align: "right" });

  if (discountAmount > 0) {
    rowY += 6.5;
    doc.setTextColor(52, 122, 84);
    const discLabel = order.promoCode ? `Savings (${order.promoCode})` : "Order Savings";
    doc.text(discLabel, summaryX, rowY);
    doc.text(`-${formatPdfCurrency(discountAmount)}`, pageWidth - margin, rowY, { align: "right" });
  }

  rowY += 6.5;
  doc.setTextColor(92, 89, 84);
  doc.text("Insured Air Shipping", summaryX, rowY);
  doc.text(shippingFee === 0 ? "Complimentary" : formatPdfCurrency(shippingFee), pageWidth - margin, rowY, {
    align: "right",
  });

  rowY += 4.5;
  doc.setDrawColor(212, 207, 199);
  doc.line(summaryX, rowY, pageWidth - margin, rowY);

  rowY += 7;
  doc.setFillColor(247, 246, 243);
  doc.rect(summaryX - 3, rowY - 5.5, summaryWidth + 3, 9.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(20, 18, 16);
  doc.text("TOTAL PAID (INCL. GST)", summaryX, rowY + 0.5);
  doc.setTextColor(154, 121, 83);
  doc.text(formatPdfCurrency(finalTotal), pageWidth - margin, rowY + 0.5, { align: "right" });

  // Authenticity & Dispatch Footnote
  const footerY = Math.max(rowY + 20, pageHeight - 34);
  doc.setDrawColor(232, 230, 225);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(36, 36, 36);
  doc.text("100% Authentic Fragrances  |  Batch-Verified Stock  |  Insured Cold-Chain Transit", pageWidth / 2, footerY + 7, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(119, 119, 119);
  doc.text(
    "This is a computer-generated order invoice from Octopus Perfumes and requires no physical signature.",
    pageWidth / 2,
    footerY + 13,
    { align: "center" }
  );

  const safeFileOrderId = String(orderId).replace(/[^a-zA-Z0-9-_]/g, "");
  doc.save(`Octopus_Invoice_${safeFileOrderId || "Order"}.pdf`);
}

