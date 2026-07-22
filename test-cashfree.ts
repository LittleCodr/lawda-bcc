import { Cashfree, CFEnvironment } from "cashfree-pg";

const cashfreeEnvironment = process.env.CASHFREE_ENVIRONMENT === "SANDBOX" ? CFEnvironment.SANDBOX : CFEnvironment.PRODUCTION; // Assuming sandbox for test
// Using dummy keys that will fail with 401 or similar, but let's see if there's a type error or something else
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
      order_id: "ORD-12345",
      customer_details: {
        customer_id: "CUST-123",
        customer_phone: "9999999999",
        customer_email: "test@example.com",
        customer_name: "Customer"
      }
    };
    const response = await cashfree.PGCreateOrder(request);
    console.log(response.data);
  } catch (error: any) {
    console.error("Error creating Cashfree order:", error?.response?.data || error);
  }
}

test();
