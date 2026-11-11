export interface EditorialArticle {
  slug: string;
  category: string;
  readTime: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  heroImage: string;
  relatedCollectionHref: string;
  relatedCollectionLabel: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  featuredHandles: string[];
}

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    slug: "middle-eastern-extrait-and-edp-guide",
    category: "Collector Guide",
    readTime: "4 min read",
    publishedAt: "November 2026",
    title: "Why Middle Eastern Houses Lead High-Longevity Value",
    excerpt:
      "Inside the maceration, high oil concentration, and spice-amber structure behind Lattafa, Rasasi, Afnan, and French Avenue favourites.",
    heroImage: "/harsh-beniwal/octopus/perfumes/images/overlord_hero.png",
    relatedCollectionHref: "/collections/middle-eastern-perfumes",
    relatedCollectionLabel: "Explore Middle Eastern Perfumes",
    featuredHandles: [
      "rasasi-hawas-ice-eau-de-parfum-for-men",
      "afnan-supremacy-noir",
      "paris-corner-khair-pistachio-eau-de-parfum-for-women",
    ],
    sections: [
      {
        heading: "Higher Oil Density Built for Warm Climates",
        paragraphs: [
          "Traditional Gulf perfumery prioritizes lasting trail in heat and humidity. Houses like Rasasi, Lattafa, Afnan, and French Avenue routinely formulate Eau de Parfums and Extraits with rich resinous fixes—ambroxan, labdanum, saffron, and sandalwood—that hold structure hours after application.",
          "While Western daytime colognes lean into volatile top-note citrus, Middle Eastern signatures layer spiced plum, cardamom, dry cedar, or roasted vanilla underneath so the scent evolves steadily from boardroom afternoon to midnight dinner.",
        ],
      },
      {
        heading: "Letting Fresh Batches Rest After Transit",
        paragraphs: [
          "Warm logistics transit can temporarily mute top-note sparkle in high-oil bottles. After unboxing your sealed flacon, spraying twice to introduce a small headspace of air and letting the bottle rest upright away from direct sunlight for one to two weeks settles the blend cleanly.",
        ],
      },
    ],
  },
  {
    slug: "edp-vs-edt-vs-extrait-concentration-explained",
    category: "Fragrance Education",
    readTime: "3 min read",
    publishedAt: "November 2026",
    title: "EDP vs EDT vs Extrait: Choosing the Right Concentration",
    excerpt:
      "How aromatic oil percentages change projection, skin closeness, and reapplication rhythm across Indian summers and monsoon evenings.",
    heroImage: "/harsh-beniwal/octopus/perfumes/images/paradox_hero.png",
    relatedCollectionHref: "/collections/all",
    relatedCollectionLabel: "Browse All Concentrations",
    featuredHandles: [
      "overlord",
      "paradox",
      "d-g-light-blue-eau-de-parfum-for-men",
    ],
    sections: [
      {
        heading: "Eau de Toilette (EDT): Crisp Airy Projection",
        paragraphs: [
          "Formulated typically around 5%–15% fragrance oils with higher alcohol uplift, EDTs radiate off the skin immediately after spraying. They excel in high daytime heat, commutes, and gym-to-office transitions where brightness matters most.",
        ],
      },
      {
        heading: "Eau de Parfum & Extrait: Depth & Multi-Hour Hold",
        paragraphs: [
          "Concentrations like 20%+ Eau de Parfums and Extraits—including Harsh Beniwal × Octopus 25%+ French-oil EDPs—anchor heavier base molecules such as vanilla bean, ambergris, vetiver, and oud. Expect closer, smoother warmth over 8+ hours with two to four sprays on pulse points or cool collarbones.",
        ],
      },
    ],
  },
  {
    slug: "office-to-evening-signature-wardrobe",
    category: "Styling & Curation",
    readTime: "4 min read",
    publishedAt: "November 2026",
    title: "Building a 3-Bottle Fragrance Wardrobe for Every Occasion",
    excerpt:
      "How to cover daily workwear, humid daytime errands, and evening celebrations without cluttering your dresser.",
    heroImage: "/harsh-beniwal/octopus/perfumes/images/rhapsody_hero.png",
    relatedCollectionHref: "/collections/office",
    relatedCollectionLabel: "Shop Office & Daily Signatures",
    featuredHandles: [
      "your-move",
      "rhapsody",
      "outlaw",
    ],
    sections: [
      {
        heading: "1. The Clean Everyday Anchor",
        paragraphs: [
          "Reserve one citrus, aromatic-lavender, or aquatic fresh EDP for closed rooms and travel. Mineral salt, bergamot, and white musk keep your presence polished without overwhelming nearby desks.",
        ],
      },
      {
        heading: "2. Evening & Date-Night Warmth",
        paragraphs: [
          "Once sunset cools the air, pivot into cardamom, roasted tonka bean, suede leather, or soft jasmine-vanilla compositions that reward close conversation.",
        ],
      },
      {
        heading: "3. Festive & Formal Statement",
        paragraphs: [
          "Weddings and celebrations call for saffron, rose-oud, amber resin, and bold Extrait powerhouses—two sprays across clean collarbone and inner cuff carry comfortably through six-hour receptions.",
        ],
      },
    ],
  },
  {
    slug: "how-to-verify-sealed-authentic-bottles",
    category: "Authenticity Promise",
    readTime: "3 min read",
    publishedAt: "November 2026",
    title: "How Octopus Guarantees 100% Original Sealed Fragrances",
    excerpt:
      "Batch codes, cellophanes, atomiser tolerances, and climate-controlled storage behind every bottle dispatched across India.",
    heroImage: "/harsh-beniwal/octopus/perfumes/images/mirage_hero.png",
    relatedCollectionHref: "/collections/designer-perfumes",
    relatedCollectionLabel: "Shop Authentic Designer Houses",
    featuredHandles: [
      "mirage",
      "darling-women",
      "promised",
    ],
    sections: [
      {
        heading: "Original Packaging & Batch Matching",
        paragraphs: [
          "Every designer, niche, and Middle Eastern bottle shipped from Octopus arrives factory sealed with matching embossed or printed batch codes on both the outer monocarton and the base of the glass flacon.",
        ],
      },
      {
        heading: "Unboxing Verification Window",
        paragraphs: [
          "To protect collector trust, we recommend recording a single continuous unboxing video when your parcel arrives. Our prepaid Express Pan-India network insures every shipment in protective honeycomb wrap until it reaches your door.",
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): EditorialArticle | null {
  return EDITORIAL_ARTICLES.find((a) => a.slug === slug) || null;
}

