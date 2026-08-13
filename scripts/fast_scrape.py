import urllib.request
import urllib.error
import json
import os
import xml.etree.ElementTree as ET

SITEMAPS = {
    "products": "https://www.everlasting.shop/sitemap_products_1.xml?from=5713770610837&to=9838398669017"
}

HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        response = urllib.request.urlopen(req, timeout=10)
        return response.read()
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    os.makedirs("lib/data", exist_ok=True)
    products = []
    print("Fetching product sitemap...")
    xml_data = fetch_url(SITEMAPS["products"])
    if not xml_data: return
        
    root = ET.fromstring(xml_data)
    namespace = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    
    urls = root.findall('sitemap:url', namespace)
    print(f"Found {len(urls)} URLs.")
    
    # Process only first 50 to be fast for demo, or all if we want
    for i, url_node in enumerate(urls):
        loc = url_node.find('sitemap:loc', namespace)
        if loc is None or not loc.text.startswith("https://www.everlasting.shop/products/"): continue
            
        product_url = loc.text
        json_url = product_url + ".json"
        
        json_data_bytes = fetch_url(json_url)
        if json_data_bytes:
            try:
                product_data = json.loads(json_data_bytes.decode('utf-8'))
                if 'product' in product_data:
                    products.append(product_data['product'])
                    print(f"Added {product_data['product']['title']}")
            except Exception as e:
                pass
                
        # Save incrementally
        if i % 10 == 0 or i == len(urls) - 1:
            with open("lib/data/products.json", "w") as f:
                json.dump(products, f, indent=2)

    print("Done fetching fast JSON data.")

if __name__ == "__main__":
    main()
