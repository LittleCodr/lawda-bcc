import csv
import os

# Exact 48 column headers from Shiprocket's template
HEADERS = [
    "*Order Id",
    "*Channel",
    "*Payment Method(COD/Prepaid)",
    "*Customer First Name",
    "Customer Last Name",
    "Email (Optional)",
    "*Customer Mobile",
    "Customer Alternate Mobile",
    "*Shipping Address Line 1",
    "Shipping Address Line 2",
    "*Shipping Address Country",
    "*Shipping Address State",
    "*Shipping Address City",
    "*Shipping Address Postcode",
    "Billing Address Line 1",
    "Billing Address Line 2",
    "Billing Address Country",
    "Billing Address State",
    "Billing Address City",
    "Billing Address Postcode",
    "*Master SKU",
    "*Product Name",
    "*Product Quantity",
    "Tax %",
    "*Selling Price(Per Unit Item, Inclusive of Tax)",
    "Discount(Per Unit Item)",
    "Shipping Charges(Per Order)",
    "COD Charges(Per Order)",
    "Gift Wrap Charges(Per Order)",
    "Total Discount (Per Order)",
    "Partial COD (Yes/No)",
    "Paid Amount (Rs.)",
    "*Length (cm)",
    "*Breadth (cm)",
    "*Height (cm)",
    "*Weight Of Shipment(kg)",
    "Send Notification(True/False)",
    "Comment",
    "HSN Code",
    "Location Id",
    "Reseller Name",
    "Company Name",
    "latitude",
    "longitude",
    "Verified Order",
    "Is documents",
    "order_type",
    "Order tag"
]

ORDERS = [
    {
        "order_id": "ORD-1794674278670",
        "first_name": "Manmeet",
        "last_name": "Kalia",
        "email": "manmeet.kalia@yahoo.com",
        "mobile": "9876693551",
        "addr1": "House No 3262, Sector 49 D",
        "addr2": "Customs and Excise Officers Society",
        "city": "Chandigarh",
        "state": "Chandigarh",
        "postcode": "160047",
        "paid_amount": 13400,
        "items": [
            {
                "sku": "MONTALE-BLK-AOUD-100ML",
                "name": "Montale Black Aoud EDP (100ml) + Free 7ML Paradox Tester",
                "qty": 1,
                "price": 13400
            }
        ]
    },
    {
        "order_id": "ORD-1794670371488",
        "first_name": "Jaya",
        "last_name": "Sankar",
        "email": "jayasankar1194@gmail.com",
        "mobile": "8637413498",
        "addr1": "Plot No 1, Raju Nivaz",
        "addr2": "Muthamil Nagar, Chinnalapatty",
        "city": "Dindigul",
        "state": "Tamil Nadu",
        "postcode": "624301",
        "paid_amount": 2750,
        "items": [
            {
                "sku": "LATTAFA-MAAHIR-LEGACY-100ML",
                "name": "Lattafa Maahir Legacy EDP for Men (100ml) + Free 7ML Paradox Tester",
                "qty": 1,
                "price": 2750
            }
        ]
    },
    {
        "order_id": "ORD-1794664978047",
        "first_name": "Chandan",
        "last_name": "Kumar",
        "email": "starseve1@gmail.com",
        "mobile": "7060211195",
        "addr1": "21 A, 2nd Floor, Rajpal House",
        "addr2": "Mian Wali Colony",
        "city": "Gurgaon",
        "state": "Haryana",
        "postcode": "122001",
        "paid_amount": 3000,
        "items": [
            {
                "sku": "RASASI-HAWAS-BLACK-100ML",
                "name": "Rasasi Hawas Black EDP for Men (100ml) + Free 7ML Paradox Tester",
                "qty": 1,
                "price": 3000
            }
        ]
    },
    {
        "order_id": "ORD-1794661036502",
        "first_name": "Mohsin",
        "last_name": "Sharif",
        "email": "mohsinsharif9@gmail.com",
        "mobile": "9839069190",
        "addr1": "Habib Lodge, 7/94 Tilak Nagar",
        "addr2": "Near Tilak Nagar Market",
        "city": "Kanpur Nagar",
        "state": "Uttar Pradesh",
        "postcode": "208002",
        "paid_amount": 2716,
        "items": [
            {
                "sku": "AHMED-AL-MAGHRIBI-BLU-OUD-100ML",
                "name": "Ahmed al Maghribi Blu Oud EDP (100ml) + Free 7ML Paradox Tester",
                "qty": 1,
                "price": 2417
            },
            {
                "sku": "NUSUK-ANA-AL-AWWAL-SILVER-10ML",
                "name": "Decant/Sample Nusuk Ana Al Awwal Silver EDP 10ml",
                "qty": 1,
                "price": 299
            }
        ]
    },
    {
        "order_id": "ORD-1794660599358",
        "first_name": "Mohsin",
        "last_name": "Sharif",
        "email": "mohsinsharif9@gmail.com",
        "mobile": "9839069190",
        "addr1": "Habib Lodge, 7/94 Tilak Nagar",
        "addr2": "Near Tilak Nagar Market",
        "city": "Kanpur Nagar",
        "state": "Uttar Pradesh",
        "postcode": "208002",
        "paid_amount": 6500,
        "items": [
            {
                "sku": "ASQ-THE-BLACK-PARFUM-100ML",
                "name": "Abdul Samad Al Qurashi The Black Parfum (100ml) + Free 7ML Paradox Tester",
                "qty": 1,
                "price": 6500
            }
        ]
    },
    {
        "order_id": "ORD-1794326687385",
        "first_name": "Aditya",
        "last_name": "Garg",
        "email": "adityagarg09@icloud.com",
        "mobile": "8700126407",
        "addr1": "Flat No 203, Shree Krishna Homes",
        "addr2": "Opp Thakral Nursing Homes, Shivaji Nagar",
        "city": "Gurgaon",
        "state": "Haryana",
        "postcode": "122001",
        "paid_amount": 1289,
        "items": [
            {
                "sku": "OCTOPUS-OVERLORD-EDP-50ML",
                "name": "Overlord 50ML EDP By Harsh Beniwal + Free 7ML Paradox Tester",
                "qty": 1,
                "price": 780
            },
            {
                "sku": "OCTOPUS-DARLING-EDP-50ML",
                "name": "Darling 50ML EDP By Harsh Beniwal",
                "qty": 1,
                "price": 509
            }
        ]
    },
    {
        "order_id": "ORD-1793902511615",
        "first_name": "Dheeraj",
        "last_name": "Barse",
        "email": "dheerajbarse10@gmail.com",
        "mobile": "7447556667",
        "addr1": "Shop No 1, Komal Complex, Day2Day Mart",
        "addr2": "Old Pune Mumbai Highway, Next to SBI Bank Nigdi",
        "city": "Pune",
        "state": "Maharashtra",
        "postcode": "411044",
        "paid_amount": 1425,
        "items": [
            {
                "sku": "OCTOPUS-SOMERSAULT-EDP-50ML",
                "name": "Somersault 50ML EDP By Harsh Beniwal + Free 7ML Paradox Tester",
                "qty": 1,
                "price": 1425
            }
        ]
    }
]

def generate_csv_rows():
    rows = [HEADERS]
    for order in ORDERS:
        for item in order["items"]:
            row = [
                order["order_id"],                  # 1: *Order Id
                "Custom",                            # 2: *Channel
                "Prepaid",                           # 3: *Payment Method(COD/Prepaid)
                order["first_name"],                 # 4: *Customer First Name
                order["last_name"],                  # 5: Customer Last Name
                order["email"],                      # 6: Email (Optional)
                order["mobile"],                     # 7: *Customer Mobile
                "",                                  # 8: Customer Alternate Mobile
                order["addr1"],                      # 9: *Shipping Address Line 1
                order["addr2"],                      # 10: Shipping Address Line 2
                "India",                             # 11: *Shipping Address Country
                order["state"],                      # 12: *Shipping Address State
                order["city"],                       # 13: *Shipping Address City
                order["postcode"],                   # 14: *Shipping Address Postcode
                order["addr1"],                      # 15: Billing Address Line 1
                order["addr2"],                      # 16: Billing Address Line 2
                "India",                             # 17: Billing Address Country
                order["state"],                      # 18: Billing Address State
                order["city"],                       # 19: Billing Address City
                order["postcode"],                   # 20: Billing Address Postcode
                item["sku"],                         # 21: *Master SKU
                item["name"],                        # 22: *Product Name (NOT EMPTY!)
                str(item["qty"]),                    # 23: *Product Quantity
                "",                                  # 24: Tax %
                str(item["price"]),                  # 25: *Selling Price(Per Unit Item, Inclusive of Tax)
                "",                                  # 26: Discount(Per Unit Item)
                "",                                  # 27: Shipping Charges(Per Order)
                "",                                  # 28: COD Charges(Per Order)
                "",                                  # 29: Gift Wrap Charges(Per Order)
                "",                                  # 30: Total Discount (Per Order)
                "No",                                # 31: Partial COD (Yes/No)
                str(order["paid_amount"]),           # 32: Paid Amount (Rs.)
                "5",                                 # 33: *Length (cm)
                "5",                                 # 34: *Breadth (cm)
                "2",                                 # 35: *Height (cm)
                "0.5",                               # 36: *Weight Of Shipment(kg)
                "",                                  # 37: Send Notification(True/False)
                "",                                  # 38: Comment
                "",                                  # 39: HSN Code
                "",                                  # 40: Location Id (LEFT BLANK - NO PICKUP ADDRESS REVEALED!)
                "",                                  # 41: Reseller Name
                "",                                  # 42: Company Name
                "",                                  # 43: latitude
                "",                                  # 44: longitude
                "",                                  # 45: Verified Order
                "",                                  # 46: Is documents
                "",                                  # 47: order_type
                ""                                   # 48: Order tag
            ]
            rows.append(row)
    return rows

def write_files():
    rows = generate_csv_rows()
    
    destinations = [
        os.path.expanduser("~/Downloads/Shiprocket_Bulk_Order_Import.csv"),
        "/Users/mayank/Developer/lawda-bcc/public/Shiprocket_Bulk_Order_Import.csv",
        "/Users/mayank/.gemini/antigravity/brain/1a445ec3-73ea-4ad0-a66b-6273694fbc37/Shiprocket_Bulk_Order_Import.csv"
    ]
    
    for dest in destinations:
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerows(rows)
        print(f"✅ Generated 48-column Shiprocket CSV at: {dest} ({len(rows)-1} item rows)")

if __name__ == "__main__":
    write_files()
