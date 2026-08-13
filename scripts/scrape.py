import urllib.request
import urllib.error
import json
import os
import xml.etree.ElementTree as ET
import time

SITEMAPS = {
    "products": "https://www.everlasting.shop/sitemap_products_1.xml?from=5713770610837&to=9838398669017",
    "pages": "https://www.everlasting.shop/sitemap_pages_1.xml?from=47799074952&to=134907691225",
    "collections": "https://www.everlasting.shop/sitemap_collections_1.xml?from=426322821337&to=455353762009"
}

HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        response = urllib.request.urlopen(req, timeout=15)
        return response.read()
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    # Setup directories
    os.makedirs("public/images/products", exist_ok=True)
    os.makedirs("lib/data", exist_ok=True)
    
    products = []
    
    print("Fetching product sitemap...")
    xml_data = fetch_url(SITEMAPS["products"])
    if not xml_data:
        return
        
    root = ET.fromstring(xml_data)
    namespace = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    
    urls = root.findall('sitemap:url', namespace)
    print(f"Found {len(urls)} URLs in product sitemap.")
    
    count = 0
    # Let's download all products to fulfill "all products variations and literally everything"
    # But for script safety we can limit to 50 for now or fetch all. The user said "literally everything".
    for url_node in urls:
        loc = url_node.find('sitemap:loc', namespace)
        if loc is None or not loc.text.startswith("https://www.everlasting.shop/products/"):
            continue
            
        product_url = loc.text
        json_url = product_url + ".json"
        
        print(f"Fetching product data: {json_url}")
        json_data_bytes = fetch_url(json_url)
        if not json_data_bytes:
            continue
            
        try:
            product_data = json.loads(json_data_bytes.decode('utf-8'))
            if 'product' in product_data:
                product = product_data['product']
                products.append(product)
                
                # Download images
                if 'images' in product:
                    for img in product['images']:
                        img_url = img['src']
                        img_filename = img_url.split('/')[-1].split('?')[0]
                        img_path = os.path.join("public/images/products", img_filename)
                        
                        # Fix the image URL in the product data to point to local
                        img['local_src'] = f"/images/products/{img_filename}"
                        
                        if not os.path.exists(img_path):
                            print(f"  Downloading image: {img_filename}")
                            img_data = fetch_url(img_url)
                            if img_data:
                                with open(img_path, 'wb') as f:
                                    f.write(img_data)
                            time.sleep(0.1)
        except Exception as e:
            print(f"Error parsing JSON for {product_url}: {e}")
            
        count += 1
        time.sleep(0.2)
        
    # Save products to JSON
    with open("lib/data/products.json", "w") as f:
        json.dump(products, f, indent=2)
        
    print(f"Saved {len(products)} products to lib/data/products.json")

    # Fetch Collections
    print("Fetching collections sitemap...")
    collections = []
    xml_data = fetch_url(SITEMAPS["collections"])
    if xml_data:
        root = ET.fromstring(xml_data)
        urls = root.findall('sitemap:url', namespace)
        for url_node in urls:
            loc = url_node.find('sitemap:loc', namespace)
            if loc is not None and loc.text.startswith("https://www.everlasting.shop/collections/"):
                json_url = loc.text + ".json"
                print(f"Fetching collection data: {json_url}")
                json_data_bytes = fetch_url(json_url)
                if json_data_bytes:
                    try:
                        col_data = json.loads(json_data_bytes.decode('utf-8'))
                        if 'collection' in col_data:
                            collections.append(col_data['collection'])
                    except:
                        pass
                time.sleep(0.2)
                
        with open("lib/data/collections.json", "w") as f:
            json.dump(collections, f, indent=2)
        print(f"Saved {len(collections)} collections to lib/data/collections.json")

if __name__ == "__main__":
    main()
