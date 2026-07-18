import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const txnid = formData.get("txnid")?.toString();
    const status = formData.get("status")?.toString();

    const baseUrl = req.headers.get("origin") || req.url;
    const url = new URL("/checkout/success", baseUrl);
    
    if (txnid) {
      url.searchParams.set("order_id", txnid);
    }
    if (status) {
      url.searchParams.set("status", status);
    }

    return NextResponse.redirect(url, 302);
  } catch (error) {
    console.error("Error in PayU redirect:", error);
    const baseUrl = req.headers.get("origin") || req.url;
    return NextResponse.redirect(new URL("/checkout", baseUrl), 302);
  }
}
