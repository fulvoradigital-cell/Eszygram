import { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = getAppUrl();
  const now = new Date();

  const routes = [
    "",
    "/pricing",
    "/features",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/cancellation-policy",
  ];

  return routes.map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/pricing" ? 0.9 : 0.8,
  }));
}

