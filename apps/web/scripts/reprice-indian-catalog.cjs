const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ewbasjacvikhxikywoej.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YmFzamFjdmlraHhpa3l3b2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTA0NDMsImV4cCI6MjEwNDE2NjQ0M30.PvtLZ5J6OcTwtuV4HaoQlK0ww41e7CgAQrNoy1GEnnI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const REPRICING_CATALOG = [
  // Living Room
  {
    slug: "nordic-boucle-curved-sofa",
    price: 34999,
    compare_at_price: 39999, // ~12.5% discount
  },
  {
    slug: "koto-sculptural-3-seater-sofa",
    price: 42999,
    compare_at_price: 49999, // ~14.0% discount
  },
  {
    slug: "oslo-linen-daybed-lounge",
    price: 26999,
    compare_at_price: 29999, // ~10.0% discount
  },
  {
    slug: "koben-walnut-lounge-chair",
    price: 12499,
    compare_at_price: null,
  },
  {
    slug: "bauhaus-saddle-leather-armchair",
    price: 14999,
    compare_at_price: 16999, // ~11.8% discount
  },
  {
    slug: "koben-low-walnut-coffee-table",
    price: 7999,
    compare_at_price: 8999, // ~11.1% discount
  },
  {
    slug: "kyoto-fluted-oak-coffee-table",
    price: 9499,
    compare_at_price: null,
  },
  {
    slug: "neva-travertine-accent-side-table",
    price: 2499,
    compare_at_price: null,
  },

  // Bedroom
  {
    slug: "sora-solid-oak-platform-bed",
    price: 26999,
    compare_at_price: 29999, // ~10.0% discount
  },
  {
    slug: "ren-minimalist-upholstered-bed",
    price: 24499,
    compare_at_price: null,
  },
  {
    slug: "astrid-boucle-headboard-bed",
    price: 29999,
    compare_at_price: 34999, // ~14.3% discount
  },
  {
    slug: "aalto-6-drawer-walnut-dresser",
    price: 21999,
    compare_at_price: 24999, // ~12.0% discount
  },
  {
    slug: "hans-tallboy-5-drawer-dresser",
    price: 18499,
    compare_at_price: 21499, // ~14.0% discount
  },
  {
    slug: "maru-solid-ash-nightstand",
    price: 2299,
    compare_at_price: 2599, // ~11.5% discount
  },
  {
    slug: "tsubaki-low-floating-nightstand",
    price: 1899,
    compare_at_price: 2199, // ~13.6% discount
  },

  // Dining Room
  {
    slug: "arden-travertine-dining-table",
    price: 29999,
    compare_at_price: null,
  },
  {
    slug: "haven-round-oak-dining-table",
    price: 22999,
    compare_at_price: 25999, // ~11.5% discount
  },
  {
    slug: "vester-oval-travertine-dining-table",
    price: 34999,
    compare_at_price: 39999, // ~12.5% discount
  },
  {
    slug: "brisa-solid-walnut-sideboard-buffet",
    price: 24999,
    compare_at_price: 28999, // ~13.8% discount
  },
  {
    slug: "eos-minimalist-credenza-buffet",
    price: 19999,
    compare_at_price: 22999, // ~13.0% discount
  },
  {
    slug: "hans-sculpted-dining-chair-pair",
    price: 7499,
    compare_at_price: 8499, // ~11.8% discount
  },
  {
    slug: "celine-cane-weave-dining-chair",
    price: 4499,
    compare_at_price: null,
  },

  // Home Office
  {
    slug: "artisan-solid-oak-writing-desk",
    price: 16999,
    compare_at_price: 19499, // ~12.8% discount
  },
  {
    slug: "atelier-floating-drawer-executive-desk",
    price: 21999,
    compare_at_price: 24999, // ~12.0% discount
  },
  {
    slug: "kanto-swivel-wool-task-chair",
    price: 8999,
    compare_at_price: null,
  },
  {
    slug: "verona-ergonomic-leather-task-chair",
    price: 12999,
    compare_at_price: 14999, // ~13.3% discount
  },
  {
    slug: "linear-brass-and-walnut-wall-bookshelf",
    price: 9999,
    compare_at_price: 11499, // ~13.0% discount
  },
  {
    slug: "studio-minimalist-modular-shelving",
    price: 8499,
    compare_at_price: 9499, // ~10.5% discount
  },

  // Storage
  {
    slug: "milo-architectural-oak-sideboard",
    price: 22999,
    compare_at_price: 25999, // ~11.5% discount
  },
  {
    slug: "silas-fluted-marble-media-console",
    price: 18999,
    compare_at_price: 21999, // ~13.6% discount
  },
  {
    slug: "forma-low-slung-entryway-console",
    price: 11999,
    compare_at_price: null,
  },
  {
    slug: "kanso-minimalist-2-door-cabinet",
    price: 9999,
    compare_at_price: 11299, // ~11.5% discount
  },
  {
    slug: "arcos-glass-display-cabinet",
    price: 17999,
    compare_at_price: 19999, // ~10.0% discount
  },
  {
    slug: "tenon-solid-hardwood-bookcase",
    price: 13499,
    compare_at_price: 14999, // ~10.0% discount
  },
];

async function main() {
  console.log("Authenticating as admin operations@urbannest.com...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: "operations@urbannest.com",
    password: "SuperAdmin2026!",
  });

  if (authError) {
    console.error("Authentication failed:", authError);
    process.exit(1);
  }

  console.log(`Authenticated successfully! (User ID: ${authData.user.id})`);
  console.log(`Updating ${REPRICING_CATALOG.length} products with realistic Indian furniture pricing...`);

  let updatedCount = 0;
  for (const item of REPRICING_CATALOG) {
    const { data, error } = await supabase
      .from("products")
      .update({
        price: item.price,
        compare_at_price: item.compare_at_price,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", item.slug)
      .select("title, price, compare_at_price");

    if (error) {
      console.error(`Failed to update ${item.slug}:`, error.message);
    } else if (!data || data.length === 0) {
      console.warn(`Product not found for slug: ${item.slug}`);
    } else {
      const discount = item.compare_at_price
        ? Math.round(((item.compare_at_price - item.price) / item.compare_at_price) * 100) + "%"
        : "None";
      console.log(`✓ ${data[0].title}: ₹${item.price.toLocaleString("en-IN")} (Orig: ${item.compare_at_price ? "₹" + item.compare_at_price.toLocaleString("en-IN") : "-"}, Disc: ${discount})`);
      updatedCount++;
    }
  }

  console.log(`\nSuccessfully repriced ${updatedCount}/${REPRICING_CATALOG.length} products in Supabase.`);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
