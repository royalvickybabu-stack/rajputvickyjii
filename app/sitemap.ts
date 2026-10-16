import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.lokmachan.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const news = await prisma.news.findMany({
where: { published: true },
select: {
slug: true,
updatedAt: true,
},
orderBy: { updatedAt: "desc" },
});

const staticPages: MetadataRoute.Sitemap = [
{
url: SITE_URL,
lastModified: new Date(),
changeFrequency: "daily",
priority: 1,
},
{
url: `${SITE_URL}/follow`,
changeFrequency: "weekly",
priority: 0.5,
},
];

const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
url: `${SITE_URL}/news/${encodeURIComponent(item.slug)}`,
lastModified: item.updatedAt,
changeFrequency: "weekly",
priority: 0.8,
}));

return [...staticPages, ...newsPages];
}
