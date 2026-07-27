export type Product = {
  slug: string;
  name: string;
  inspiredBy: string;
  gender: string;
  tagline: string;
  scentStory: string;
  goodToKnow: string[];
  notes: { top: string; heart: string; base: string };
  price: number;
  compareAtPrice: number;
  images: { grid: string; hero: string; lifestyle?: string; mood?: string; box?: string };
  sku: string;
};

export const products: Product[] = [
  {
    slug: "darling-women",
    name: "Darling",
    inspiredBy: "Miss D",
    gender: "For Her",
    tagline: "A gentle floral embrace that transitions into a heart of sun-kissed fruits, before dissolving into a velvety cocoon of creamy woods and soft amber.",
    scentStory: "The opening is a whisper of fresh iris petals and morning peony, carried by a cool breeze of lily-of-the-valley. As it evolves, the fragrance reveals a luscious core of damask rose intertwined with ripe stone fruits — golden apricot and blushing peach. The dry-down is pure indulgence: smooth sandalwood draped in sweet vanilla, warmed by the honeyed glow of benzoin and the nutty caress of tonka, all resting on a bed of powdery clean musk.",
    goodToKnow: ["Refined Sillage", "Exceptional 12+ Hour Wear", "Ideal for Rainy & Cool Weather"],
    notes: { top: "Citrus, Peony, Lily of the Valley, Iris", heart: "Rose, Apricot, Peach", base: "Vanilla, Musk, Tonka, Sandalwood, Benzoin" },
    compareAtPrice: 2199,
    price: 849,
    images: {
      grid: "/images/products/1Darling_300x300_crop_center.webp",
      hero: "/images/products/01_Darling_Hero_Octopus.webp",
      mood: "/images/products/05_Darling_Mood_Image_Octopus.webp",
      box: "/images/products/06_Darling_Monocarton_Octopus.webp",
    },
    sku: "sku001",
  },
  {
    slug: "mirage",
    name: "Mirage",
    inspiredBy: "Ombre Nomade",
    gender: "For Him + Her",
    tagline: "An intoxicating haze of resinous smoke and exotic spice that blooms into a rich tapestry of florals and rare woods, fading into a deeply sensual finish.",
    scentStory: "The journey begins with tendrils of sacred incense and threads of crimson saffron, offset by a surprising burst of tart raspberry. The heart reveals a dramatic bouquet — opulent rose petals entwined with herbaceous geranium, all grounded by the rugged bark of silver birch. The finale is a meditation in warmth: benzoin's amber-kissed sweetness, the polished glow of amberwood, and the primal depth of rare agarwood.",
    goodToKnow: ["Refined Sillage", "Exceptional 12+ Hour Wear", "Made for Cold Weather Evenings"],
    notes: { top: "Raspberry, Bergamot, Grapefruit", heart: "Rose, Spices, Saffron", base: "Leather, Balsamic, Oud, Amber" },
    compareAtPrice: 2499,
    price: 999,
    images: {
      grid: "/images/products/3Mirage_300x300_crop_center.webp",
      hero: "/images/products/Mirage_Hero_Octopus.webp",
      lifestyle: "/images/products/02_Mirage_Lifestyle_Image_Octopus_2144ad2d-351f-41bf-b798-1a5800a91613.webp",
      mood: "/images/products/05_Mirage_Mood_Image_Octopus.webp",
      box: "/images/products/06_Mirage_Monocarton_Octopus.webp",
    },
    sku: "sku003",
  },
  {
    slug: "outlaw",
    name: "Outlaw",
    inspiredBy: "Ombre Leather",
    gender: "For Him + Her",
    tagline: "Raw leather meets aromatic spice in a bold opening, softened by night-blooming florals, before settling into an earthy, mossy trail that commands attention.",
    scentStory: "A single note of green cardamom ignites the senses with aromatic precision. The heart unfolds with the intoxicating sweetness of jasmine sambac, layered over buttery-soft black leather that feels both daring and refined. Underneath, a foundation of rich patchouli mingles with the cool freshness of white moss, while golden amber adds a luminous, resinous warmth that clings to the skin for hours.",
    goodToKnow: ["Refined Sillage", "Exceptional 12+ Hour Wear", "Perfect for Monsoon Season"],
    notes: { top: "Cardamom", heart: "Jasmine, Violet Leaf", base: "Leather, Oakmoss, Patchouli" },
    compareAtPrice: 2799,
    price: 1099,
    images: {
      grid: "/images/products/4Outlaw_300x300_crop_center.webp",
      hero: "/images/products/Outlaw_Hero_Octopus.webp",
      mood: "/images/products/05_Outlaw_Mood_Image_Octopus.webp",
      box: "/images/products/06_Outlaw_Monocarton_Octopus.webp",
    },
    sku: "sku004",
  },
  {
    slug: "overlord",
    name: "Overlord",
    inspiredBy: "Sauvage",
    gender: "For Him",
    tagline: "Electrifying citrus crashes into a wave of aromatic herbs and fiery pepper, grounding itself in a magnetic base of warm amber and polished musk.",
    scentStory: "An explosive burst of Italian bergamot and tangy citrus zest commands the opening. The composition deepens with French lavender weaving through the heart, accented by the tingling warmth of Sichuan pepper, earthy nutmeg, and the liquorice-like sweetness of star anise. The foundation is built on ambroxan's signature mineral muskiness, with Madagascar vanilla adding a rich, addictive sweetness that lingers well into the night.",
    goodToKnow: ["Refined Sillage", "Exceptional 12+ Hour Wear", "Perfect for Monsoon Season"],
    notes: { top: "Bergamot, Lemon, Pepper", heart: "Lavender, Pink Pepper, Patchouli", base: "Amber, Cedarwood, Labdanum" },
    compareAtPrice: 3199,
    price: 1299,
    images: {
      grid: "/images/products/6Overlord_300x300_crop_center.webp",
      hero: "/images/products/01_Overlord_Hero_Octopus_127fd1b2-8940-4934-bfce-b3179fd6f130.webp",
      lifestyle: "/images/products/02_Overlord_Lifestyle_Image_Octopus_7eaffaae-8554-4394-8c38-3296186552e0.webp",
      mood: "/images/products/05_Overlord_Mood_Image_Octopus_2_d817cbb6-7717-4384-87ba-c0f5af66cdad.webp",
      box: "/images/products/06_Overlord_Monocarton-Image_Octopus_4650f56d-4875-41d3-974d-6e3173f87ee5.webp",
    },
    sku: "sku006",
  },
  {
    slug: "paradox",
    name: "Paradox",
    inspiredBy: "Les Sables Roses",
    gender: "For Her",
    tagline: "An opulent rose symphony unfolds with hypnotic intensity, layered over rare oud and gilded spice, creating a fragrance that feels both ancient and utterly modern.",
    scentStory: "The curtain rises with a lavish accord of centifolia and Bulgarian rose — petal-rich, luminous, and deeply romantic. At its core, precious oud wood introduces a contemplative smokiness, quietly powerful and refined. The composition resolves into a base of oceanic ambergris, sharpened by the bite of black pepper and illuminated by the liquid gold of saffron threads.",
    goodToKnow: ["Refined Sillage", "Exceptional 12+ Hour Wear", "Perfect for Monsoon Season"],
    notes: { top: "Orange, Rose", heart: "Rose, Spices, Saffron, Geranium", base: "Musk, Sandalwood, Amber" },
    compareAtPrice: 3499,
    price: 1399,
    images: {
      grid: "/images/products/7Paradox_300x300_crop_center.webp",
      hero: "/images/products/Paradox_Hero_Octopus.webp",
      lifestyle: "/images/products/02_Paradox_Lifestyle_Image_Octopus_e03c7686-59bf-4230-9d95-3822eff13e81.webp",
      mood: "/images/products/05_Paradox_Mood_Image_Octopus_7c9ab062-a546-4fe6-b811-b3cb2fc3d3a4.webp",
      box: "/images/products/06_Paradox_Monocarton_Octopus_b3ed0bcc-2ef9-47b2-9bcb-d1969a102358.webp",
    },
    sku: "sku007",
  },
  {
    slug: "promised",
    name: "Promised",
    inspiredBy: "BR540",
    gender: "For Him + Her",
    tagline: "Liquid gold meets crystalline florals in a radiant opening, melting into a warm amber core before fading into a whisper of sweet woods and sugared resin.",
    scentStory: "Precious saffron threads and luminous jasmine petals paint a golden opening that feels almost celestial. The heart reveals the rich, glowing warmth of amberwood fused with the sun-baked mineral quality of ambergris and the ethereal lift of hedione. It resolves into a base of balsamic fir resin and aromatic cedar, kissed by crystalline sugar, grounded by forest-floor oakmoss, and finished with ambroxan's signature woody transparency.",
    goodToKnow: ["Refined Sillage", "Exceptional 12+ Hour Wear", "Perfect for Monsoon Season"],
    notes: { top: "Saffron, Jasmine, Tagette", heart: "Oakmoss, Caramel, Tonka Bean", base: "Musk, Amber, Cedarleaf" },
    compareAtPrice: 2799,
    price: 1099,
    images: {
      grid: "/images/products/5Promised_300x300_crop_center.webp",
      hero: "/images/products/01_Promised_Hero_Octopus_1d69e39a-e1ce-4da4-9e80-dd5985789ea8.webp",
      lifestyle: "/images/products/02_Promised_Lifestyle_Image_Octopus_e1d23f33-d071-4b8c-ad58-32ae632fac19.webp",
      mood: "/images/products/05_Promised_Mood_Image_Octopus.webp",
      box: "/images/products/06_Promised_Monocarton-Image_Octopus.webp",
    },
    sku: "sku005",
  },
  {
    slug: "rhapsody",
    name: "Rhapsody",
    inspiredBy: "Jazz Club",
    gender: "For Him + Her",
    tagline: "Sun-drenched citrus and peppery warmth give way to a boozy, herbaceous heart, before dissolving into a smoky embrace of tobacco leaf and liquid vanilla.",
    scentStory: "The composition opens with sparkling lemon zest and the bittersweet elegance of neroli, punctuated by the gentle heat of pink peppercorn. A heart of dark rum swirls with the grassy earthiness of Java vetiver and the medicinal-herbal edge of clary sage. The base is a late-night reverie: cured tobacco leaf smoldering beneath a blanket of rich vanilla bean, anchored by the dark, resinous sweetness of styrax balsam.",
    goodToKnow: ["Refined Sillage", "Exceptional 12+ Hour Wear", "Perfect for Monsoon Season"],
    notes: { top: "Neroli, Lemon, Clary Sage", heart: "Spices, Vetiver", base: "Sandalwood, Musk, Amber, Wood" },
    compareAtPrice: 1999,
    price: 799,
    images: {
      grid: "/images/products/10Rhapsody_300x300_crop_center.webp",
      hero: "/images/products/Rhapsody_Hero_Octopus.webp",
      lifestyle: "/images/products/02_Rhapsody_Lifestyle_Image_Octopus_0b9eef8e-63ce-4553-a1da-c88defdf924f.webp",
      mood: "/images/products/05_Rhapsody_Mood_Image_Octopus.webp",
      box: "/images/products/06_Rhapsody_Monocarton_Octopus_a7fdcc22-8759-4cf6-87f3-fc1d09d73b7e.webp",
    },
    sku: "sku010",
  },
  {
    slug: "somersault",
    name: "Somersault",
    inspiredBy: "Imagination",
    gender: "For Him + Her",
    tagline: "A vivid explosion of Mediterranean citrus gives way to exotic florals laced with ginger and cinnamon, resolving into a contemplative base of smoked tea and sacred resins.",
    scentStory: "The scent erupts with the electric zest of citron, amplified by the crystalline brightness of Calabrian bergamot and the juicy sweetness of Sicilian orange. Tunisian neroli blooms at the heart with an intoxicating floral radiance, intertwined with the fiery kick of Nigerian ginger and the warm embrace of Ceylon cinnamon bark. The dry-down is meditative: Chinese black tea, the campfire smokiness of guaiac wood, the church-incense warmth of olibanum, and ambroxan's clean mineral depth.",
    goodToKnow: ["Refined Sillage", "Exceptional 12+ Hour Wear", "Perfect for Monsoon Season"],
    notes: { top: "Citron, Bergamot, Orange", heart: "Neroli, Ginger, Cinnamon", base: "Black Tea, Ambroxan, Guaiacwood, Olibanum" },
    compareAtPrice: 4499,
    price: 1899,
    images: {
      grid: "/images/products/8Somersault_300x300_crop_center.webp",
      hero: "/images/products/Somersault_Hero_Octopus.webp",
      mood: "/images/products/04_Somersault_Mood_Image_Octopus.webp",
      box: "/images/products/06_Somersault_Monocarton-Image_Octopus.webp",
    },
    sku: "sku008",
  },
  {
    slug: "your-move",
    name: "Your Move",
    inspiredBy: "Oud Wood",
    gender: "For Him + Her",
    tagline: "Ancient woods and aromatic spice collide in a confident opening, deepening into a luxuriously sweet, amber-rich trail that lingers for hours.",
    scentStory: "Rare oud wood anchors the opening with its unmistakable smoky intensity, flanked by the creamy warmth of Indian sandalwood and the grassy depth of Haitian vetiver. Polished rosewood adds a sophisticated sheen, while green cardamom and the electric tingle of Sichuan pepper bring controlled heat. The base is pure indulgence — tonka bean's caramelized sweetness, Madagascar vanilla's rich embrace, and golden amber's luminous depth create a finish that is both commanding and irresistible.",
    goodToKnow: ["Refined Sillage", "Exceptional 12+ Hour Wear", "Perfect for Monsoon Season"],
    notes: { top: "Oud, Cardamom, Sandalwood", heart: "Pink Pepper, Tonka Bean, Amber", base: "Vetiver, Rosewood, Musk" },
    compareAtPrice: 2999,
    price: 1199,
    images: {
      grid: "/images/products/9YourMove_300x300_crop_center.webp",
      hero: "/images/products/Your_Move_Hero_Octopus.webp",
      lifestyle: "/images/products/02_Your_Move_Lifestyle_Image_Octopus.webp",
      mood: "/images/products/05_Your_Move_Mood_Image_Octopus.webp",
      box: "/images/products/06_Your_Move_Monocarton_Octopus.webp",
    },
    sku: "sku009",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatINR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}
