
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import NewsShareActions from "@/app/components/NewsShareActions";
import NewsComments from "@/app/components/NewsComments";
import sanitizeHtml from "sanitize-html";
import { prisma } from "@/lib/prisma";
import { decodeNewsEntities } from "@/lib/news-content";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.lokmachan.in";

async function getNewsBySlug(rawSlug: string) {
  const decodedSlug = decodeURIComponent(rawSlug).trim();

  const news = await prisma.news.findUnique({
    where: {
      slug: decodedSlug,
    },
  });

  return news;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news || !news.published) {
    return {
      title: "खबर नहीं मिली | लोक मचान",
      description: "लोक मचान पर पढ़ें ताज़ा हिंदी खबरें और समाचार।",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const cleanText = (news.shortContent || news.content || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const description =
    cleanText.length > 0
      ? cleanText.slice(0, 155)
      : `${news.title} पढ़ें लोक मचान पर। ताज़ा हिंदी समाचार।`;

  const articleUrl = `${SITE_URL}/news/${encodeURIComponent(news.slug)}`;

  return {
    title: `${news.title} | लोक मचान`,
    description,
    alternates: {
      canonical: articleUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: news.title,
      description,
      url: articleUrl,
      siteName: "लोक मचान",
      locale: "hi_IN",
      type: "article",
      ...(news.image
        ? {
            images: [
              {
                url: news.image,
                alt: news.title,
              },
            ],
          }
        : {}),
      publishedTime: news.createdAt.toISOString(),
      modifiedTime: news.updatedAt.toISOString(),
    },
    twitter: {
      card: news.image ? "summary_large_image" : "summary",
      title: news.title,
      description,
      ...(news.image ? { images: [news.image] } : {}),
    },
  };
}

export default async function NewsPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news || !news.published) {
    notFound();
  }

  const content =
    news.content?.trim() ||
    news.shortContent?.trim() ||
    "इस खबर की जानकारी अभी उपलब्ध नहीं है।";

  const decodedContent = decodeNewsEntities(content);

  const containsHtml =
    /<\/?(p|br|strong|b|em|i|u|h[1-6]|ul|ol|li|a|blockquote|div)\b/i.test(
      decodedContent
    );

  const safeHtml = containsHtml
    ? sanitizeHtml(decodedContent, {
        allowedTags: [
          "p",
          "br",
          "strong",
          "b",
          "em",
          "i",
          "u",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "ul",
          "ol",
          "li",
          "a",
          "blockquote",
          "div",
        ],
        allowedAttributes: {
          a: ["href", "target", "rel"],
          "*": ["style"],
        },
        allowedSchemes: ["http", "https", "mailto"],
        allowedStyles: {
          "*": {
            "text-align": [/^(left|center|right|justify)$/],
          },
        },
        transformTags: {
          a: sanitizeHtml.simpleTransform("a", {
            rel: "noopener noreferrer",
            target: "_blank",
          }),
        },
      })
    : "";

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <article className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          {news.image ? (
            <img
              src={news.image}
              alt={news.title}
              className="max-h-[650px] w-full object-cover"
            />
          ) : (
            <div className="flex h-72 w-full items-center justify-center bg-gray-200 text-gray-500">
              खबर की तस्वीर उपलब्ध नहीं है
            </div>
          )}

          <div className="p-5 md:p-10">
            <NewsShareActions title={news.title} />

            <div className="mb-4">
              <span className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-600">
                {news.category}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-gray-950 md:text-5xl">
              {news.title}
            </h1>

            <div className="mt-5 border-b border-gray-200 pb-5 text-sm text-gray-500">
              प्रकाशित:{" "}
              {new Date(news.createdAt).toLocaleDateString("hi-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            <div className="mt-8">
              {containsHtml ? (
                <div
                  className="prose prose-lg max-w-none text-gray-800 md:prose-xl"
                  dangerouslySetInnerHTML={{ __html: safeHtml }}
                />
              ) : (
                <div className="whitespace-pre-line text-lg leading-8 text-gray-800 md:text-xl md:leading-9">
                  {decodedContent}
                </div>
              )}
            </div>

            <NewsComments slug={news.slug} />

            <div className="mt-10 border-t border-gray-200 pt-6">
              <Link
                href="/"
                className="inline-flex rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                ← सभी खबरें
              </Link>
            </div>
          </div>
        </div>
      </article>

      <footer className="mt-10 bg-black px-4 py-8 text-center text-white">
        <h2 className="text-2xl font-bold text-red-500">लोक मचान</h2>

        <p className="mt-2 text-sm text-gray-400">
          आपकी आवाज़, हमारा मंच
        </p>

        <p className="mt-4 text-xs text-gray-500">
          © 2026 Lok Machan. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
