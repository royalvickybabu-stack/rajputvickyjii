"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type News = {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  category: string;
  language: string;
  isTrending: boolean;
  published: boolean;
  createdAt: string;
};

export default function Home() {
  const [language, setLanguage] = useState<"hi" | "en">("hi");
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
        console.log("News API response:", data);

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

  const mainNews = news[0];
  const smallNews = news.slice(1, 4);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      {/* ================= TOP BAR ================= */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">

          <div>
            {new Date().toLocaleDateString("hi-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          <div className="flex gap-4">
            <span>f</span>
            <span>𝕏</span>
            <span>◎</span>
            <span>▶</span>
          </div>

        </div>
      </div>

      {/* ================= HEADER ================= */}
      <header className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4">

          <div className="flex items-center gap-3">

            <img
              src="/logo.png.png"
              alt="लोक मचान"
              className="h-20 w-auto object-contain"
            />

            <div>
              <h1 className="text-3xl font-extrabold text-black">
                लोक मचान
              </h1>

              <p className="text-sm text-gray-500">
                आपकी आवाज़, हमारा मंच
              </p>
            </div>

          </div>

          <div className="ml-auto flex items-center gap-3">

            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100">
              लॉगिन करें
            </button>

            <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              हमें फॉलो करें
            </button>

          </div>

        </div>
      </header>

      {/* ================= NAVIGATION ================= */}
      <nav className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3 text-sm font-medium">

          <span className="text-xl">⌂</span>

          <span>ताज़ा खबरें</span>
          <span>देश</span>
          <span>राज्य</span>
          <span>दुनिया</span>

          <Link href="/category/राजनीति">
            राजनीति
          </Link>

          <span>अपराध</span>
          <span>व्यापार</span>
          <span>खेल</span>
          <span>मनोरंजन</span>
          <span>टेक्नोलॉजी</span>
          <span>🎙 पॉडकास्ट</span>
          <span>वीडियो</span>

        </div>
      </nav>

      {/* ================= TRENDING ================= */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">

          <span className="whitespace-nowrap font-bold text-red-600">
            ट्रेंडिंग न्यूज़ ⚡
          </span>

          <div className="flex gap-6 overflow-hidden text-sm">

            {news
              .filter((item) => item.isTrending)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="whitespace-nowrap hover:text-red-600"
                >
                  {item.title}
                </Link>
              ))}

          </div>

        </div>
      </div>

      {/* ================= AD SPACE 1 ================= */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-24 w-full" />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="mx-auto max-w-7xl px-4 py-6">

        {/* TITLE + LANGUAGE */}
        <div className="mb-5 flex items-center justify-between">

          <h2 className="border-l-4 border-red-600 pl-3 text-2xl font-bold">
            मुख्य खबरें
          </h2>

          <div className="flex items-center gap-2 rounded-lg bg-white p-1 shadow">

            <button
              onClick={() => setLanguage("hi")}
              className={`rounded px-3 py-1 text-sm ${
                language === "hi"
                  ? "bg-red-600 text-white"
                  : "text-gray-600"
              }`}
            >
              हिंदी
            </button>

            <button
              onClick={() => setLanguage("en")}
              className={`rounded px-3 py-1 text-sm ${
                language === "en"
                  ? "bg-red-600 text-white"
                  : "text-gray-600"
              }`}
            >
              English
            </button>

          </div>

        </div>

        {/* ================= NEWS GRID ================= */}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            खबरें लोड हो रही हैं...
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            अभी कोई खबर उपलब्ध नहीं है।
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">

            {/* BIG NEWS */}
            {mainNews && (
              <Link
                href={`/news/${mainNews.slug}`}
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
                    {language === "hi"
                      ? mainNews.title
                      : "Big news update from Lok Machaan"}
                  </h3>

                  <p className="mt-3 line-clamp-2 text-gray-600">
                    {mainNews.content}
                  </p>

                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(mainNews.createdAt).toLocaleDateString("hi-IN")}
                  </div>

                </div>

              </Link>
            )}

            {/* SMALL NEWS */}
            <div className="space-y-4">

              {smallNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
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
                    {language === "hi"
                      ? item.title
                      : "Latest news update"}
                  </h3>

                </Link>
              ))}

            </div>

          </div>
        )}

        {/* ================= AD SPACE 2 ================= */}
        <div className="h-24 w-full" />

        {/* ================= LATEST NEWS ================= */}
        <section className="mt-8 rounded-xl bg-white p-5 shadow">

          <h2 className="mb-4 border-l-4 border-red-600 pl-3 text-2xl font-bold">
            ताज़ा खबरें
          </h2>

          <div className="divide-y">

            {news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="flex items-center justify-between gap-4 py-4 hover:text-red-600"
              >

                <h3 className="font-semibold">
                  {language === "hi"
                    ? item.title
                    : "Latest news update"}
                </h3>

                <span className="whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

              </Link>
            ))}

          </div>

        </section>

        {/* ================= AD SPACE 3 ================= */}
        <div className="h-24 w-full" />

      </div>

      {/* ================= FOOTER ================= */}
      <footer className="mt-10 bg-black px-4 py-8 text-center text-white">

        <h2 className="text-2xl font-bold text-white">
          लोक मचान
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          आपकी आवाज़, समाज की ताकत
        </p>

        <p className="mt-4 text-xs text-gray-500">
          © 2025 Lok Machan. All Rights Reserved.
        </p>

      </footer>

    </main>
  );
}