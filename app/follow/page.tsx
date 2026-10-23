"use client";

import Link from "next/link";

export default function FollowPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
            ❤️
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            हमें फ़ॉलो करें
          </h1>

          <p className="mx-auto mt-3 max-w-md text-gray-600">
            लोक मचान से जुड़े रहें और देश, राज्य, राजनीति, खेल,
            मनोरंजन और स्थानीय खबरों की ताज़ा जानकारी पाते रहें।
          </p>

          <div className="mt-8 space-y-4">
            <a
              href="https://youtube.com/@lokmachan?si=RMDX_hmXhDGxFGXB"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-700"
            >
              YouTube पर Subscribe करें
            </a>

            <a
              href="https://x.com/lokmachan?s=11"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-black px-4 py-3 font-bold text-white transition hover:bg-gray-800"
            >
              X पर हमें Follow करें
            </a>

            <a
              href="https://www.instagram.com/lokmachan?stkn=b3Yyb2hhMWVjb2hx&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-pink-600 px-4 py-3 font-bold text-white transition hover:bg-pink-700"
            >
              Instagram पर हमें Follow करें
            </a>

            <a
              href="https://www.facebook.com/share/1AxdfUbAvJ/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Facebook पर हमें Follow करें
            </a>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-500 hover:text-red-600"
            >
              ← होमपेज पर वापस जाएँ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
