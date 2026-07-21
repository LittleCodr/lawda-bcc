import { Cashfree, CFEnvironment } from "cashfree-pg";

async function test() {
  try {
    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION,
      "1043957eedb784faed3eae463710505857410",
      "cfsk_ma_prod_1909a390b7e5436186c65050378523326_2baedce9"
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
        return_url: `https://octopusperfume.in/checkout/success?order_id=test`,
      },
      order_note: "Order from Octopus Perfume"
    };

    console.log("Sending request", request);
    const response = await cashfree.PGCreateOrder(request);
    console.log("Success", response.data);
  } catch (error) {
    console.error("Error", error.response?.data || error.message);
  }
}

test();
