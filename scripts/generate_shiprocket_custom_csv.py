import csv
import os

# Exact 20 column headers demanded by Shiprocket's bulk order import parser
HEADERS = [
    "Order Id",
    "Channel",
    "Payment Method(COD/Prepaid)",
    "Customer First Name",
    "Customer Last Name",
    "Customer Mobile",
    "Shipping Address Line 1",
    "Shipping Address Line 2",
    "Shipping Address Country",
    "Shipping Address State",
    "Shipping Address City",
    "Shipping Address Postcode",
    "Master SKU",
    "Product Quantity",
    "Selling Price(Per Unit Item, Inclusive of Tax)",
    "Partial COD (Yes/No)",
    "Length (cm)",
    "Breadth (cm)",
    "Height (cm)",
    "Weight Of Shipment(kg)"
]

# Orders to exclude as requested:
# ORD-1793910430800, ORD-1794397522626, ORD-1794650001083, ORD-1794555879899

REMAINING_ORDERS = [
    {
        "order_id": "ORD-1794674278670",
        "first_name": "Manmeet",
        "last_name": "Kalia",
        "mobile": "9876693551",
        "addr1": "House No 3262, Sector 49 D",
        "addr2": "Customs and Excise Officers Society",
        "city": "Chandigarh",
        "state": "Chandigarh",
        "postcode": "160047",
        "items": [
            {
                "sku": "MONTALE-BLK-AOUD-100ML",
                "qty": 1,
                "price": 13400
            }
        ]
    },
    {
        "order_id": "ORD-1794670371488",
        "first_name": "Jaya",
        "last_name": "Sankar",
        "mobile": "8637413498",
        "addr1": "Plot No 1, Raju Nivaz",
        "addr2": "Muthamil Nagar, Chinnalapatty",
        "city": "Dindigul",
        "state": "Tamil Nadu",
        "postcode": "624301",
        "items": [
            {
                "sku": "LATTAFA-MAAHIR-LEGACY-100ML",
                "qty": 1,
                "price": 2750
            }
        ]
    },
    {
        "order_id": "ORD-1794664978047",
        "first_name": "Chandan",
        "last_name": "Kumar",
        "mobile": "7060211195",
        "addr1": "21 A, 2nd Floor, Rajpal House",
        "addr2": "Mian Wali Colony",
        "city": "Gurgaon",
        "state": "Haryana",
        "postcode": "122001",
        "items": [
            {
                "sku": "RASASI-HAWAS-BLACK-100ML",
                "qty": 1,
                "price": 3000
            }
        ]
    },
    {
        "order_id": "ORD-1794661036502",
        "first_name": "Mohsin",
        "last_name": "Sharif",
        "mobile": "9839069190",
        "addr1": "Habib Lodge, 7/94 Tilak Nagar",
        "addr2": "Near Tilak Nagar Market",
        "city": "Kanpur Nagar",
        "state": "Uttar Pradesh",
        "postcode": "208002",
        "items": [
            {
                "sku": "AHMED-AL-MAGHRIBI-BLU-OUD-100ML",
                "qty": 1,
                "price": 2417
            },
            {
                "sku": "NUSUK-ANA-AL-AWWAL-SILVER-10ML",
                "qty": 1,
                "price": 299
            }
        ]
    },
    {
        "order_id": "ORD-1794660599358",
        "first_name": "Mohsin",
        "last_name": "Sharif",
        "mobile": "9839069190",
        "addr1": "Habib Lodge, 7/94 Tilak Nagar",
        "addr2": "Near Tilak Nagar Market",
        "city": "Kanpur Nagar",
        "state": "Uttar Pradesh",
        "postcode": "208002",
        "items": [
            {
                "sku": "ASQ-THE-BLACK-PARFUM-100ML",
                "qty": 1,
                "price": 6500
            }
        ]
    },
    {
        "order_id": "ORD-1794326687385",
        "first_name": "Aditya",
        "last_name": "Garg",
        "mobile": "8700126407",
        "addr1": "Flat No 203, Shree Krishna Homes",
        "addr2": "Opp Thakral Nursing Homes, Shivaji Nagar",
        "city": "Gurgaon",
        "state": "Haryana",
        "postcode": "122001",
        "items": [
            {
                "sku": "OCTOPUS-OVERLORD-EDP-50ML",
                "qty": 1,
                "price": 780
            },
            {
                "sku": "OCTOPUS-DARLING-EDP-50ML",
                "qty": 1,
                "price": 509
            }
        ]
    },
    {
        "order_id": "ORD-1793902511615",
        "first_name": "Dheeraj",
        "last_name": "Barse",
        "mobile": "7447556667",
        "addr1": "Shop No 1, Komal Complex, Day2Day Mart",
        "addr2": "Old Pune Mumbai Highway, Next to SBI Bank Nigdi",
        "city": "Pune",
        "state": "Maharashtra",
        "postcode": "411044",
        "items": [
            {
                "sku": "OCTOPUS-SOMERSAULT-EDP-50ML",
                "qty": 1,
                "price": 1425
            }
        ]
    }
]

def generate_csv_rows():
    rows = [HEADERS]
    for order in REMAINING_ORDERS:
        for item in order["items"]:
            row = [
                order["order_id"],          # Order Id
                "Custom",                    # Channel
                "Prepaid",                   # Payment Method(COD/Prepaid)
                order["first_name"],         # Customer First Name
                order["last_name"],          # Customer Last Name
                order["mobile"],             # Customer Mobile
                order["addr1"],              # Shipping Address Line 1
                order["addr2"],              # Shipping Address Line 2
                "India",                     # Shipping Address Country
                order["state"],              # Shipping Address State
                order["city"],               # Shipping Address City
                order["postcode"],           # Shipping Address Postcode
                item["sku"],                 # Master SKU
                str(item["qty"]),            # Product Quantity
                str(item["price"]),          # Selling Price(Per Unit Item, Inclusive of Tax)
                "No",                        # Partial COD (Yes/No)
                "5",                         # Length (cm) - shortest requested
                "5",                         # Breadth (cm) - shortest requested
                "2",                         # Height (cm) - shortest requested
                "0.5"                        # Weight Of Shipment(kg) - 500g requested
            ]
            rows.append(row)
    return rows

def write_files():
    rows = generate_csv_rows()
    
    destinations = [
        "/Users/mayank/Developer/lawda-bcc/public/Shiprocket_Bulk_Order_Import.csv",
        "/Users/mayank/.gemini/antigravity/brain/1a445ec3-73ea-4ad0-a66b-6273694fbc37/Shiprocket_Bulk_Order_Import.csv",
        os.path.expanduser("~/Downloads/Shiprocket_Bulk_Order_Import.csv")
    ]
    
    for dest in destinations:
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerows(rows)
        print(f"✅ Generated Shiprocket CSV at: {dest} ({len(rows)-1} rows)")

if __name__ == "__main__":
    write_files()
