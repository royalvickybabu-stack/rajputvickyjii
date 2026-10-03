"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const categoryMap: Record<string, string> = {
  "taza-khabrein": "ताज़ा खबरें",
  desh: "देश",
  rajya: "राज्य",
  duniya: "दुनिया",
  "राजनीति": "राजनीति",
  apradh: "अपराध",
  vyapar: "व्यापार",
  khel: "खेल",
  manoranjan: "मनोरंजन",
  technology: "टेक्नोलॉजी",
  podcast: "🎙 पॉडकास्ट",
  video: "वीडियो",
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
          ← होम पर वापस जाएँ
        </Link>

        <h1 className="mb-8 text-3xl font-extrabold text-black">
          {categoryName}
        </h1>

        {decodedCategory === "podcast" ? (
          <section>

            <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white p-6 shadow sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-2xl font-extrabold text-black">
                  🎙 हमारे नवीनतम पॉडकास्ट
                </h2>

                <p className="mt-2 font-medium text-black">
                  Lok Machan के YouTube चैनल से नवीनतम वीडियो
                </p>
              </div>

              <a
                href="https://youtube.com/@lokmachan?si=RMDX_hmXhDGxFGXB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
              >
                ▶ Visit for More
              </a>
            </div>

            {podcastLoading ? (
              <div className="rounded-lg bg-white p-8 text-center font-bold text-black shadow">
                पॉडकास्ट लोड हो रहे हैं...
              </div>
            ) : podcasts.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center font-bold text-black shadow">
                अभी कोई पॉडकास्ट उपलब्ध नहीं है।
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
                          ▶
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

          <>
            {loading ? (
              <div className="rounded-lg bg-white p-8 text-center font-bold text-black shadow">
                खबरें लोड हो रही हैं...
              </div>
            ) : news.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center font-bold text-black shadow">
                इस कैटेगरी में अभी कोई खबर उपलब्ध नहीं है।
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