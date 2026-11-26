import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const firebaseConfig = {
  apiKey: "AIzaSyCDrhkAdOlVtMc4j2AsJgOR-7dZ-qyy9b8",
  authDomain: "octopusperfumes.firebaseapp.com",
  projectId: "octopusperfumes",
  storageBucket: "octopusperfumes.firebasestorage.app",
  messagingSenderId: "647675431879",
  appId: "1:647675431879:web:47c8069ab4aef10e9da7e2",
  measurementId: "G-ZP3CXGVJGX"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

function formatINR(val) {
  const num = Number(val);
  if (!Number.isFinite(num)) return "Rs. 0";
  return `Rs. ${Math.round(num).toLocaleString("en-IN")}`;
}

function formatDate(d) {
  if (!d) return "N/A";
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function formatDateShort(d) {
  if (!d) return "N/A";
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short"
  });
}

async function fetchPaidOrders() {
  const snap = await getDocs(collection(db, "orders"));
  const allOrders = new Map();
  snap.forEach(d => allOrders.set(d.id, { id: d.id, ...d.data() }));

  const now = new Date();
  const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

  const list = [];
  for (const [id, o] of allOrders.entries()) {
    let orderDate = null;
    if (o.paidAt?.toDate) orderDate = o.paidAt.toDate();
    else if (o.paidAt?.seconds) orderDate = new Date(o.paidAt.seconds * 1000);
    else if (o.paidAt) orderDate = new Date(o.paidAt);
    else if (o.createdAt?.toDate) orderDate = o.createdAt.toDate();
    else if (o.createdAt?.seconds) orderDate = new Date(o.createdAt.seconds * 1000);
    else if (o.createdAt) orderDate = new Date(o.createdAt);
    else if (o.orderId && o.orderId.startsWith("ORD-")) {
      const ts = parseInt(o.orderId.replace("ORD-", ""), 10);
      if (!isNaN(ts)) orderDate = new Date(ts);
    }

    const status = String(o.status || "").toLowerCase();
    const isPaid = status === "paid" || status === "success" || status === "captured" || Number(o.amountPaid) > 0;
    if (orderDate && orderDate >= fifteenDaysAgo && isPaid) {
      list.push({ ...o, orderDate });
    }
  }

  // Sort descending by date
  list.sort((a, b) => b.orderDate - a.orderDate);
  return list;
}

async function generatePDF(orders) {
  const { jsPDF } = await import("jspdf");
  const autoTableModule = await import("jspdf-autotable");
  const autoTable = autoTableModule.default || autoTableModule;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Separate real customer orders from internal admin test orders
  const customerOrders = orders.filter(o => {
    const isTest = (o.amountPaid === 1 && (o.shippingDetails?.address?.includes("sdad") || o.shippingDetails?.address?.includes("uyigh") || o.shippingDetails?.name?.toLowerCase() === "mayank"));
    return !isTest;
  });
  const testOrders = orders.filter(o => !customerOrders.includes(o));

  // --------------------------------------------------------------------------
  // PAGE 1: MASTER DISPATCH MANIFEST
  // --------------------------------------------------------------------------
  // Header Ribbon
  doc.setFillColor(20, 18, 16); // Obsidian
  doc.rect(0, 0, pageWidth, 36, "F");

  doc.setFillColor(154, 121, 83); // Champagne Bronze Line
  doc.rect(0, 36, pageWidth, 1.4, "F");

  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("OCTOPUS LUXURY PERFUMES", margin, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 122);
  doc.text("SHIPPING & DISPATCH MANIFEST — LAST 15 DAYS", margin, 23);
  doc.setTextColor(190, 185, 178);
  doc.text("octopusperfume.in  |  orders@octopusperfume.in  |  Batch-Verified Fragrances", margin, 29);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("DISPATCH MANIFEST", pageWidth - margin, 16, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 122);
  doc.text(`Generated: ${formatDate(new Date())}`, pageWidth - margin, 23, { align: "right" });
  doc.setTextColor(190, 185, 178);
  doc.text(`Period: Past 15 Days (Live Sync)`, pageWidth - margin, 29, { align: "right" });

  // Metric KPI Cards
  const totalPaidRevenue = customerOrders.reduce((sum, o) => sum + Number(o.amountPaid || o.total || 0), 0);
  const totalBottles = customerOrders.reduce((sum, o) => {
    return sum + (o.items || []).filter(i => !i.isFree).reduce((s, it) => s + (it.quantity || 1), 0);
  }, 0);
  const totalFreeGifts = customerOrders.length;

  const cardY = 43;
  const cardH = 20;
  const cardW = (pageWidth - margin * 2 - 9) / 4;

  const kpis = [
    { title: "CUSTOMER ORDERS", value: `${customerOrders.length} Shipments`, sub: "Ready to Dispatch" },
    { title: "TOTAL VALUE", value: formatINR(totalPaidRevenue), sub: "100% Prepaid" },
    { title: "MAIN PERFUMES", value: `${totalBottles} Bottles`, sub: "Fragrance Units" },
    { title: "DISCOVERY GIFTS", value: `${totalFreeGifts} Testers`, sub: "Free 7ML Paradox" }
  ];

  kpis.forEach((k, idx) => {
    const x = margin + idx * (cardW + 3);
    doc.setFillColor(247, 246, 243);
    doc.setDrawColor(232, 230, 225);
    doc.roundedRect(x, cardY, cardW, cardH, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(154, 121, 83);
    doc.text(k.title, x + 3.5, cardY + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 18, 16);
    doc.text(k.value, x + 3.5, cardY + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(119, 119, 119);
    doc.text(k.sub, x + 3.5, cardY + 16.5);
  });

  // Master Manifest Table
  const manifestRows = customerOrders.map((o, idx) => {
    const ship = o.shippingDetails || {};
    const itemsSummary = (o.items || [])
      .map(it => `${it.quantity || 1}x ${it.title} ${it.isFree ? "(Gift)" : ""}`)
      .join("\n");
    return [
      String(idx + 1),
      o.orderId || o.id,
      formatDateShort(o.orderDate),
      `${ship.name || "N/A"}\nPh: ${ship.phone || "N/A"}`,
      `${ship.city || ""}, ${ship.state || ""}\nPIN: ${ship.zip || "N/A"}`,
      itemsSummary,
      `${formatINR(o.amountPaid || o.total || 0)}\n(${o.paymentMode || "UPI"})`,
      "[  ] Ready"
    ];
  });

  autoTable(doc, {
    startY: 68,
    margin: { left: margin, right: margin },
    head: [["#", "ORDER ID", "DATE", "CUSTOMER", "DESTINATION", "ITEMS & FREE GIFTS", "AMOUNT", "CHECK"]],
    body: manifestRows,
    theme: "plain",
    headStyles: {
      fillColor: [20, 18, 16],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
      cellPadding: { top: 3.5, right: 3, bottom: 3.5, left: 3 },
    },
    bodyStyles: {
      textColor: [36, 36, 36],
      fontSize: 7.5,
      cellPadding: { top: 3.5, right: 3, bottom: 3.5, left: 3 },
      lineColor: [232, 230, 225],
      lineWidth: { bottom: 0.25 },
    },
    columnStyles: {
      0: { cellWidth: 7, halign: "center" },
      1: { cellWidth: 27, fontStyle: "bold" },
      2: { cellWidth: 14, halign: "center" },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 42 },
      6: { cellWidth: 18, halign: "right", fontStyle: "bold" },
      7: { cellWidth: 14, halign: "center" }
    }
  });

  // If there are internal admin test orders, show a note/small section
  if (testOrders.length > 0) {
    const finalY = doc.lastAutoTable.finalY + 6;
    if (finalY < pageHeight - 30) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Note: ${testOrders.length} internal admin Re. 1 gateway test orders detected in database (ORD-${testOrders.map(t => t.orderId?.slice(-6)).join(", ")}) and excluded from commercial customer manifest above.`,
        margin,
        finalY
      );
    }
  }

  // Footer on Manifest Page
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(`Octopus Perfumes Shipping Operations  •  Page 1 of ${customerOrders.length + 1}`, pageWidth / 2, pageHeight - 7, { align: "center" });

  // --------------------------------------------------------------------------
  // PAGES 2+: INDIVIDUAL PACKING SLIPS & SHIPPING LABELS (1 PER PAGE)
  // --------------------------------------------------------------------------
  customerOrders.forEach((order, index) => {
    doc.addPage();

    const ship = order.shippingDetails || {};
    const items = order.items || [];
    const dateFormatted = formatDate(order.orderDate);

    // Header Band
    doc.setFillColor(20, 18, 16);
    doc.rect(0, 0, pageWidth, 32, "F");

    doc.setFillColor(154, 121, 83);
    doc.rect(0, 32, pageWidth, 1.2, "F");

    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("OCTOPUS LUXURY PERFUMES", margin, 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(212, 175, 122);
    doc.text("DISPATCH PACKING SLIP & SHIPPING MANIFEST", margin, 21);
    doc.setTextColor(190, 185, 178);
    doc.text("100% Original Sealed Fragrances  |  Carefully Hand-Packed", margin, 26);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text("PAID SHIPMENT", pageWidth - margin, 14, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(212, 175, 122);
    doc.text(`#${order.orderId || order.id}`, pageWidth - margin, 21, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(190, 185, 178);
    doc.text(`Paid: ${dateFormatted}`, pageWidth - margin, 26, { align: "right" });

    // Shipment Overview Row
    const overviewY = 38;
    const halfWidth = (pageWidth - margin * 2 - 6) / 2;

    // LEFT CARD: SHIP TO ADDRESS (LARGE & HIGH READABILITY)
    doc.setFillColor(247, 246, 243);
    doc.setDrawColor(154, 121, 83);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, overviewY, halfWidth, 54, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(154, 121, 83);
    doc.text("DELIVER TO (SHIPMENT DESTINATION)", margin + 4, overviewY + 6.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.setTextColor(20, 18, 16);
    doc.text(ship.name || "Customer", margin + 4, overviewY + 13.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(52, 122, 84);
    doc.text(`Mobile: ${ship.phone || "N/A"}`, margin + 4, overviewY + 19);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(92, 89, 84);
    doc.text(`Email: ${ship.email || "N/A"}`, margin + 4, overviewY + 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(36, 36, 36);
    const splitAddress = doc.splitTextToSize(ship.address || "No address provided", halfWidth - 8);
    doc.text(splitAddress, margin + 4, overviewY + 30);

    const pinY = overviewY + 30 + (splitAddress.length * 4.2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(20, 18, 16);
    doc.text(`${ship.city || ""}, ${ship.state || ""} - PIN: ${ship.zip || ""}`, margin + 4, Math.min(pinY, overviewY + 47));
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(119, 119, 119);
    doc.text(`Country: ${ship.country || "India"}`, margin + 4, Math.min(pinY + 4.5, overviewY + 51.5));

    // RIGHT CARD: ORDER & PAYMENT SPECS
    const rightX = margin + halfWidth + 6;
    doc.setFillColor(247, 246, 243);
    doc.setDrawColor(232, 230, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(rightX, overviewY, halfWidth, 54, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(154, 121, 83);
    doc.text("PAYMENT & COURIER SPECIFICATIONS", rightX + 4, overviewY + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(92, 89, 84);
    doc.text("Order Status:", rightX + 4, overviewY + 14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 122, 84);
    doc.text("CONFIRMED & PAID", rightX + 32, overviewY + 14);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(92, 89, 84);
    doc.text("Total Paid:", rightX + 4, overviewY + 20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 18, 16);
    doc.text(formatINR(order.amountPaid || order.total || 0), rightX + 32, overviewY + 20);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(92, 89, 84);
    doc.text("Payment Mode:", rightX + 4, overviewY + 26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 18, 16);
    doc.text(`${order.paymentMode || "UPI"} via PayU`, rightX + 32, overviewY + 26);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(92, 89, 84);
    doc.text("PayU Ref ID:", rightX + 4, overviewY + 32);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(36, 36, 36);
    doc.text(String(order.mihpayid || order.payuTxnId || "Verified"), rightX + 32, overviewY + 32);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(92, 89, 84);
    doc.text("Shipping Tier:", rightX + 4, overviewY + 38);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(36, 36, 36);
    doc.text("Free Express Air (Insured)", rightX + 32, overviewY + 38);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(92, 89, 84);
    doc.text("Bank Ref No:", rightX + 4, overviewY + 44);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(36, 36, 36);
    doc.text(String(order.bankRefNum || "N/A"), rightX + 32, overviewY + 44);

    // Items Checklist Table
    const itemsTableY = overviewY + 60;
    const itemRows = items.map((it, iIdx) => {
      const isFree = Boolean(it.isFree || it.price === 0);
      return [
        String(iIdx + 1),
        it.title || "Fragrance Bottle",
        it.variantTitle || "Standard Edition",
        String(it.quantity || 1),
        isFree ? "COMPLIMENTARY GIFT" : formatINR(it.price),
        isFree ? "FREE" : formatINR((it.price || 0) * (it.quantity || 1)),
        "[   ] OK"
      ];
    });

    autoTable(doc, {
      startY: itemsTableY,
      margin: { left: margin, right: margin },
      head: [["#", "ITEM DESCRIPTION / FRAGRANCE", "EDITION / SIZE", "QTY", "RATE", "TOTAL", "PACKED"]],
      body: itemRows,
      theme: "plain",
      headStyles: {
        fillColor: [20, 18, 16],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
        cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
      },
      bodyStyles: {
        textColor: [36, 36, 36],
        fontSize: 8.5,
        cellPadding: { top: 4.5, right: 3, bottom: 4.5, left: 3 },
        lineColor: [232, 230, 225],
        lineWidth: { bottom: 0.3 },
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" },
        1: { cellWidth: "auto", fontStyle: "bold" },
        2: { cellWidth: 42 },
        3: { cellWidth: 14, halign: "center", fontStyle: "bold" },
        4: { cellWidth: 30, halign: "right" },
        5: { cellWidth: 26, halign: "right", fontStyle: "bold" },
        6: { cellWidth: 18, halign: "center" }
      }
    });

    const slipTableEndY = doc.lastAutoTable.finalY + 8;

    // Dispatch & Handling Box
    doc.setFillColor(255, 251, 242);
    doc.setDrawColor(238, 215, 161);
    doc.roundedRect(margin, slipTableEndY, pageWidth - margin * 2, 24, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(128, 85, 0);
    doc.text("WAREHOUSE PACKING INSTRUCTIONS & SPECIAL CARE:", margin + 4, slipTableEndY + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(96, 64, 0);
    doc.text("• FRAGILE GLASS CARGO: Wrap each bottle in high-density protective honeycomb paper / double bubble casing.", margin + 4, slipTableEndY + 12);
    doc.text("• DISCOVERY BONUS: Ensure the complimentary 7ML Paradox EDP miniature tester is placed securely inside the box.", margin + 4, slipTableEndY + 17);
    doc.text("• SEALING: Apply tamper-evident Octopus Perfumes security tape over all box flaps before dispatch handoff.", margin + 4, slipTableEndY + 22);

    // Sign-off / Verification Card
    const signOffY = slipTableEndY + 30;
    doc.setDrawColor(212, 207, 199);
    doc.setLineWidth(0.4);
    doc.line(margin, signOffY, pageWidth - margin, signOffY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(92, 89, 84);
    doc.text("Packed By (Name / Signature): ____________________", margin, signOffY + 8);
    doc.text("Inspected & Weighed By: ____________________", margin + 70, signOffY + 8);
    doc.text("AWB Tracking Number: ____________________", pageWidth - margin - 60, signOffY + 8);

    // Page footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Octopus Perfumes  •  Order #${order.orderId || order.id}  •  Page ${index + 2} of ${customerOrders.length + 1}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: "center" }
    );
  });

  return doc;
}

async function main() {
  console.log("🔍 Fetching paid orders from Firestore...");
  const orders = await fetchPaidOrders();
  console.log(`✅ Retrieved ${orders.length} paid orders from the last 15 days.`);

  console.log("📄 Generating professional PDF Manifest & Packing Slips...");
  const doc = await generatePDF(orders);

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  // 1. Save in public directory of the app
  const publicPdfPath = path.join(rootDir, "public", "Octopus_Perfumes_Shipping_Manifest_Last_15_Days.pdf");
  fs.writeFileSync(publicPdfPath, pdfBuffer);
  console.log(`💾 Saved public PDF: ${publicPdfPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);

  // 2. Save in Brain Artifacts directory
  const brainDir = "/Users/mayank/.gemini/antigravity/brain/1a445ec3-73ea-4ad0-a66b-6273694fbc37";
  if (fs.existsSync(brainDir)) {
    const brainPdfPath = path.join(brainDir, "Octopus_Perfumes_Shipping_Manifest_Last_15_Days.pdf");
    fs.writeFileSync(brainPdfPath, pdfBuffer);
    console.log(`💾 Saved artifact PDF: ${brainPdfPath}`);
  }

  // 3. Save a JSON report alongside for programmatic access
  const jsonPath = path.join(rootDir, "public", "paid_orders_last_15_days.json");
  fs.writeFileSync(jsonPath, JSON.stringify(orders, null, 2));
  console.log(`💾 Saved JSON summary: ${jsonPath}`);

  console.log("\n🎉 PDF generation completed successfully!");
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Error generating PDF:", err);
  process.exit(1);
});
