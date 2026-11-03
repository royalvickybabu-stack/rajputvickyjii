"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NewsItem = {
  id: number;
  slug: string;
  title: string;
};

export default function LatestNewsTicker({
  news,
}: {
  news: NewsItem[];
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  function changeNews(step: number) {
    if (news.length < 2) return;

    setDirection(step > 0 ? "next" : "prev");
    setIndex((current) => (current + step + news.length) % news.length);
  }

  useEffect(() => {
    if (news.length < 2) return;

    const timer = setInterval(() => {
      setDirection("next");
      setIndex((current) => (current + 1) % news.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [news.length]);

  if (news.length === 0) return null;

  const currentNews = news[index];

  return (
    <div className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-2 py-2 sm:gap-3 sm:px-4 sm:py-3">
        <span className="shrink-0 whitespace-nowrap font-bold text-red-600">
          ताज़ा खबरें ⚡
        </span>

        <div className="min-w-0 flex-1 overflow-hidden text-sm">
          <Link
            key={currentNews.id}
            href={`/news/${encodeURIComponent(currentNews.slug.trim())}`}
            className={`block truncate hover:text-red-600 ${
              direction === "next"
                ? "animate-[ticker-next_350ms_ease-out]"
                : "animate-[ticker-prev_350ms_ease-out]"
            }`}
          >
            {currentNews.title}
          </Link>
        </div>

        {news.length > 1 && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => changeNews(-1)}
              aria-label="पिछली खबर"
              className="rounded px-2 py-1 font-bold text-gray-700 hover:bg-gray-100"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => changeNews(1)}
              aria-label="अगली खबर"
              className="rounded px-2 py-1 font-bold text-gray-700 hover:bg-gray-100"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes ticker-next {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes ticker-prev {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

