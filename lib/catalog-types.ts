export type BrandTier =
  | "in-house"
  | "middle-eastern"
  | "designer"
  | "niche"
  | "miniatures"
  | "keepsakes";

export type FragranceGender = "Men" | "Women" | "Unisex";

export type Concentration =
  | "Extrait de Parfum"
  | "Parfum"
  | "Eau de Parfum"
  | "Eau de Toilette"
  | "Eau de Cologne"
  | "Attar / Oil"
  | "Body Mist"
  | "Gift Set"
  | "Perfume";

export type SizeBucket =
  | "Miniature (<30ml)"
  | "30ml"
  | "50ml"
  | "75ml"
  | "100ml"
  | "125ml+"
  | "Gift Set";

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "discount"
  | "title-asc"
  | "title-desc"
  | "newest";

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface ProductVariantSummary {
  id: string;
  title: string;
  option1: string | null;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  featuredImage?: string;
}

export interface ProductSummary {
  id: string;
  handle: string;
  title: string;
  brand: string;
  brandSlug: string;
  brandTier: BrandTier;
  isPerfume: boolean;
  isFlagship: boolean;
  gender: FragranceGender;
  concentration: Concentration;
  concentrationShort: string;
  primarySize: string;
  sizeBuckets: SizeBucket[];
  families: string[];
  seasons: string[];
  occasions: string[];
  price: number;
  compareAtPrice: number | null;
  discountPct: number;
  available: boolean;
  isGiftSet: boolean;
  isMiniature: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  image: string;
  secondaryImage: string | null;
  variants: ProductVariantSummary[];
  notes: FragranceNotes | null;
  tagline?: string;
  inspiredBy?: string;
  origin?: string;
  createdAt: string;
}

export interface ProductImageItem {
  id?: string | number;
  src: string;
  alt: string;
  type?: string;
}

export interface EnrichedProduct extends ProductSummary {
  rawVendor: string;
  productType: string;
  tags: string[];
  images: ProductImageItem[];
  cleanHtml: string;
  plainDescription: string;
  scentStory?: string;
  goodToKnow?: string[];
  importer?: string;
  manufacturer?: string;
  marketedBy?: string;
}

export interface BrandSummary {
  name: string;
  slug: string;
  tier: BrandTier;
  count: number;
  minPrice: number;
  maxPrice: number;
  sampleImage: string;
}

export interface CatalogFilters {
  query?: string;
  brands?: string[];
  tiers?: BrandTier[];
  genders?: FragranceGender[];
  concentrations?: string[];
  sizes?: SizeBucket[];
  families?: string[];
  occasions?: string[];
  seasons?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  discountedOnly?: boolean;
  giftSetsOnly?: boolean;
  miniaturesOnly?: boolean;
  sort?: SortKey;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface FacetCounts {
  brands: FacetOption[];
  tiers: FacetOption[];
  genders: FacetOption[];
  concentrations: FacetOption[];
  sizes: FacetOption[];
  families: FacetOption[];
  occasions: FacetOption[];
  seasons: FacetOption[];
  minPrice: number;
  maxPrice: number;
  totalInStock: number;
  totalDiscounted: number;
}

export interface CollectionMeta {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  seoDescription: string;
  filters: CatalogFilters;
  featuredHandles?: string[];
  faqs?: { q: string; a: string }[];
}

export const BRAND_ALIASES: Record<string, string> = {
  Bvlagri: "Bvlgari",
};

export function formatPriceINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function normalizeVendorName(vendor?: string | null): string {
  const clean = (vendor || "").trim();
  if (!clean) return "Octopus Perfumes";
  return BRAND_ALIASES[clean] || clean;
}

export function slugifyBrandName(name: string): string {
  return normalizeVendorName(name)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

