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
  { name: "संपर्क करें", href: "/contact" },
  { name: "About Us", href: "/about" },
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
      <div className="bg-black text-xs text-white sm:text-sm">
        <div className="mx-auto max-w-7xl px-3 py-2 sm:px-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
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
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-2 py-2 sm:flex-row sm:items-center sm:gap-0 sm:px-4 sm:py-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 sm:gap-3"
          >
            <img
              src="/logo.png.png"
              alt="लोक मचान"
              className="h-10 w-auto shrink-0 object-contain sm:h-20"
            />

            <div className="min-w-0">
              <h1 className="text-xl font-extrabold text-black sm:text-3xl">
                लोक मचान
              </h1>

              <p className="text-[11px] text-gray-500 sm:text-sm">
                आपकी आवाज़, हमारा मंच
              </p>
            </div>
          </Link>

          <div className="flex w-full flex-wrap items-center justify-center gap-1 sm:ml-auto sm:w-auto sm:flex-nowrap sm:gap-3">
            <NotificationButton />

            <Link
              href="/login"
              className="shrink-0 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 sm:px-4 sm:text-sm"
            >
              लॉगिन करें
            </Link>

            <Link
              href="/follow"
              className="shrink-0 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 sm:px-4 sm:text-sm"
            >
              हमें फ़ॉलो करें
            </Link>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-3 py-3 text-sm font-medium sm:gap-6 sm:px-4">
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
