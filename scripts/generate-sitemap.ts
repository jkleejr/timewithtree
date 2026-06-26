// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://timewithtree.co.kr";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Product handles mirror src/data/products.ts. Update when products change.
const PRODUCT_HANDLES = ["jacquemontii-birch"];

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/shop", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/aeroponics", changefreq: "monthly", priority: "0.7" },
  { path: "/planting", changefreq: "monthly", priority: "0.7" },
  { path: "/pickup-guide", changefreq: "monthly", priority: "0.6" },
  { path: "/returns", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/order-lookup", changefreq: "monthly", priority: "0.4" },
  ...PRODUCT_HANDLES.map((handle) => ({
    path: `/product/${handle}`,
    changefreq: "weekly" as const,
    priority: "0.9",
  })),
];
// Note: /cart, /checkout, /order-success, /orders/:orderNumber, /auth, /account,
// /admin, and /unsubscribe are intentionally excluded — they are user-specific
// utility routes disallowed in public/robots.txt.

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
