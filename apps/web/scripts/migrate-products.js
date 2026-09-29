const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ewbasjacvikhxikywoej.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YmFzamFjdmlraHhpa3l3b2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTA0NDMsImV4cCI6MjEwNDE2NjQ0M30.PvtLZ5J6OcTwtuV4HaoQlK0ww41e7CgAQrNoy1GEnnI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const IMAGE_MAPPING = {
  // Living Room (8 products)
  "nordic-boucle-curved-sofa":
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&fit=crop",
  "koben-walnut-lounge-chair":
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80&fit=crop",
  "koben-low-walnut-coffee-table":
    "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200&q=80&fit=crop",
  "neva-travertine-accent-side-table":
    "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200&q=80&fit=crop",
  "koto-sculptural-3-seater-sofa":
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80&fit=crop",
  "oslo-linen-daybed-lounge":
    "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80&fit=crop",
  "kyoto-fluted-oak-coffee-table":
    "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=1200&q=80&fit=crop",
  "bauhaus-saddle-leather-armchair":
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80&fit=crop",

  // Bedroom (7 products)
  "sora-solid-oak-platform-bed":
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&fit=crop",
  "maru-solid-ash-nightstand":
    "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=1200&q=80&fit=crop",
  "aalto-6-drawer-walnut-dresser":
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80&fit=crop",
  "ren-minimalist-upholstered-bed":
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80&fit=crop",
  "tsubaki-low-floating-nightstand":
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80&fit=crop",
  "hans-tallboy-5-drawer-dresser":
    "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=1200&q=80&fit=crop",
  "astrid-boucle-headboard-bed":
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80&fit=crop",

  // Dining Room (7 products)
  "arden-travertine-dining-table":
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80&fit=crop",
  "haven-round-oak-dining-table":
    "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1200&q=80&fit=crop",
  "hans-sculpted-dining-chair-pair":
    "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80&fit=crop",
  "celine-cane-weave-dining-chair":
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80&fit=crop",
  "brisa-solid-walnut-sideboard-buffet":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&fit=crop",
  "vester-oval-travertine-dining-table":
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80&fit=crop",
  "eos-minimalist-credenza-buffet":
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80&fit=crop",

  // Home Office (6 products)
  "artisan-solid-oak-writing-desk":
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80&fit=crop",
  "atelier-floating-drawer-executive-desk":
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=80&fit=crop",
  "kanto-swivel-wool-task-chair":
    "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200&q=80&fit=crop",
  "linear-brass-and-walnut-wall-bookshelf":
    "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=1200&q=80&fit=crop",
  "studio-minimalist-modular-shelving":
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80&fit=crop",
  "verona-ergonomic-leather-task-chair":
    "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=1200&q=80&fit=crop",

  // Storage (6 products)
  "milo-architectural-oak-sideboard":
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=80&fit=crop",
  "tenon-solid-hardwood-bookcase":
    "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80&fit=crop",
  "silas-fluted-marble-media-console":
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&q=80&fit=crop",
  "kanso-minimalist-2-door-cabinet":
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80&fit=crop",
  "arcos-glass-display-cabinet":
    "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80&fit=crop",
  "forma-low-slung-entryway-console":
    "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=1200&q=80&fit=crop",
};

async function runMigration() {
  console.log("Authenticating as operations@urbannest.com...");
  const authRes = await supabase.auth.signInWithPassword({
    email: "operations@urbannest.com",
    password: "SuperAdmin2026!",
  });

  if (authRes.error) {
    console.error("Auth failed:", authRes.error);
    process.exit(1);
  }
  console.log("Authenticated successfully!");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, slug, price, compare_at_price, images")
    .order("title");

  if (error || !products) {
    console.error("Failed to fetch products:", error);
    process.exit(1);
  }

  console.log(`Processing ${products.length} products...`);

  let updatedCount = 0;
  for (const product of products) {
    const isUSD = Number(product.price) < 10000;
    const newPrice = isUSD ? Math.round(Number(product.price) * 83) : Number(product.price);
    const newCompare = product.compare_at_price
      ? isUSD
        ? Math.round(Number(product.compare_at_price) * 83)
        : Number(product.compare_at_price)
      : null;

    const heroImage = IMAGE_MAPPING[product.slug];
    if (!heroImage) {
      console.warn(`[WARNING] No mapped hero image for slug: ${product.slug}`);
    }

    const newImages = heroImage ? [heroImage] : product.images;

    const { error: updateError } = await supabase
      .from("products")
      .update({
        price: newPrice,
        compare_at_price: newCompare,
        images: newImages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    if (updateError) {
      console.error(`Failed to update ${product.slug}:`, updateError);
    } else {
      updatedCount++;
      console.log(
        `✓ [${updatedCount}/${products.length}] ${product.title}: ` +
          `₹${newPrice.toLocaleString("en-IN")} ` +
          (newCompare ? `(was ₹${newCompare.toLocaleString("en-IN")})` : "") +
          ` | Image: ${newImages[0].slice(0, 45)}...`
      );
    }
  }

  console.log("\n==========================================");
  console.log(`MIGRATION COMPLETE! Successfully updated: ${updatedCount}/${products.length}`);
  console.log("==========================================");
}

runMigration().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
