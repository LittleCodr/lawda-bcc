import { Cashfree, CFEnvironment } from "cashfree-pg";
import dotenv from "dotenv";
dotenv.config();

const cashfreeEnvironment = process.env.CASHFREE_ENVIRONMENT === "SANDBOX" ? CFEnvironment.SANDBOX : CFEnvironment.PRODUCTION;
const cashfree = new Cashfree(
  cashfreeEnvironment,
  process.env.NEXT_PUBLIC_CASHFREE_APP_ID as string,
  process.env.CASHFREE_SECRET_KEY as string
);

async function test() {
  try {
    const request = {
      order_amount: 100,
      order_currency: "INR",
      order_id: `ORD-12345-${Date.now()}`,
      customer_details: {
        customer_id: "CUST-123",
        customer_phone: "9999999999",
        customer_email: "test@example.com",
        customer_name: "Customer"
      }
    };
    const response = await cashfree.PGCreateOrder(request as any);
    console.log(response.data);
  } catch (error: any) {
    console.error("Error details:", JSON.stringify(error?.response?.data, null, 2) || error.message);
  }
}
test();
