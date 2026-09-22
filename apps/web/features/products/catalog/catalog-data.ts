import type { CatalogProduct } from "./types";

export const CURATED_CATALOG: CatalogProduct[] = [
  {
    id: "prod-nordic-sofa",
    title: "Nordic Bouclé Curved Sofa",
    slug: "nordic-boucle-curved-sofa",
    description: "Sculptural three-seater sofa upholstered in tactile bouclé with a kiln-dried hardwood frame.",
    price: 1690,
    compare_at_price: 1890,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80&fit=crop",
    ],
    category_id: "cat-living",
    is_featured: true,
    is_published: true,
    created_at: "2026-01-15T00:00:00Z",
    category: {
      id: "cat-living",
      name: "Living Room",
      slug: "living-room",
    },
  },
  {
    id: "prod-koben-chair",
    title: "Kōben Walnut Lounge Chair",
    slug: "koben-walnut-lounge-chair",
    description: "Organic walnut framing with sculpted armrests and high-density foam cushioning.",
    price: 820,
    compare_at_price: 950,
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80&fit=crop",
      "https://images.unsplash.com/photo-1580481077197-04877be1c70e?w=900&q=80&fit=crop",
    ],
    category_id: "cat-living",
    is_featured: true,
    is_published: true,
    created_at: "2026-01-20T00:00:00Z",
    category: {
      id: "cat-living",
      name: "Living Room",
      slug: "living-room",
    },
  },
  {
    id: "prod-sora-bed",
    title: "Sora Solid Oak Platform Bed",
    slug: "sora-solid-oak-platform-bed",
    description: "Minimalist Japanese-inspired platform bed constructed from solid sustainably sourced European white oak.",
    price: 1350,
    compare_at_price: 1550,
    stock: 4,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80&fit=crop",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&q=80&fit=crop",
    ],
    category_id: "cat-bedroom",
    is_featured: true,
    is_published: true,
    created_at: "2026-01-25T00:00:00Z",
    category: {
      id: "cat-bedroom",
      name: "Bedroom",
      slug: "bedroom",
    },
  },
  {
    id: "prod-arden-table",
    title: "Arden Travertine Dining Table",
    slug: "arden-travertine-dining-table",
    description: "Monumental dining table cut from honed Italian travertine stone with fluted column pedestals.",
    price: 2400,
    compare_at_price: 2800,
    stock: 3,
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80&fit=crop",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=900&q=80&fit=crop",
    ],
    category_id: "cat-dining",
    is_featured: true,
    is_published: true,
    created_at: "2026-02-01T00:00:00Z",
    category: {
      id: "cat-dining",
      name: "Dining Room",
      slug: "dining-room",
    },
  },
  {
    id: "prod-haven-dining",
    title: "Haven Smoked Oak Dining Table",
    slug: "haven-dining-table",
    description: "Clean architectural lines with bullnose edge detailing in rich smoked oak finish.",
    price: 699,
    compare_at_price: 850,
    stock: 9,
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80&fit=crop",
    ],
    category_id: "cat-dining",
    is_featured: false,
    is_published: true,
    created_at: "2026-02-05T00:00:00Z",
    category: {
      id: "cat-dining",
      name: "Dining Room",
      slug: "dining-room",
    },
  },
  {
    id: "prod-casa-lounge",
    title: "Casa Tufted Velvet Lounge Chair",
    slug: "casa-lounge-chair",
    description: "Deep button-tufted occasional chair with fluted turned birch legs and plush ivory velvet.",
    price: 299,
    compare_at_price: 360,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80&fit=crop",
    ],
    category_id: "cat-living",
    is_featured: false,
    is_published: true,
    created_at: "2026-02-10T00:00:00Z",
    category: {
      id: "cat-living",
      name: "Living Room",
      slug: "living-room",
    },
  },
  {
    id: "prod-milo-sideboard",
    title: "Milo Fluted Oak Sideboard",
    slug: "milo-sideboard",
    description: "Four-door credential credenza with tambour fluted facade and solid brass concealed pulls.",
    price: 1120,
    compare_at_price: 1290,
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&q=80&fit=crop",
    ],
    category_id: "cat-storage",
    is_featured: true,
    is_published: true,
    created_at: "2026-02-12T00:00:00Z",
    category: {
      id: "cat-storage",
      name: "Storage",
      slug: "storage",
    },
  },
  {
    id: "prod-artisan-desk",
    title: "Artisan Solid Oak Writing Desk",
    slug: "artisan-oak-desk",
    description: "Slender executive workstation featuring dual soft-close drawers and integrated wire canal.",
    price: 890,
    compare_at_price: 1050,
    stock: 7,
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80&fit=crop",
    ],
    category_id: "cat-office",
    is_featured: false,
    is_published: true,
    created_at: "2026-02-15T00:00:00Z",
    category: {
      id: "cat-office",
      name: "Home Office",
      slug: "home-office",
    },
  },
  {
    id: "prod-koben-coffee",
    title: "Kōben Low Walnut Coffee Table",
    slug: "koben-low-coffee-table",
    description: "Rounded pebble-contour low coffee table carved from monolithic American black walnut.",
    price: 580,
    compare_at_price: 680,
    stock: 11,
    images: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=80&fit=crop",
    ],
    category_id: "cat-living",
    is_featured: true,
    is_published: true,
    created_at: "2026-02-18T00:00:00Z",
    category: {
      id: "cat-living",
      name: "Living Room",
      slug: "living-room",
    },
  },
  {
    id: "prod-aura-bookshelf",
    title: "Aura Open Japanese Oak Bookshelf",
    slug: "aura-oak-bookshelf",
    description: "Five-tier architectural shelving unit with asymmetrical dividers and exposed tenon joints.",
    price: 1450,
    compare_at_price: 1650,
    stock: 4,
    images: [
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=900&q=80&fit=crop",
    ],
    category_id: "cat-storage",
    is_featured: false,
    is_published: true,
    created_at: "2026-02-20T00:00:00Z",
    category: {
      id: "cat-storage",
      name: "Storage",
      slug: "storage",
    },
  },
  {
    id: "prod-kyoto-bed",
    title: "Kyoto Low Slatted Headboard Bed",
    slug: "kyoto-slatted-bed",
    description: "Low-profile timber platform bed featuring continuous horizontal slatted backrest.",
    price: 1280,
    compare_at_price: 1420,
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80&fit=crop",
    ],
    category_id: "cat-bedroom",
    is_featured: false,
    is_published: true,
    created_at: "2026-02-22T00:00:00Z",
    category: {
      id: "cat-bedroom",
      name: "Bedroom",
      slug: "bedroom",
    },
  },
  {
    id: "prod-verona-task",
    title: "Verona Ergonomic Leather Task Chair",
    slug: "verona-leather-chair",
    description: "Top-grain cognac saddle leather swivel desk chair with pneumatic height adjustment.",
    price: 620,
    compare_at_price: 740,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=900&q=80&fit=crop",
    ],
    category_id: "cat-office",
    is_featured: true,
    is_published: true,
    created_at: "2026-02-25T00:00:00Z",
    category: {
      id: "cat-office",
      name: "Home Office",
      slug: "home-office",
    },
  },
];

export const NEW_ARRIVALS_PRODUCTS: CatalogProduct[] = [
  CURATED_CATALOG[3]!, // Arden Travertine Dining Table
  CURATED_CATALOG[8]!, // Kōben Low Coffee Table
  CURATED_CATALOG[7]!, // Artisan Writing Desk
  CURATED_CATALOG[11]!, // Verona Task Chair
];

export const BEST_SELLERS_PRODUCTS: CatalogProduct[] = [
  CURATED_CATALOG[0]!, // Nordic Bouclé Curved Sofa
  CURATED_CATALOG[1]!, // Kōben Lounge Chair
  CURATED_CATALOG[2]!, // Sora Platform Bed
  CURATED_CATALOG[6]!, // Milo Sideboard
];
