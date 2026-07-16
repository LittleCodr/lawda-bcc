import { Cashfree, CFEnvironment } from "cashfree-pg";

async function test() {
  try {
    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION,
      "1258252b1855e020341c7bc75ce2528521",
      "cfsk_ma_prod_0e14949ce7f312f36fa373401c3dbcf6_e07b63a7"
    );

    const request = {
      order_amount: 1,
      order_currency: "INR",
      order_id: `ORD-${Date.now()}`,
      customer_details: {
        customer_id: `CUST-${Date.now()}`,
        customer_phone: "89726787129", // 11 digits
        customer_email: "test@example.com",
        customer_name: "Customer"
      },
      order_meta: {
        return_url: `https://buyoctopusperfume.in/checkout/success?order_id=test`,
      },
      order_note: "Order from Octopus Perfumes"
    };

    console.log("Sending request", request);
    const response = await cashfree.PGCreateOrder(request);
    console.log("Success", response.data);
  } catch (error) {
    console.error("Error", error.response?.data || error.message);
  }
}

test();
