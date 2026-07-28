import urllib.request
import re
import os
import json
import time

perfumes = [
    "afnan 9pm",
    "afnan supremacy silver",
    "afnan turathi blue",
    "afnan supremacy not only intense",
    "ajmal amber wood",
    "ajmal wisal",
    "ajmal aurum",
    "ajmal aristocrat"
]

os.makedirs("public/images/products/brands", exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for p in perfumes:
    try:
        query = urllib.parse.quote(p + " perfume bottle")
        url = f"https://www.bing.com/images/search?q={query}&form=HDRSC2"
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        # Extract the first image url from bing's murl
        match = re.search(r'murl&quot;:&quot;(http[^&]+)&quot;', html)
        if match:
            img_url = match.group(1)
            print(f"Found {p}: {img_url}")
            slug = p.replace(" ", "-")
            
            # Download image
            img_req = urllib.request.Request(img_url, headers=headers)
            img_data = urllib.request.urlopen(img_req, timeout=10).read()
            with open(f"public/images/products/brands/{slug}.jpg", "wb") as f:
                f.write(img_data)
            time.sleep(1)
        else:
            print(f"No image found for {p}")
    except Exception as e:
        print(f"Failed {p}: {e}")

