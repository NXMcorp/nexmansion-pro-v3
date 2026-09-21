import { MetadataRoute } from "next";
import { getPublishedProperties, getActiveCollections } from "@/server/db/properties";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/collections/bali", "/villas", "/concierge", "/about", "/contact", "/help", "/privacy", "/terms", "/cookies"];
  const routes = staticRoutes.map(r => ({ url: `${base}${r}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.7 }));

  const collections = getActiveCollections();
  for (const c of collections) {
    routes.push({ url: `${base}/collections/${c.slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 });
  }

  const properties = getPublishedProperties();
  for (const p of properties) {
    routes.push({ url: `${base}/villas/${p.slug}`, lastModified: new Date(p.updated_at as string), changeFrequency: "weekly", priority: 0.9 });
  }

  return routes;
}
