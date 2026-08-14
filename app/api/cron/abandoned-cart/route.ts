import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collectionGroup, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { sendAbandonedCartReminder } from "@/lib/brevo";

export async function GET(req: Request) {
  try {
    // 1. Verify Vercel Cron Secret (Security)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 2. Calculate time bounds (Orders between 1 hour and 2 hours old)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // 3. Query Firestore
    // Note: This requires a Collection Group Index on 'orders' in Firestore
    // Fields: status ASC, abandonedEmailSent ASC, createdAt ASC
    const ordersQuery = query(
      collectionGroup(db, "orders"),
      where("status", "in", ["pending_payment", "pending_cod_advance"]),
      where("abandonedEmailSent", "==", false),
      where("createdAt", "<=", oneHourAgo),
      where("createdAt", ">=", twoHoursAgo)
    );

    const snapshot = await getDocs(ordersQuery);
    
    if (snapshot.empty) {
      return NextResponse.json({ success: true, message: "No abandoned carts found", processed: 0 });
    }

    const processedIds: string[] = [];
    const errors: any[] = [];

    // 4. Send emails and update documents
    for (const orderDoc of snapshot.docs) {
      const orderData = orderDoc.data();
      
      // Safety check: ensure email exists
      const email = orderData.email || orderData.shippingDetails?.email;
      if (!email) continue;

      try {
        const result = await sendAbandonedCartReminder(orderData);
        
        if (result.success) {
          // Mark as sent in Firestore so we don't spam them
          await updateDoc(orderDoc.ref, {
            abandonedEmailSent: true,
            abandonedEmailSentAt: new Date(),
          });
          processedIds.push(orderData.orderId || orderDoc.id);
        } else {
          errors.push({ id: orderDoc.id, error: result.error });
        }
      } catch (err: any) {
        errors.push({ id: orderDoc.id, error: err.message });
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: processedIds.length, 
      processedIds,
      errors: errors.length > 0 ? errors : undefined 
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
