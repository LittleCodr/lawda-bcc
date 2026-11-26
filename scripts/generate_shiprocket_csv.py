import csv
import os

# Shiprocket Pickup Address Id from the user's template
PICKUP_ADDRESS_ID = "9236660"

# Header Row 1: Group Headers
GROUP_HEADER = [
    "", "Pickup Details", "Buyer's Details", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "Order Details", "", "", "", "", "", "", "Package Details", "", "", "", "Courier Details"
]

# Header Row 2: Mandatory & Optional Field Names exactly matching Shiprocket Template
FIELD_HEADER = [
    "*Order Id",
    "Pickup Address Id (Optional)",
    "*Buyer's Mobile No.",
    "*Buyer's First Name",
    "Buyer's Last Name (Optional)",
    "Email (Optional)",
    "*Shipping Complete Address",
    "Shipping Address Landmark (Optional)",
    "*Shipping Address Pincode",
    "*Shipping Address City",
    "*Shipping Address State",
    "*Shipping Address Country",
    "Billing Complete Address (Optional)",
    "Billing Landmark (Optional)",
    "Billing Pincode (Optional)",
    "Billing City (Optional)",
    "Billing State (Optional)",
    "Billing Country (Optional)",
    "*Product Name",
    "*Per Unit Price in INR (Inclusive of Tax)",
    "*Product Quantity",
    "*Master SKU",
    "*Payment Method (COD/Prepaid)",
    "*Partial COD (Yes/No)",
    "Paid Amount (Rs.)",
    "*Weight Of Shipment (kg)",
    "*Length (cm)",
    "*Breadth (cm)",
    "*Height (cm)",
    "Courier ID (Optional)"
]

# All 11 Paid Customer Orders from the last 15 days
ORDERS = [
    {
        "order_id": "ORD-1794674278670",
        "phone": "9876693551",
        "first_name": "Manmeet",
        "last_name": "Kalia",
        "email": "manmeet.kalia@yahoo.com",
        "address": "House No 3262, Sector 49 D, Customs and Excise Officers House Building Society",
        "landmark": "Sector 49 D",
        "pincode": "160047",
        "city": "Chandigarh",
        "state": "Chandigarh",
        "paid_amount": 13400,
        "weight": 0.8,
        "items": [
            {
                "name": "Montale Black Aoud EDP (100ml) + Free 7ML Paradox Tester",
                "price": 13400,
                "qty": 1,
                "sku": "MNTL-BLK-100"
            }
        ]
    },
    {
        "order_id": "ORD-1794670371488",
        "phone": "8637413498",
        "first_name": "Jaya",
        "last_name": "Sankar",
        "email": "jayasankar1194@gmail.com",
        "address": "Plot No 1, Raju Nivaz, Muthamil Nagar, Chinnalapatty",
        "landmark": "Muthamil Nagar",
        "pincode": "624301",
        "city": "Dindigul",
        "state": "Tamil Nadu",
        "paid_amount": 2750,
        "weight": 0.5,
        "items": [
            {
                "name": "Lattafa Maahir Legacy EDP for Men (100ml) + Free 7ML Paradox Tester",
                "price": 2750,
                "qty": 1,
                "sku": "LTF-MHR-100"
            }
        ]
    },
    {
        "order_id": "ORD-1794664978047",
        "phone": "7060211195",
        "first_name": "Chandan",
        "last_name": "Kumar",
        "email": "starseve1@gmail.com",
        "address": "21 A, 2nd Floor, Rajpal House, Mian Wali Colony",
        "landmark": "Mian Wali Colony",
        "pincode": "122001",
        "city": "Gurgaon",
        "state": "Haryana",
        "paid_amount": 3000,
        "weight": 0.5,
        "items": [
            {
                "name": "Rasasi Hawas Black EDP for Men (100ml) + Free 7ML Paradox Tester",
                "price": 3000,
                "qty": 1,
                "sku": "RSS-HWS-BLK-100"
            }
        ]
    },
    {
        "order_id": "ORD-1794661036502",
        "phone": "9839069190",
        "first_name": "Mohsin",
        "last_name": "Sharif",
        "email": "mohsinsharif9@gmail.com",
        "address": "Habib Lodge, 7/94 Tilak Nagar",
        "landmark": "Tilak Nagar",
        "pincode": "208002",
        "city": "Kanpur Nagar",
        "state": "Uttar Pradesh",
        "paid_amount": 2716,
        "weight": 0.6,
        "items": [
            {
                "name": "Ahmed al Maghribi Blu Oud EDP (100ml) + Free 7ML Paradox Tester",
                "price": 2417,
                "qty": 1,
                "sku": "AHM-BLU-100"
            },
            {
                "name": "Decant/Sample Nusuk Ana Al Awwal Silver EDP 10ml",
                "price": 299,
                "qty": 1,
                "sku": "NSK-SLV-10"
            }
        ]
    },
    {
        "order_id": "ORD-1794660599358",
        "phone": "9839069190",
        "first_name": "Mohsin",
        "last_name": "Sharif",
        "email": "mohsinsharif9@gmail.com",
        "address": "Habib Lodge, 7/94 Tilak Nagar",
        "landmark": "Tilak Nagar",
        "pincode": "208002",
        "city": "Kanpur Nagar",
        "state": "Uttar Pradesh",
        "paid_amount": 6500,
        "weight": 0.8,
        "items": [
            {
                "name": "Abdul Samad Al Qurashi The Black Parfum (100ml) + Free 7ML Paradox Tester",
                "price": 6500,
                "qty": 1,
                "sku": "ASQ-BLK-100"
            }
        ]
    },
    {
        "order_id": "ORD-1794650001083",
        "phone": "7041102755",
        "first_name": "Dhaval",
        "last_name": "Parekh",
        "email": "dhavalparekh02765@gmail.com",
        "address": "Shop F 32 33 34, Jenus Salon, Radhanpur Road, Opp Nilkanth Restaurant",
        "landmark": "Opposite Nilkanth Restaurant",
        "pincode": "384002",
        "city": "Mahesana",
        "state": "Gujarat",
        "paid_amount": 399,
        "weight": 0.3,
        "items": [
            {
                "name": "Decant/Sample Lattafa Ana Abiyedh Coral EDP 10ml + Free 7ML Paradox Tester",
                "price": 399,
                "qty": 1,
                "sku": "LTF-ANA-10"
            }
        ]
    },
    {
        "order_id": "ORD-1794555879899",
        "phone": "9739628452",
        "first_name": "Veena",
        "last_name": "D",
        "email": "veenadharsha@gmail.com",
        "address": "No 74, 2nd Main, Wilson Garden Society Layout, JP Nagar 7th Phase",
        "landmark": "JP Nagar 7th Phase",
        "pincode": "560078",
        "city": "Bangalore",
        "state": "Karnataka",
        "paid_amount": 699,
        "weight": 0.3,
        "items": [
            {
                "name": "Parfums De Marly Delina Exclusif EDP Vial 1.5ml + Free 7ML Paradox Tester",
                "price": 699,
                "qty": 1,
                "sku": "PDM-DLN-1.5"
            }
        ]
    },
    {
        "order_id": "ORD-1794397522626",
        "phone": "9902352902",
        "first_name": "Aryan",
        "last_name": "Tiwari",
        "email": "tiwariaryan2004@gmail.com",
        "address": "Campus Block 1, SDM College of Medical Sciences and Hospital, Manjushree Nagar, Sattur",
        "landmark": "Manjushree Nagar, Sattur",
        "pincode": "580003",
        "city": "Dharwad",
        "state": "Karnataka",
        "paid_amount": 375,
        "weight": 0.3,
        "items": [
            {
                "name": "Swiss Arabian City Sampling Set 3 x 1ml + Free 7ML Paradox Tester",
                "price": 375,
                "qty": 1,
                "sku": "SWS-CTY-3X1"
            }
        ]
    },
    {
        "order_id": "ORD-1794326687385",
        "phone": "8700126407",
        "first_name": "Aditya",
        "last_name": "Garg",
        "email": "adityagarg09@icloud.com",
        "address": "Flat No 203, Shree Krishna Homes, Shivaji Nagar",
        "landmark": "Opp Thakral Nursing Homes",
        "pincode": "122001",
        "city": "Gurgaon",
        "state": "Haryana",
        "paid_amount": 1289,
        "weight": 0.6,
        "items": [
            {
                "name": "Overlord 50ML EDP By Harsh Beniwal + Free 7ML Paradox Tester",
                "price": 780,
                "qty": 1,
                "sku": "OCT-OVL-50"
            },
            {
                "name": "Darling 50ML EDP By Harsh Beniwal",
                "price": 509,
                "qty": 1,
                "sku": "OCT-DRL-50"
            }
        ]
    },
    {
        "order_id": "ORD-1793910430800",
        "phone": "8286342279",
        "first_name": "Shardul",
        "last_name": "Sawant",
        "email": "shardulms99@gmail.com",
        "address": "Room No 11, 3rd Floor, Rakhangi Mahal Building, Dr Annie Besant Road, Worli",
        "landmark": "Opposite Avasekar Heights, Above Wellness Forever Medical Store",
        "pincode": "400018",
        "city": "Mumbai",
        "state": "Maharashtra",
        "paid_amount": 400,
        "weight": 0.3,
        "items": [
            {
                "name": "Hawas New Arrivals Sampling Set 3 x 1ml + Free 7ML Paradox Tester",
                "price": 400,
                "qty": 1,
                "sku": "RSS-ARR-3X1"
            }
        ]
    },
    {
        "order_id": "ORD-1793902511615",
        "phone": "7447556667",
        "first_name": "Dheeraj",
        "last_name": "Barse",
        "email": "dheerajbarse10@gmail.com",
        "address": "Shop No 1, Komal Complex, Day2Day Mart, Old Pune Mumbai Highway, Next to SBI Bank Nigdi",
        "landmark": "Next to SBI Bank Nigdi",
        "pincode": "411044",
        "city": "Pune",
        "state": "Maharashtra",
        "paid_amount": 1425,
        "weight": 0.5,
        "items": [
            {
                "name": "Somersault 50ML EDP By Harsh Beniwal + Free 7ML Paradox Tester",
                "price": 1425,
                "qty": 1,
                "sku": "OCT-SMR-50"
            }
        ]
    }
]

def build_rows():
    rows = []
    # Row 1: Group headers
    rows.append(GROUP_HEADER)
    # Row 2: Field headers
    rows.append(FIELD_HEADER)

    for order in ORDERS:
        for item in order["items"]:
            row = [
                order["order_id"],                  # *Order Id
                PICKUP_ADDRESS_ID,                 # Pickup Address Id (Optional) - ONLY the numeric ID
                order["phone"],                     # *Buyer's Mobile No.
                order["first_name"],                # *Buyer's First Name
                order["last_name"],                 # Buyer's Last Name (Optional)
                order["email"],                     # Email (Optional)
                order["address"],                   # *Shipping Complete Address
                order.get("landmark", ""),          # Shipping Address Landmark (Optional)
                order["pincode"],                   # *Shipping Address Pincode
                order["city"],                      # *Shipping Address City
                order["state"],                     # *Shipping Address State
                "India",                            # *Shipping Address Country
                order["address"],                   # Billing Complete Address (Optional)
                order.get("landmark", ""),          # Billing Landmark (Optional)
                order["pincode"],                   # Billing Pincode (Optional)
                order["city"],                      # Billing City (Optional)
                order["state"],                     # Billing State (Optional)
                "India",                            # Billing Country (Optional)
                item["name"],                       # *Product Name
                str(item["price"]),                 # *Per Unit Price in INR (Inclusive of Tax)
                str(item["qty"]),                   # *Product Quantity
                item["sku"],                        # *Master SKU
                "Prepaid",                          # *Payment Method (COD/Prepaid)
                "No",                               # *Partial COD (Yes/No)
                str(order["paid_amount"]),          # Paid Amount (Rs.)
                str(order["weight"]),               # *Weight Of Shipment (kg)
                "15",                               # *Length (cm)
                "12",                               # *Breadth (cm)
                "10",                               # *Height (cm)
                ""                                  # Courier ID (Optional)
            ]
            rows.append(row)
    return rows

def write_csv(filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    rows = build_rows()
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    print(f"Successfully generated Shiprocket CSV at: {filepath} with {len(rows)-2} order item rows.")

if __name__ == "__main__":
    public_path = "/Users/mayank/Developer/lawda-bcc/public/Shiprocket_Bulk_Order_Import.csv"
    brain_path = "/Users/mayank/.gemini/antigravity/brain/1a445ec3-73ea-4ad0-a66b-6273694fbc37/Shiprocket_Bulk_Order_Import.csv"
    
    write_csv(public_path)
    write_csv(brain_path)
