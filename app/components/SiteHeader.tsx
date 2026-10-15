"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NotificationButton from "./NotificationButton";

const categories = [
  { name: "ताज़ा खबरें", href: "/category/taza-khabrein" },
  { name: "देश", href: "/category/desh" },
  { name: "राज्य", href: "/category/rajya" },
  { name: "दुनिया", href: "/category/duniya" },
  { name: "राजनीति", href: "/category/राजनीति" },
  { name: "अपराध", href: "/category/apradh" },
  { name: "व्यापार", href: "/category/vyapar" },
  { name: "खेल", href: "/category/khel" },
  { name: "मनोरंजन", href: "/category/manoranjan" },
  { name: "टेक्नोलॉजी", href: "/category/technology" },
  { name: "🎙 पॉडकास्ट", href: "/category/podcast" },
];

export default function SiteHeader() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* DATE + LIVE TIME */}
      <div className="bg-black text-sm text-white">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="flex items-center gap-2">
            {currentTime ? (
              <>
                <span>
                  {currentTime.toLocaleDateString("hi-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <span className="text-gray-400">|</span>

                <span className="font-medium">
                  {currentTime.toLocaleTimeString("hi-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
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
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <NotificationButton />

            <Link
              href="/login"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              लॉगिन करें
            </Link>

            <Link
              href="/follow"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              हमें फ़ॉलो करें
            </Link>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3 text-sm font-medium">
          <Link
            href="/"
            className="shrink-0 text-xl hover:text-red-400"
            aria-label="होम"
          >
            ⌂
          </Link>

          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="shrink-0 whitespace-nowrap transition hover:text-red-400"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}