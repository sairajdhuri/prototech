import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/about", "/capabilities", "/machinery", "/products", "/customers", "/contact", "/quote", "/privacy", "/terms", "/credits"].map(route => ({ url: `${siteUrl}${route}`, changeFrequency: route === "" ? "monthly" : "yearly", priority: route === "" ? 1 : ["/capabilities", "/quote"].includes(route) ? 0.9 : 0.6 })); }
