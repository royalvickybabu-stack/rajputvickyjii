"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { stripNewsHtml } from "@/lib/news-content";

type News = {
  id: number;
  title: string;
  slug: string;
  content: string;
  shortContent: string | null;
  image: string | null;
  category: string;
  language: string;
  isTrending: boolean;
  published: boolean;
  createdAt: string;
};

function getNewsUrl(slug: string) {
  return `/news/${encodeURIComponent(slug.trim())}`;
}

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`News API failed: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          setNews([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("News loading error:", error);
        setNews([]);
        setLoading(false);
      });
  }, []);

  const shortNews = news.filter(
    (item) =>
      item.shortContent &&
      item.shortContent.trim() !== ""
  );

  const normalNews = news.filter(
    (item) =>
      !item.shortContent ||
      item.shortContent.trim() === ""
  );

  const mainNews = normalNews[0];
  const smallNews = normalNews.slice(1, 4);

  const trendingNews = normalNews
    .filter((item) => item.isTrending)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      {/* TRENDING */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">

          <span className="whitespace-nowrap font-bold text-red-600">
            ट्रेंडिंग न्यूज़ ⚡
          </span>

          <div className="flex gap-6 overflow-hidden text-sm">

            {trendingNews.map((item) => (
              <Link
                key={item.id}
                href={getNewsUrl(item.slug)}
                className="whitespace-nowrap hover:text-red-600"
              >
                {item.title}
              </Link>
            ))}

          </div>

        </div>
      </div>

      {/* AD SPACE */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-8 w-full sm:h-24" />
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-6">

        {/* MAIN NEWS HEADER */}
        <div className="mb-5 flex items-center justify-between">

          <h2 className="border-l-4 border-red-600 pl-3 text-2xl font-bold">
            मुख्य खबरें
          </h2>

        </div>

        {/* NEWS */}
        {loading ? (

          <div className="rounded-xl bg-white p-10 text-center shadow">
            खबरें लोड हो रही हैं...
          </div>

        ) : normalNews.length === 0 ? (

          <div className="rounded-xl bg-white p-10 text-center shadow">
            अभी कोई मुख्य खबर उपलब्ध नहीं है।
          </div>

        ) : (

          <div className="grid gap-6 lg:grid-cols-3">

            {/* MAIN NEWS */}
            {mainNews && (
              <Link
                href={getNewsUrl(mainNews.slug)}
                className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg lg:col-span-2"
              >

                {mainNews.image ? (
                  <img
                    src={mainNews.image}
                    alt={mainNews.title}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-gray-300 text-gray-500">
                    मुख्य समाचार की तस्वीर
                  </div>
                )}

                <div className="p-5">

                  <span className="text-sm font-bold text-red-600">
                    {mainNews.category}
                  </span>

                  <h3 className="mt-2 text-2xl font-bold leading-tight">
                    {mainNews.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 text-gray-600">
                    {stripNewsHtml(mainNews.content)}
                  </p>

                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(
                      mainNews.createdAt
                    ).toLocaleDateString("hi-IN")}
                  </div>

                </div>

              </Link>
            )}

            {/* SMALL NEWS */}
            <div className="space-y-4">

              {smallNews.map((item) => (
                <Link
                  key={item.id}
                  href={getNewsUrl(item.slug)}
                  className="block rounded-xl bg-white p-4 shadow transition hover:shadow-lg"
                >

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mb-3 h-28 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-gray-300 text-sm text-gray-500">
                      न्यूज़ फोटो
                    </div>
                  )}

                  <span className="text-xs font-bold text-red-600">
                    {item.category}
                  </span>

                  <h3 className="mt-1 font-bold">
                    {item.title}
                  </h3>

                </Link>
              ))}

            </div>

          </div>

        )}

        {/* SPACE */}
        <div className="h-8 w-full sm:h-24" />

        {/* LATEST NEWS */}
        <section className="rounded-xl bg-white p-5 shadow">

          <h2 className="mb-4 border-l-4 border-red-600 pl-3 text-2xl font-bold">
            ताज़ा खबरें
          </h2>

          <div className="divide-y">

            {normalNews.map((item) => (
              <Link
                key={item.id}
                href={getNewsUrl(item.slug)}
                className="flex items-center justify-between gap-4 py-4 hover:text-red-600"
              >

                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <span className="whitespace-nowrap text-sm text-gray-500">
                  {new Date(
                    item.createdAt
                  ).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

              </Link>
            ))}

          </div>

        </section>

        {/* NEWS IN 60 WORDS */}
        {shortNews.length > 0 && (

          <section className="mt-8">

            <div className="mb-5">

              <h2 className="inline-block border-b-4 border-red-600 pb-2 text-2xl font-extrabold">
                News in 60 words
              </h2>

            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {shortNews.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href={getNewsUrl(item.slug)}
                  className="block overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gray-300 text-sm text-gray-500">
                      न्यूज़ फोटो
                    </div>
                  )}

                  <div className="p-5">

                    <span className="text-xs font-bold text-red-600">
                      {item.category}
                    </span>

                    <h3 className="mt-2 text-lg font-bold leading-snug">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                      {stripNewsHtml(item.shortContent)}
                    </p>

                    <div className="mt-4 inline-flex rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white">
                      पढ़ें पूरी खबर →
                    </div>

                  </div>

                </Link>
              ))}

            </div>

          </section>

        )}

      </div>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-8 text-center">

          <h2 className="text-2xl font-extrabold text-gray-900">
            लोक मचान
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            आपकी आवाज़, हमारा मंच
          </p>

          <p className="mt-4 text-sm text-gray-500">
            © 2026 Lok Machan. All Rights Reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}
