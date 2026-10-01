"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const categoryMap: Record<string, string> = {
  "taza-khabrein": "à¤¤à¤¾à¤œà¤¼à¤¾ à¤–à¤¬à¤°à¥‡à¤‚",
  desh: "à¤¦à¥‡à¤¶",
  rajya: "à¤°à¤¾à¤œà¥à¤¯",
  duniya: "à¤¦à¥à¤¨à¤¿à¤¯à¤¾",
  "à¤°à¤¾à¤œà¤¨à¥€à¤¤à¤¿": "à¤°à¤¾à¤œà¤¨à¥€à¤¤à¤¿",
  apradh: "à¤…à¤ªà¤°à¤¾à¤§",
  vyapar: "à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°",
  khel: "à¤–à¥‡à¤²",
  manoranjan: "à¤®à¤¨à¥‹à¤°à¤‚à¤œà¤¨",
  technology: "à¤Ÿà¥‡à¤•à¥à¤¨à¥‹à¤²à¥‰à¤œà¥€",
  podcast: "ðŸŽ™ à¤ªà¥‰à¤¡à¤•à¤¾à¤¸à¥à¤Ÿ",
  video: "à¤µà¥€à¤¡à¤¿à¤¯à¥‹",
};

type News = {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  category: string;
};

type PodcastVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
};

export default function CategoryPage() {
  const params = useParams();

  const [news, setNews] = useState<News[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [podcastLoading, setPodcastLoading] = useState(false);

  const rawCategory = params.category;

  const category = Array.isArray(rawCategory)
    ? rawCategory[0]
    : String(rawCategory || "");

  const decodedCategory = decodeURIComponent(category);

  const categoryName =
    categoryMap[decodedCategory] || decodedCategory;

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);

        const response = await fetch("/api/news");
        const data = await response.json();

        if (!Array.isArray(data)) {
          setNews([]);
          return;
        }

        const filtered =
          decodedCategory === "taza-khabrein"
            ? data
            : data.filter(
                (item: News) =>
                  item.category?.trim() === categoryName.trim()
              );

        setNews(filtered);
      } catch (error) {
        console.error("Category news load error:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [decodedCategory, categoryName]);

  useEffect(() => {
    async function loadPodcasts() {
      if (decodedCategory !== "podcast") {
        setPodcasts([]);
        return;
      }
      try {
        setPodcastLoading(true);

        const response = await fetch("/api/youtube/podcasts");
        const data = await response.json();

        if (!Array.isArray(data)) {
          setPodcasts([]);
          return;
        }

        setPodcasts(data.slice(0, 6));
      } catch (error) {
        console.error("Podcast load error:", error);
        setPodcasts([]);
      } finally {
        setPodcastLoading(false);
      }
    }

    loadPodcasts();
  }, [decodedCategory]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10">

        <Link
          href="/"
          className="mb-6 inline-block font-medium text-red-600 hover:underline"
        >
          â† à¤¹à¥‹à¤® à¤ªà¤° à¤µà¤¾à¤ªà¤¸ à¤œà¤¾à¤à¤
        </Link>

        {/* CATEGORY HEADING */}
        <h1 className="mb-8 text-3xl font-extrabold text-black">
          {categoryName}
        </h1>

        {/* ================= PODCAST CATEGORY ================= */}
        {decodedCategory === "podcast" ? (
          <section>

            <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white p-6 shadow sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-2xl font-extrabold text-black">
                  ðŸŽ™ à¤¹à¤®à¤¾à¤°à¥‡ à¤¨à¤µà¥€à¤¨à¤¤à¤® à¤ªà¥‰à¤¡à¤•à¤¾à¤¸à¥à¤Ÿ
                </h2>

                <p className="mt-2 font-medium text-black">
                  Lok Machan à¤•à¥‡ YouTube à¤šà¥ˆà¤¨à¤² à¤¸à¥‡ à¤¨à¤µà¥€à¤¨à¤¤à¤® à¤µà¥€à¤¡à¤¿à¤¯à¥‹
                </p>
              </div>

              <a
                href="https://youtube.com/@lokmachan?si=RMDX_hmXhDGxFGXB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
              >
                â–¶ Visit for More
              </a>
            </div>

            {podcastLoading ? (
              <div className="rounded-lg bg-white p-8 text-center font-bold text-black shadow">
                à¤ªà¥‰à¤¡à¤•à¤¾à¤¸à¥à¤Ÿ à¤²à¥‹à¤¡ à¤¹à¥‹ à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚...
              </div>
            ) : podcasts.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center font-bold text-black shadow">
                à¤…à¤­à¥€ à¤•à¥‹à¤ˆ à¤ªà¥‰à¤¡à¤•à¤¾à¤¸à¥à¤Ÿ à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {podcasts.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative overflow-hidden">

                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-xl text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                          â–¶
                        </div>

                      </div>
                    </div>

                    <div className="p-5">

                      <h2 className="line-clamp-2 text-xl font-extrabold leading-snug text-black group-hover:text-red-600">
                        {video.title}
                      </h2>

                      <p className="mt-3 text-sm font-medium text-black">
                        {new Date(
                          video.publishedAt
                        ).toLocaleDateString("hi-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                    </div>
                  </a>
                ))}

              </div>
            )}

          </section>
        ) : (

          /* ================= NORMAL NEWS CATEGORIES ================= */

          <>
            {loading ? (
              <div className="rounded-lg bg-white p-8 text-center font-bold text-black shadow">
                à¤–à¤¬à¤°à¥‡à¤‚ à¤²à¥‹à¤¡ à¤¹à¥‹ à¤°à¤¹à¥€ à¤¹à¥ˆà¤‚...
              </div>
            ) : news.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center font-bold text-black shadow">
                à¤‡à¤¸ à¤•à¥ˆà¤Ÿà¥‡à¤—à¤°à¥€ à¤®à¥‡à¤‚ à¤…à¤­à¥€ à¤•à¥‹à¤ˆ à¤–à¤¬à¤° à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={"/news/" + item.slug}
                    className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
                  >

                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-52 w-full object-cover"
                      />
                    )}

                    <div className="p-5">

                      <p className="mb-2 text-sm font-bold text-red-600">
                        {item.category}
                      </p>

                      <h2 className="text-xl font-extrabold text-black">
                        {item.title}
                      </h2>

                    </div>

                  </Link>
                ))}

              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}



