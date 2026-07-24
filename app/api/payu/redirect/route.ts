import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const txnid = formData.get("txnid")?.toString() || "";
    const status = formData.get("status")?.toString() || "";

    // Derive base URL
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "octopusperfume.in";
    const cleanHost = host.replace(/^www\./, "");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const origin = `${protocol}://${cleanHost}`;

    const url = new URL("/checkout/success", origin);
    if (txnid) url.searchParams.set("order_id", txnid);
    if (status) url.searchParams.set("status", status);

    return NextResponse.redirect(url, 302);
  } catch (error) {
    console.error("Error in PayU redirect:", error);
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "octopusperfume.in";
    const cleanHost = host.replace(/^www\./, "");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    return NextResponse.redirect(new URL("/checkout", `${protocol}://${cleanHost}`), 302);
  }
}
