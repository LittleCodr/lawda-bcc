# FRIDAYCHARM.COM
## Complete UI/UX Reverse Engineering, Visual Design System & E-commerce Experience Specification

**Reference website:** https://www.fridaycharm.com/  
**Industry:** Premium fragrance and perfume e-commerce  
**Document type:** UI/UX design analysis and implementation specification  
**Reference date:** 12 November 2026

---

# 1. DESIGN PHILOSOPHY AND VISUAL POSITIONING

## 1.1 What kind of website is FridayCharm?

FridayCharm is a fragrance-focused multi-brand e-commerce storefront. It combines three different experiences:

1. A traditional online shopping experience.
2. A fragrance discovery and editorial experience.
3. A product catalogue and brand directory.

The website is not designed exclusively around luxury aesthetics. It prioritises product discovery, catalogue depth, commercial merchandising and customer trust.

Its design language can be described as:

- Product-first commerce.
- Catalogue-driven navigation.
- Editorial fragrance discovery.
- Promotional product merchandising.
- Information-rich product pages.
- Trust-oriented conversion design.

The key design principle is that customers should be able to discover a fragrance through multiple entry points.

A customer can enter through:
- A particular brand.
- A gender category.
- A fragrance family.
- A specific occasion.
- A budget range.
- A bestselling product.
- A blog article.
- A particular perfume they already know.

The website creates multiple pathways towards the same product.

## 1.2 Overall visual character

The visual system should be understood as a commercial fragrance storefront rather than a minimal luxury fashion website.

Its most important characteristics are:

| Design characteristic | Role |
|---|---|
| Large catalogue | Product discovery |
| Brand-led navigation | Brand recognition |
| Product photography | Visual merchandising |
| Discount presentation | Purchase motivation |
| Repeated product carousels | Product exposure |
| Editorial sections | Discovery |
| Review sections | Trust |
| Dense navigation | Catalogue access |
| Promotional messaging | Conversion |

The website prioritises finding and purchasing products over creating an immersive brand-only experience.

## 1.3 Design principles to extract

**Principle A: Discovery should never depend on the homepage alone.**

Users must have direct access to categories, brands, collections, products and search.

**Principle B: Product information must be progressively revealed.**

The initial product viewport should provide the purchase essentials. Detailed fragrance information should follow underneath.

**Principle C: The product catalogue should remain visually consistent.**

Every perfume card should follow a predictable structure.

**Principle D: Trust must be continuously reinforced.**

Authenticity, delivery, returns, customer reviews and payment information should be visible at appropriate purchase stages.

**Principle E: Editorial content must connect back to shopping.**

Articles should link to relevant products and collections instead of becoming isolated content pages.

---

# 2. GLOBAL LAYOUT AND POSITIONING SYSTEM

## 2.1 Desktop viewport

Use 1440 × 900 px as the primary reference viewport during implementation.

Recommended structural layout:

| Element | Recommended specification |
|---|---|
| Maximum content width | 1320–1380 px |
| Main horizontal padding | 40–60 px |
| Header height | 70–90 px |
| Announcement bar | 30–36 px |
| Content section spacing | 56–88 px |
| Product grid gap | 18–26 px |
| Card corner radius | 4–10 px |
| Main content alignment | Centered |
| Desktop grid | 4–5 products per row |

These are implementation targets, not measured FridayCharm CSS values.

## 2.2 Tablet viewport

Reference viewport: 768–1024 px.

Recommended behaviour:

- Reduce horizontal padding to 24–32 px.
- Reduce navigation complexity.
- Replace the desktop mega menu with a collapsible navigation.
- Use three product columns where space permits.
- Move collection filters into a drawer.
- Maintain readable product names.
- Prevent price and discount information from wrapping awkwardly.

## 2.3 Mobile viewport

Reference viewport: 390 × 844 px.

Recommended behaviour:

- Single-row compact header.
- Hamburger navigation.
- Search icon or expandable search.
- Cart icon with item count.
- Two-column product grid.
- Horizontal scrolling category chips.
- Full-width filter drawer.
- Sticky add-to-cart button on product pages.
- Collapsible product information sections.
- Touch-friendly controls.

Mobile must not be treated as a compressed desktop layout. The interaction model should be adapted to the smaller screen.

---

# 3. COMPLETE HEADER AND NAVIGATION SYSTEM

The navigation is one of the most important parts of FridayCharm.

The reference site exposes a very large number of brand and category links, including designer, niche, Middle Eastern, attar, deodorant, home fragrance, bath and body, and miniature categories.

This is a catalogue-navigation strategy.

## 3.1 Announcement and utility bar

**Position:** Absolute top of the page, above the main navigation.

Purpose:
- Communicate shipping benefits.
- Communicate delivery and returns.
- Highlight important promotional information.

Recommended content structure:

| Position | Content |
|---|---|
| Left | Free shipping offer |
| Centre | Promotional message |
| Right | Delivery or return information |

Visual treatment:
- Compact height.
- High text contrast.
- Small typography.
- Single-line content on desktop.
- Rotating messages only when necessary.

Do not make this bar unnecessarily tall. It should not push the main shopping experience below the fold.

## 3.2 Main header

**Position:** Directly below the announcement bar.

Structural layout:

`LOGO | NAVIGATION | SEARCH | ACCOUNT | CART`

### Logo

- Positioned at the left.
- Clear visual separation from navigation.
- Maintain original proportions.
- Never stretch the logo.
- Use an appropriate transparent image asset.

### Navigation

The reference exposes major shopping pathways such as:

- All Brands.
- Designer Perfume.
- Miniature.
- Perfume Gift Sets.
- Top Selling Brands.
- Alphabetical brand groups.

It also exposes extensive brand lists.

### Search

Search is a primary navigation function.

Recommended search interface:

- Search icon.
- Expandable search input.
- Predictive suggestions.
- Product thumbnail.
- Product name.
- Price.
- Brand.
- Search result count.

Search suggestions should support typo tolerance and product aliases.

Example:

A search for "hawas ice" should suggest Rasasi Hawas Ice, not merely display an unfiltered results page.

### Account

Account access should provide:

- Sign in.
- Register.
- Order history.
- Order tracking.
- Saved addresses.
- Wishlist.
- Profile information.

### Cart

Cart icon should include:
- Cart symbol.
- Item count.
- Accessible click target.
- Slide-out cart interaction.

## 3.3 Mega menu architecture

This is one of the defining components of the reference website.

The navigation contains extensive brand directories divided into alphabetical groups.

### Desktop mega menu structure

Recommended layout:

| Column | Content |
|---|---|
| Column 1 | Designer perfumes |
| Column 2 | Niche perfumes |
| Column 3 | Middle Eastern perfumes |
| Column 4 | Attars and other fragrance categories |

Within each section, brand links are grouped alphabetically.

### Menu interaction

1. User hovers over a navigation item.
2. Mega menu opens.
3. Menu remains open while pointer is inside the menu.
4. Hovering over a brand reveals the relevant link state.
5. Clicking the brand opens its collection page.
6. Moving outside closes the menu.

Recommended interaction timing:
- Open delay: 100–150 ms.
- Close delay: 200–300 ms.
- Transition duration: 150–200 ms.

Use keyboard-accessible navigation as well.

### Mobile mega menu

Use a vertical accordion.

Example:

- Designer Perfumes
  - A–C
  - D–H
  - I–N
  - O–Z
- Niche Perfumes
  - A–C
  - D–H
  - I–N
  - O–Z
- Middle Eastern
- Attar
- Deodorants
- Home Fragrance
- Bath & Body
- Miniatures

Each accordion should expand independently or follow a predictable single-open interaction model.

### Important improvement

Do not expose hundreds of links simultaneously on a small mobile screen.

Use alphabetical navigation and internal search.

---

# 4. HOMEPAGE: COMPLETE SECTION-BY-SECTION ANALYSIS

The homepage has an extensive merchandising structure.

The following is the observed content architecture, with recommended layout and implementation behaviour.

## SECTION 01: Global header

**Position:** First visible section.

Components:
- Announcement bar.
- Logo.
- Primary navigation.
- Search.
- Account.
- Cart.

Purpose: Give customers immediate access to shopping and discovery.

## SECTION 02: Trust and service benefits

**Position:** Immediately after the main navigation in the extracted homepage content.

The website communicates:

- Free shipping above ₹1,500.
- Three-day conditional returns on sealed products.
- Cash on delivery.
- Authenticity guarantee.
- 4.8-star rating.

Recommended visual arrangement:

Five compact benefit items in a horizontal row.

Each item contains:
1. Small icon.
2. Short heading.
3. Supporting description.

Example:

**GENUINE PRODUCTS**

100% authentic fragrances.

Do not make each benefit into a large promotional card. A compact trust strip is more appropriate.

## SECTION 03: Shop by category

**Heading:** Shop by category.

Categories observed:

- Men.
- Women.
- Unisex.
- New Arrival.
- Attar.
- Gifts.
- Sale.

Recommended UI:

A horizontal category selector using image-backed tiles or compact category cards.

Each tile should have:
- Image.
- Category title.
- Optional supporting text.
- Entire tile clickable.

Desktop:
- Seven items can be displayed in one row depending on content width.

Mobile:
- Horizontal scroll.
- Partial next-card visibility to communicate that more options exist.

## SECTION 04: Shop the brand

**Heading:** Shop the brand.

This section exposes prominent brands such as:

- Rasasi.
- Lattafa.
- Versace.
- Afnan.
- Giorgio Armani.
- Rayhaan.
- Nishane.
- Dolce & Gabbana.
- Byredo.
- Al Haramain.
- Hugo Boss.
- Swiss Arabian.
- Le Labo.
- Khadlaj.
- Christian Dior.
- Amouage.
- Yves Saint Laurent.
- Ajmal.
- Xerjoff.
- Armaf.
- Gucci.
- Initio.
- Maison Alhambra.
- Burberry.
- Memo Paris.
- Parfums de Marly.
- Paris Corner.
- Montale.

### Visual implementation

Recommended component:

A horizontally scrollable brand-logo strip.

Each item:
- Brand logo or brand name.
- Fixed dimensions.
- Neutral background.
- Subtle hover treatment.
- Direct link to brand collection.

Avoid different logo heights. Standardise the visual container.

Desktop: 6–8 visible brands.

Mobile: 3–4 visible brands with horizontal scrolling.

## SECTION 05: Bestsellers

**Heading:** Bestsellers.

This is a major conversion section.

The reference features products including:

- Rasasi Hawas Ice.
- Rasasi Hawas For Him.
- Afnan 9PM.
- French Avenue Liquid Brun.
- Lattafa Khamrah.
- Afnan Supremacy Collector's Edition.
- Armaf Club de Nuit Intense Man.

### Product card anatomy

Every product card should have the following structure:

1. Product image.
2. Discount badge.
3. Product name.
4. Brand name, where useful.
5. Original price.
6. Current selling price.
7. Savings.
8. Optional rating.
9. Optional quick-add button.

### Card positioning

The image occupies the majority of the card's visual area.

The title sits immediately underneath.

Pricing is placed below the title.

The current selling price should receive greater typographic emphasis than the crossed-out MRP.

### Product card interaction

- Image hover transition.
- Secondary image on hover, if available.
- Click image to open product.
- Click title to open product.
- Quick-add action where variants permit.
- Clear out-of-stock treatment.

### Carousel behaviour

Desktop:
- Display 4–5 product cards.
- Use previous/next arrows.
- Allow track dragging.

Mobile:
- Horizontal swipe.
- Show approximately 1.5–2 cards.
- Preserve enough width for readable pricing.

## SECTION 06: New arrivals

**Heading:** New Arrivals.

Purpose:
- Surface recently added inventory.
- Improve discovery of newly stocked products.
- Give returning customers a reason to revisit.

Use the same product card component as Bestsellers.

Do not create a separate card implementation.

The only difference should be the data source and section heading.

## SECTION 07: Designer brand merchandising

**Heading:** Shop by Designer Brand.

This section gives customers a route into designer fragrances and miniature products.

The homepage exposes products such as:
- Bvlgari.
- Parfums de Marly.
- Amouage.
- Hermes.
- Versace.
- Creed.
- Xerjoff.
- Montblanc.

### Recommended layout

A product carousel with editorial-style supporting text.

Use a short heading and subtitle.

For example:

**Explore Designer Fragrances**

Discover iconic compositions from the world's most recognised fragrance houses.

## SECTION 08: Gift sets and combos

The reference has a dedicated section for gifting and combination products.

Components:
- Gift Sets.
- Combos.
- Product links.

Recommended visual:
- Two large category tiles.
- Lifestyle imagery.
- Short supporting copy.
- Direct CTA.

Gifting should be treated as a separate shopping intent, not just another product filter.

## SECTION 09: Shop by budget

Observed budget segmentation:

- Under ₹1,000.
- ₹1,000–3,000.
- ₹3,000–5,000.
- ₹5,000–9,000.
- Premium.

This is an important discovery mechanism.

### Recommended UI

Five clickable budget tiles.

Each tile should show:
- Budget range.
- Optional descriptive label.
- Optional representative image.

Example:

Under ₹1,000 — Affordable fragrances.

₹1,000–3,000 — Everyday favourites.

₹3,000–5,000 — Premium everyday scents.

₹5,000–9,000 — Designer fragrances.

Premium — Exclusive fragrance houses.

Each link should point to an actual curated collection.

## SECTION 10: Shop by size

Observed categories:

- 30ml.
- 50ml.
- 100ml.
- Combo pack.

Recommended implementation:

Compact size-selection cards.

Size pages should contain genuinely relevant products.

Do not merely redirect every size link to the same generic catalogue.

## SECTION 11: Explore Collections

**Subtitle:** Find the perfect scent for every occasion.

This is a particularly interesting merchandising strategy.

The reference groups fragrances according to lifestyle and contextual intent.

### A. Gifting and relationships

- Couple.
- First Date.
- Anniversary.
- Birthday.

### B. Festive and wedding

- Rakhi.
- Wedding.
- Diwali.
- Christmas & New Year.

### C. Life stage

- Teens.
- Young Professionals.
- Gen-Z.
- Newlyweds.

### D. Style and outfit pairing

- Black Look.
- White Look.
- Denim & Casual.
- Ethnic.

### E. Mood and season

- Monsoon.
- Summer.
- Winter.
- Mood-based collection.

### F. Additional occasions

- Daily Wear.
- Night Out.
- Interview.
- Eid.

### G. Scent notes

- Citrus.
- Woody.
- Floral.
- Oudh.
- Leather.
- Fresh & Aquatic.

### Design recommendation

This section should use editorial collection tiles rather than generic product cards.

Suggested hierarchy:

Large section heading.

Short description.

Grouped category labels.

Image-backed tiles.

Each tile should lead to a relevant curated collection.

This creates a much more intuitive discovery experience for customers who do not know which perfume they want.

## SECTION 12: Customer testimonials

The homepage includes customer reviews with fragrance names and individual reviewer names.

Examples include reviews associated with:
- Nasomatto Baraonda.
- Nishane Sultan Vetiver.
- Rasasi Hawas For Him.
- Rayhaan Lion.
- Lattafa Khamrah Qahwa.
- Versace Pour Homme.

### Layout

Heading:

**What Our Customers Say**

Supporting text:

Real reviews from real fragrance lovers.

Review cards contain:

1. Reviewer initials or profile image.
2. Reviewer name.
3. Review content.
4. Associated product.
5. Optional rating.

### UX behaviour

Use a horizontally scrollable testimonial carousel.

Do not show all reviews in one long column.

Include a route to see additional reviews.

The strongest review content should discuss authenticity, packaging, delivery and the actual fragrance experience.

## SECTION 13: Google reviews

The homepage separately displays Google review content.

It includes:
- Google rating.
- Reviewer names.
- Review excerpts.
- Links to Google reviews.
- A QR code encouraging customers to leave reviews.

This is distinct from the product review system.

Maintain that distinction in the implementation.

## SECTION 14: Community and social media

The reference has a community section with:

- WhatsApp Community.
- Instagram.
- Facebook.
- YouTube.

Its messaging focuses on fragrance stories, new drops and early access.

### Recommended design

A visually differentiated social section.

Use platform icons and short descriptions.

Keep external links clearly labelled.

## SECTION 15: YouTube Shorts

The homepage includes a section titled:

**Watch Our Shorts**

It is intended to display video content.

Recommended implementation:

- Thumbnail.
- Video title.
- Play button.
- Link to YouTube.
- Lazy loading.

Do not automatically load multiple heavy videos on initial page load.

Use thumbnails and load the video only when required.

## SECTION 16: Blog

The homepage includes editorial articles such as:

- Marshmallow Gothic: The Dark Gourmand Trend.
- Lattafa Eclaire and the milk perfume trend.
- Kismet Magic and gourmand fragrances.

The displayed article cards contain:
- Thumbnail.
- Publication date.
- Article title.
- Short introduction.
- Read More link.

### Recommended layout

Three editorial cards on desktop.

One-column or horizontally scrollable cards on mobile.

Use a consistent image ratio.

The title should be the dominant text element.

## SECTION 17: Footer

The footer should consolidate:

- Customer service.
- Shopping categories.
- Brand directory.
- About the company.
- Policies.
- Contact details.
- Social links.
- Newsletter.
- Payment methods.
- Copyright information.

The footer should not become an uncontrolled collection of every possible link.

Group links logically.

---

# 5. COLLECTION PAGE: COMPLETE UI/UX ANALYSIS

Reference:
https://www.fridaycharm.com/collections/rasasi-perfumes

The Rasasi collection page is an excellent reference because it contains an extensive catalogue and detailed filtering.

The page reports 124 products during inspection.

## 5.1 Collection page hierarchy

Recommended order:

1. Global header.
2. Breadcrumb navigation.
3. Shipping and returns information.
4. Collection title.
5. Product count.
6. Filters.
7. Sorting.
8. Product grid.
9. Pagination or load-more interaction.
10. Collection description and supporting content.
11. Related collection links.
12. Footer.

## 5.2 Breadcrumbs

Example:

Home / Middle Eastern Perfumes / Rasasi Perfumes

Position:
Immediately above the collection heading.

Visual style:
Small, muted typography.

The final breadcrumb represents the current page.

## 5.3 Collection heading

Example:

# Rasasi Perfumes

The heading should be large enough to establish the page context but should not consume excessive vertical space.

Display the number of products near the heading or immediately above the grid.

## 5.4 Filter system

The observed Rasasi page contains these filters:

### Brand

- Rasasi.

### Category

- Middle Eastern Perfumes.

### Availability

- In stock.
- Out of stock.

### Gender

- Men.
- Women.
- Unisex.

### Concentration type

- Eau de Parfum.
- Parfum.
- Extrait.

### Fragrance family

- Aromatic.
- Chypre.
- Citrus.
- Floral.
- Fruity.
- Leather.
- Oriental.
- Woody.
- Oudh.
- Warm & Spicy.
- Aquatic Fresh.

### Price

Minimum and maximum price inputs.

### Recommended filter UI

Desktop:
- Left-side filter panel.
- Product listing on the right.

Mobile:
- Filter button.
- Full-height slide-out drawer.
- Apply filters CTA.
- Clear-all action.
- Active filter chips above the grid.

### Filter interactions

- Checkbox selection.
- Immediate product count update.
- Active filter indication.
- Clear individual filters.
- Clear all.
- Preserve filter state during sorting.
- Preserve state when navigating back.

## 5.5 Product sorting

Recommended options:

- Featured.
- Best selling.
- Alphabetically A–Z.
- Alphabetically Z–A.
- Price low to high.
- Price high to low.
- Date new to old.
- Date old to new.

Use the platform's actual supported sort behaviour.

## 5.6 Collection product grid

The reference shows product photography, sale labels, product names, original pricing, discounted pricing and savings.

### Desktop layout

Recommended:
- Four product columns.
- Five columns on sufficiently wide screens.
- Consistent card heights.
- Consistent image ratios.
- Fixed image containers.

### Mobile layout

- Two columns.
- Approximately 12–14 px horizontal gap.
- Approximately 16–20 px vertical gap.
- Product title maximum of 2–3 lines.
- Prices aligned consistently.

### Product card specification

**Image container**
- 1:1 or 4:5 image ratio.
- Contain rather than crop perfume bottles.
- Neutral background.
- Consistent internal image padding.

**Sale badge**
- Top-left.
- Small.
- High contrast.
- Percentage discount.

**Product title**
- Below image.
- Readable typography.
- Product-specific name.
- No unnecessary truncation.

**Pricing**
- Selling price visually dominant.
- MRP crossed out.
- Savings clearly distinguishable.

**Actions**
- Quick add.
- Wishlist.
- Product detail navigation.

---

# 6. PRODUCT DETAIL PAGE: COMPLETE UX SPECIFICATION

The product detail page is the most important commercial page.

It must answer three questions:

1. What is this fragrance?
2. Why should I buy it?
3. Can I trust this seller?

Reference example:
Rasasi Hawas Ice.

## 6.1 Product page above-the-fold layout

Desktop structure:

| Left column | Right column |
|---|---|
| Product image gallery | Brand |
| Main product photograph | Product title |
| Thumbnail gallery | Rating |
| Additional photographs | Price |
| Optional video | Discount |
| | Size / variant |
| | Availability |
| | Delivery information |
| | Add to cart |
| | Trust messaging |

Suggested proportions:

- Gallery: 52–56%.
- Product information: 44–48%.

The gallery should dominate the visual presentation without pushing the purchasing controls too far down.

## 6.2 Product gallery

Components:

- Main product image.
- Thumbnail strip.
- Secondary product photographs.
- Packaging photographs.
- Optional product video.
- Zoom interaction.

Interaction:

- Clicking a thumbnail changes the main image.
- Clicking the main image opens a zoom/lightbox.
- Arrow controls move between images.
- Mobile supports swipe gestures.

Image quality matters considerably in perfume commerce.

The bottle, cap, label and packaging must remain legible.

## 6.3 Product information block

Recommended order:

**Brand name**

Small uppercase or understated label.

**Product title**

The largest text element in the purchasing information area.

**Rating**

- Star rating.
- Review count.
- Link to reviews.

**Price**

- Current selling price.
- MRP.
- Discount percentage.
- Savings.

**Variant selector**

Examples:
- 50ml.
- 100ml.
- Miniature.

**Stock status**

Clear indication of availability.

**Quantity selector**

Minus, quantity, plus.

**Primary CTA**

ADD TO CART.

**Secondary CTA**

BUY NOW, if supported.

**Delivery estimator**

PINCODE / POSTAL CODE INPUT.

**Trust messaging**

- Authenticity.
- Secure payment.
- Delivery.
- Return conditions.

## 6.4 Variant selector

Variant selection must be clear.

Use buttons or selectable cards.

Selected state:
- Strong border.
- Clear background treatment.
- Accessible text.

Unavailable variants:
- Disabled.
- Explicitly labelled unavailable.

Changing variants should update the price, SKU, stock status and images where appropriate.

## 6.5 Quantity selector

Use a compact control.

Structure:

`[-] 1 [+]`

Rules:
- Minimum quantity: 1.
- Prevent negative quantities.
- Respect available inventory.
- Update cart quantity correctly.

## 6.6 Add-to-cart interaction

On click:

1. Validate selected variant.
2. Validate quantity.
3. Add item.
4. Update cart state.
5. Show cart drawer or confirmation.
6. Keep the customer on the product page.

Do not unexpectedly redirect the user away from product information.

## 6.7 Delivery estimation

Provide a pincode field.

Interaction:

1. User enters pincode.
2. Validate format.
3. Check serviceability.
4. Display estimated delivery window.
5. Show any relevant shipping restrictions.

Do not display invented delivery dates.

---

# 7. PRODUCT CONTENT AND EDITORIAL INFORMATION ARCHITECTURE

This is one of the strongest parts of the reference product strategy.

The product page is not limited to the purchasing block.

It contains a much larger information experience.

The implementation should use reusable content sections.

## 7.1 Product introduction

A concise editorial introduction.

Example structure:

**Rasasi Hawas Ice**

Introduce the fragrance's character, overall composition and intended wearing experience.

The writing should sound like a fragrance editor, not a keyword generator.

## 7.2 About the fragrance

Include:
- Fragrance house.
- Product history.
- Release year where verified.
- Fragrance concentration.
- Gender classification where applicable.
- Fragrance family.
- Inspiration and context.

## 7.3 Fragrance pyramid

Use a three-column visual presentation.

**TOP NOTES**

Opening impression.

**HEART NOTES**

Main fragrance character.

**BASE NOTES**

Dry-down and underlying composition.

Each section should have:
- Notes.
- Supporting imagery or icons.
- Short descriptive copy.

Do not invent notes.

## 7.4 Fragrance characteristics

Use a visual scale where reliable information exists.

Possible characteristics:

- Freshness.
- Sweetness.
- Spiciness.
- Warmth.
- Woodiness.
- Floral character.
- Projection.
- Longevity.

These should be presented as editorial assessments, not guaranteed scientific measurements.

## 7.5 Longevity and projection

Use separate information blocks.

Explain:
- Reported wear duration.
- Projection characteristics.
- Skin versus fabric differences.
- Variations caused by weather and individual skin chemistry.

Avoid absolute promises.

## 7.6 Occasion recommendations

Examples:
- Office.
- Casual.
- Evening.
- Date.
- Wedding.
- Formal occasions.

Use icons or compact visual cards.

## 7.7 Season recommendations

Examples:
- Summer.
- Winter.
- Monsoon.
- All-season.

Explain the reason for the recommendation.

## 7.8 Who should wear it?

A concise buyer-oriented explanation.

Cover:
- Preferred scent profile.
- Experience level.
- Typical usage.
- Suitable occasions.
- Personal preferences.

## 7.9 Product comparisons

Comparison content is valuable.

Examples:
- Hawas versus Hawas Ice.
- Hawas Ice versus Hawas Black.
- Hawas Ice versus Hawas Tropical.

Use a structured comparison table.

Fields:
- Scent profile.
- Opening notes.
- Main character.
- Base notes.
- Season.
- Occasion.
- Price.
- Size.

Do not make unsupported claims about superiority.

## 7.10 Frequently asked questions

Use accordion components.

Possible questions:

- Is this an original perfume?
- What is the fragrance concentration?
- How long does it last?
- Is it suitable for summer?
- What is the difference between the original and the flanker?
- Is this suitable for daily wear?
- What is the product volume?
- How can I verify the packaging?

Each answer should be specific to the actual product.

## 7.11 Related products

Show:
- Same brand.
- Same fragrance family.
- Similar scent profiles.
- Alternative price points.
- Complementary products.

Use product cards.

## 7.12 Customer reviews

Structure:

- Average rating.
- Total review count.
- Rating distribution.
- Written reviews.
- Review images.
- Verified purchase indicator.
- Review date.
- Sorting.

Provide filters for:
- Highest rated.
- Lowest rated.
- Most recent.
- With photos.

## 7.13 Video reviews

Embed relevant product videos or YouTube reviews.

Use a thumbnail-first approach.

Do not autoplay sound.

## 7.14 Final product discovery section

At the end of the page, recommend:
- Similar products.
- Popular products from the brand.
- Other fragrances in the same family.
- Relevant collections.

This provides another discovery path before the footer.

---

# 8. CART DRAWER AND CART PAGE

## 8.1 Cart drawer

The global website exposes a cart drawer.

Observed structural elements include:
- Cart heading.
- Close control.
- Subtotal.
- Shipping and tax messaging.
- Checkout button.
- Empty-cart state.

### Recommended populated cart layout

Each cart item should contain:

- Product image.
- Product title.
- Variant.
- Unit price.
- Quantity selector.
- Remove action.
- Line subtotal.

Below the items:

- Discount code.
- Shipping information.
- Cart subtotal.
- Estimated taxes.
- Total where available.
- Checkout CTA.

## 8.2 Empty cart

Show:

- Shopping bag illustration or icon.
- Empty-cart heading.
- Short explanation.
- Continue shopping CTA.
- Optional bestseller recommendations.

## 8.3 Cart conversion enhancements

Useful additions:

- Free-shipping threshold progress.
- Related miniatures.
- Gift packaging options.
- Recently viewed products.
- Clear delivery estimates.

Do not add unnecessary popups that interrupt the checkout journey.

---

# 9. SEARCH EXPERIENCE

Search should be treated as a first-class feature.

Perfume buyers frequently search using:
- Product name.
- Brand.
- Perfume concentration.
- Size.
- Fragrance family.
- Notes.
- Gender.

## 9.1 Predictive search

Example:

User enters: `hawas`

Suggestions:

- Rasasi Hawas For Him.
- Rasasi Hawas Ice.
- Rasasi Hawas Black.
- Rasasi Hawas Tropical.
- Rasasi Hawas Kobra.

Each suggestion should contain:
- Image.
- Product name.
- Brand.
- Price.

## 9.2 Search results page

Structure:

1. Search query heading.
2. Number of matching results.
3. Filter controls.
4. Sorting.
5. Product grid.
6. Alternative suggestions if no results.

## 9.3 Empty search results

Provide:
- Spelling suggestions.
- Popular brands.
- Bestsellers.
- Similar fragrance categories.

Never leave an empty page with only a no-results message.

---

# 10. WISHLIST AND ACCOUNT EXPERIENCE

Recommended account architecture:

## Sign in
- Email.
- Password.
- Forgot password.
- Optional Google sign-in.

## Registration
- Name.
- Email.
- Password.
- Consent.

## Account dashboard
- Personal information.
- Orders.
- Addresses.
- Wishlist.
- Return requests.
- Logout.

## Wishlist
- Product image.
- Name.
- Price.
- Availability.
- Add to cart.
- Remove.

Maintain wishlist state across sessions for logged-in users.

---

# 11. CHECKOUT UX

The checkout should be designed for minimum friction.

## Step 1: Contact information

- Email or phone.
- Customer details.

## Step 2: Shipping address

- Full name.
- Mobile number.
- Address.
- City.
- State.
- Postal code.
- Country.

## Step 3: Shipping method

Display available delivery options and charges.

## Step 4: Payment

- UPI.
- Cards.
- Net banking.
- Wallets.
- COD where supported.

## Step 5: Order review

- Products.
- Quantities.
- Discount.
- Shipping.
- Taxes.
- Final amount.

## Step 6: Confirmation

- Order ID.
- Payment status.
- Delivery estimate.
- Order tracking link.

Important UX principles:

- Avoid repeating address information.
- Validate fields inline.
- Clearly explain payment failures.
- Preserve cart information.
- Display all charges before final confirmation.

---

# 12. FOOTER AND INFORMATION ARCHITECTURE

The footer should contain the following groups.

### Shopping
- Men.
- Women.
- Unisex.
- New Arrivals.
- Bestsellers.
- Gifts.
- Sale.
- Miniatures.

### Brands
- Designer.
- Niche.
- Middle Eastern.
- Attar.

### Customer service
- Contact.
- Shipping.
- Returns.
- FAQs.
- Track order.

### Company
- About.
- Our story.
- Showroom.
- Privacy policy.
- Terms and conditions.

### Community
- Instagram.
- Facebook.
- YouTube.
- WhatsApp.

### Newsletter
- Email input.
- Subscribe button.
- Consent information.

---

# 13. DESIGN SYSTEM: TYPOGRAPHY

The actual font family and CSS font sizes should be confirmed through browser inspection before claiming an exact match.

For a faithful recreation, first extract the site's computed font styles.

The following is a recommended implementation system.

## 13.1 Typography hierarchy

| Element | Desktop size | Mobile size | Weight |
|---|---:|---:|---|
| Hero heading | 44–56 px | 32–38 px | 600 |
| Section heading | 28–36 px | 24–28 px | 600 |
| Collection heading | 32–40 px | 27–32 px | 600 |
| Product title | 15–18 px | 14–16 px | 500 |
| Product price | 16–20 px | 15–18 px | 600 |
| Body copy | 15–17 px | 14–16 px | 400 |
| Supporting text | 13–14 px | 12–13 px | 400 |
| Labels | 11–13 px | 11–12 px | 500 |

## 13.2 Recommended font pairing

For a more premium fragrance experience:

- Editorial headings: Cormorant Garamond or Playfair Display.
- Interface typography: Inter or Manrope.

Use a restrained font system.

Do not introduce three or four unrelated font families.

## 13.3 Typography rules

- Product titles must be readable at card size.
- Prices must be visually prominent.
- Supporting text should not compete with headings.
- Avoid excessive uppercase.
- Use consistent line heights.
- Avoid excessively thin text on mobile.

---

# 14. DESIGN SYSTEM: COLOURS

Do not assume the exact colours without extracting the site's CSS.

For a premium implementation inspired by the reference, use:

| Token | Suggested value | Usage |
|---|---|---|
| Background | #FFFFFF | Main canvas |
| Secondary background | #F7F6F3 | Supporting sections |
| Primary text | #242424 | Main content |
| Secondary text | #777777 | Descriptions |
| Border | #E8E6E1 | Dividers |
| Accent | #9A7953 | Premium highlights |
| Sale | #B83232 | Discounts |
| Success | #347A54 | Stock availability |
| Muted surface | #F2F0EB | Product cards |

The colour system should remain restrained.

Avoid gradients on every component.

A fragrance website should allow product imagery to carry most of the visual personality.

---

# 15. SPACING, GRID AND COMPONENT DIMENSIONS

Use a consistent 4-point spacing scale.

| Token | Value |
|---|---:|
| 1 | 4 px |
| 2 | 8 px |
| 3 | 12 px |
| 4 | 16 px |
| 5 | 20 px |
| 6 | 24 px |
| 8 | 32 px |
| 10 | 40 px |
| 12 | 48 px |
| 16 | 64 px |
| 20 | 80 px |

## Main layout

Desktop:
- Max width: 1360 px.
- Main side padding: 40 px.
- Section vertical spacing: 64 px.
- Grid gap: 20 px.

Tablet:
- Side padding: 24 px.
- Section spacing: 48 px.

Mobile:
- Side padding: 16 px.
- Section spacing: 36–44 px.
- Grid gap: 12 px.

Use consistent spacing rather than individually adjusting every section.

---

# 16. ANIMATION AND INTERACTION DESIGN

The reference is primarily a shopping experience. Animation should support usability, not distract from it.

## 16.1 Navigation

- Smooth mega-menu appearance.
- Subtle opacity transition.
- Small vertical movement.
- No exaggerated bounce.

## 16.2 Product cards

On hover:
- Slight image scale.
- Secondary image transition.
- Optional quick-add appearance.
- Smooth transition.

Recommended duration: 180–250 ms.

## 16.3 Buttons

States:
- Default.
- Hover.
- Active.
- Loading.
- Disabled.
- Success.

Use subtle colour and border changes.

## 16.4 Carousels

- Smooth horizontal movement.
- Drag support.
- Previous/next arrows.
- Touch swipe.
- Keyboard support.

## 16.5 Product gallery

- Image zoom.
- Thumbnail transition.
- Swipe.
- Lightbox.

## 16.6 Accordions

Use smooth height and opacity transitions.

Avoid overly long animations.

## 16.7 Cart drawer

- Slide in from the right.
- Background overlay.
- Close on outside click.
- Close with Escape.
- Prevent unwanted background scrolling.

## 16.8 Scroll behaviour

Use subtle entrance transitions.

Do not animate every text element separately.

Avoid heavy scroll-triggered animations that harm mobile performance.

---

# 17. RESPONSIVE DESIGN SPECIFICATION

## Desktop

- Full navigation.
- Mega menu.
- 4–5 product columns.
- Sidebar filters.
- Two-column product detail page.
- Horizontal editorial carousels.

## Tablet

- Simplified navigation.
- Three product columns.
- Filter drawer.
- Compact product gallery.
- Two-column product detail page where possible.

## Mobile

- Compact header.
- Hamburger menu.
- Two-column product grid.
- Full-screen filter drawer.
- Horizontal category chips.
- Product image gallery with swipe.
- Sticky purchase CTA.
- Accordion product descriptions.
- Compact footer accordions.

## Mobile sticky product CTA

Structure:

`₹3,350.00       ADD TO CART`

The bar should:
- Appear after the primary purchase area scrolls out of view.
- Respect mobile safe areas.
- Never cover product options.
- Update with selected variant.
- Maintain cart functionality.

---

# 18. COMPLETE CUSTOMER JOURNEY

## Journey A: Customer knows the perfume

Google search → Product page → Review and product information → Variant selection → Add to cart → Checkout → Confirmation.

## Journey B: Customer knows the brand

Homepage → Brand navigation → Brand collection → Filter → Product → Checkout.

## Journey C: Customer wants a fragrance recommendation

Homepage → Explore Collections → Occasion or scent family → Curated collection → Product detail → Checkout.

## Journey D: Customer is price-sensitive

Homepage → Shop by Budget → Product grid → Sort by price → Product → Checkout.

## Journey E: Customer is researching

Google search → Editorial article → Related products → Product detail → Reviews → Checkout.

All five journeys should be supported without forcing customers through the homepage.

---

# 19. CONTENT POSITIONING AND INFORMATION HIERARCHY

Content placement should follow customer intent.

| Page region | Information priority |
|---|---|
| Announcement bar | Promotions |
| Header | Navigation and search |
| Trust strip | Authenticity and delivery |
| Homepage first sections | Categories and popular brands |
| Product carousels | Commercial discovery |
| Collection page | Product discovery and filters |
| Product top section | Product and purchase information |
| Product body | Fragrance education |
| Reviews | Social proof |
| Related products | Additional discovery |
| Footer | Support and company information |

## Content density rules

Above the fold:
- Minimal reading.
- Clear shopping actions.
- Product imagery.
- Price and availability.

Middle of page:
- Discovery.
- Detailed product information.
- Editorial content.

Bottom of page:
- Reviews.
- Related products.
- Supporting content.
- Company information.

Do not place a 1,000-word editorial introduction before the customer sees the product price and purchase button.

---

# 20. RECOMMENDED COMPONENT LIBRARY

Build reusable components rather than creating individual page-specific elements.

## Global components

- AnnouncementBar
- SiteHeader
- MegaMenu
- MobileNavigation
- SearchOverlay
- PredictiveSearch
- CartDrawer
- Footer
- NewsletterForm

## Homepage components

- TrustStrip
- CategoryTiles
- BrandLogoCarousel
- ProductCarousel
- ProductGrid
- BudgetCollectionTiles
- OccasionCollectionGrid
- ScentFamilyGrid
- ReviewCarousel
- GoogleReviewSection
- SocialMediaSection
- VideoCarousel
- BlogCarousel

## Catalogue components

- Breadcrumbs
- CollectionHeader
- FilterSidebar
- FilterDrawer
- ActiveFilterChips
- SortDropdown
- ProductCard
- Pagination

## Product components

- ProductGallery
- ProductInformation
- PriceDisplay
- DiscountBadge
- VariantSelector
- QuantitySelector
- StockIndicator
- DeliveryEstimator
- AddToCartButton
- FragranceIntroduction
- FragrancePyramid
- FragranceCharacteristics
- OccasionRecommendations
- ProductComparison
- ProductFAQ
- RelatedProducts
- ReviewSummary
- ReviewList
- VideoReviews

## Checkout components

- CartItems
- CartSummary
- AddressForm
- ShippingSelector
- PaymentSelector
- OrderSummary
- OrderConfirmation

---

# 21. TECHNICAL IMPLEMENTATION RECOMMENDATIONS

For a React-based implementation:

## Frontend

- React.
- TypeScript.
- Tailwind CSS.
- Reusable component architecture.
- Framer Motion for lightweight transitions.
- Zustand or Context for cart and UI state.

## Backend and data

- Product catalogue API.
- Brand data.
- Collection data.
- Inventory.
- Pricing.
- Customer accounts.
- Orders.
- Reviews.
- Search indexing.

## Suggested product data model

```ts
interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;

  description: string;

  price: number;
  compareAtPrice?: number;

  currency: "INR";

  images: string[];
  videos?: string[];

  sizes: ProductVariant[];

  gender?: string;
  concentration?: string;
  fragranceFamily?: string;

  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };

  occasions: string[];
  seasons: string[];

  availability: boolean;

  rating?: number;
  reviewCount?: number;
}

interface ProductVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
}
```

## Performance requirements

- Responsive image delivery.
- WebP/AVIF.
- Lazy loading below the fold.
- Explicit image dimensions.
- Avoid layout shifts.
- Minimise JavaScript bundles.
- Defer third-party scripts.
- Optimise product gallery images.
- Use server-side rendering or pre-rendering for indexable commerce pages.

---

# 22. UX QUALITY AND CONVERSION REQUIREMENTS

The following should be treated as acceptance criteria.

### Navigation
- Every important category is accessible.
- Mega menu works with keyboard and mouse.
- Mobile menu is usable with one hand.
- Search suggestions are relevant.

### Product discovery
- Filters work correctly.
- Product counts update.
- Sorting works.
- No duplicate products appear unexpectedly.
- Empty states provide alternatives.

### Product detail
- Product images load correctly.
- Variants update pricing.
- Stock status is accurate.
- Cart action works.
- Delivery estimation is functional.
- Reviews are genuine.

### Checkout
- Forms validate.
- Error messages are understandable.
- Prices remain consistent.
- Cart survives navigation.
- Payment state is handled correctly.

### Mobile
- No horizontal overflow.
- Buttons are sufficiently large.
- Text is readable.
- Sticky purchase bar does not obscure content.
- Filter drawer is easy to close.

---

# 23. WHAT TO REPLICATE AND WHAT TO IMPROVE

| Reference feature | Recommendation |
|---|---|
| Extensive brand directory | Replicate the concept |
| Alphabetical brand groups | Replicate |
| Category navigation | Replicate |
| Bestsellers | Replicate |
| New arrivals | Replicate |
| Shop by budget | Replicate |
| Shop by size | Replicate |
| Occasion collections | Replicate and improve |
| Scent-note collections | Replicate |
| Product editorial content | Replicate |
| Fragrance pyramid | Replicate |
| Customer reviews | Replicate |
| Related products | Replicate |
| Large mega menu | Simplify visually |
| Dense navigation | Improve usability |
| Repeated product sections | Reduce redundancy |
| Excessive content at page bottom | Organise into clear sections |
| Generic promotional messaging | Replace with specific benefits |

---

# 24. FINAL IMPLEMENTATION PRIORITY

## Phase 1: Foundation

- Design tokens.
- Header.
- Navigation.
- Search.
- Footer.
- Product card.

## Phase 2: Shopping experience

- Homepage.
- Brand collections.
- Product collections.
- Filters.
- Sorting.
- Search results.

## Phase 3: Product experience

- Product gallery.
- Product information.
- Variant selector.
- Purchase controls.
- Fragrance pyramid.
- Reviews.
- Related products.

## Phase 4: Conversion

- Cart drawer.
- Cart page.
- Checkout.
- Delivery estimator.
- Order confirmation.

## Phase 5: Discovery

- Occasion collections.
- Scent-family collections.
- Budget collections.
- Editorial pages.
- Video content.
- Social proof.

## Phase 6: Refinement

- Mobile responsiveness.
- Animation.
- Performance.
- Accessibility.
- Analytics.
- Conversion testing.

---

# 25. IMPORTANT REVERSE-ENGINEERING LIMITATIONS

This specification documents the publicly observable website structure and translates it into an implementation-ready design system.

It does not claim to have measured every original CSS property or inspected every checkout interaction.

The following require an additional live-browser inspection to establish exact values:

1. Original font families and font weights.
2. Exact hexadecimal colour tokens.
3. Header and section heights.
4. Actual image aspect ratios and container dimensions.
5. Hover states and animation timings.
6. Mobile menu behaviour.
7. Cart drawer transitions.
8. Product gallery zoom.
9. Sticky header behaviour.
10. Actual checkout provider and checkout interactions.
11. Exact product-page section ordering across different products.
12. Computed responsive breakpoints.

These should be measured before describing the implementation as a pixel-perfect reproduction.

---

# FINAL DESIGN DIRECTION

The most important takeaway from FridayCharm is not one individual visual component.

It is the integration of:

- Extensive catalogue navigation.
- Brand-first discovery.
- Product merchandising.
- Occasion-based shopping.
- Fragrance education.
- Detailed product pages.
- Customer trust.
- Editorial content.
- Multiple conversion pathways.

The strongest implementation would preserve this complete commerce architecture while making the visual interface cleaner, more consistent, more mobile-friendly and easier to navigate.

**The target is not a FridayCharm clone. The target is a better-executed fragrance commerce experience built around the same successful discovery and merchandising principles.**