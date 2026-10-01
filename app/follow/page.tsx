"use client";

import Link from "next/link";

export default function FollowPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png.png"
              alt="लोक मचान"
              className="h-16 w-auto object-contain"
            />

            <div>
              <h1 className="text-2xl font-extrabold text-black">
                लोक मचान
              </h1>
              <p className="text-sm text-gray-500">
                आपकी आवाज़, हमारा मंच
              </p>
            </div>
          </Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-97px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
            ❤️
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">
            हमें फ़ॉलो करें
          </h2>

          <p className="mx-auto mt-3 max-w-md text-gray-600">
            लोक मचान से जुड़े रहें और देश, राज्य, राजनीति,
            खेल, मनोरंजन और स्थानीय खबरों की ताज़ा जानकारी पाते रहें।
          </p>

          <div className="mt-8 space-y-4">
            <a
              href="https://youtube.com/@lokmachan?si=RMDX_hmXhDGxFGXB"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
            >
              ▶ YouTube पर हमें फ़ॉलो करें
            </a>

            <button
              type="button"
              className="block w-full rounded-lg bg-black px-4 py-3 font-bold text-white hover:bg-gray-800"
            >
              𝕏 हमें फ़ॉलो करें
            </button>

            <button
              type="button"
              className="block w-full rounded-lg bg-pink-600 px-4 py-3 font-bold text-white hover:bg-pink-700"
            >
              ◎ Instagram पर हमें फ़ॉलो करें
            </button>

            <button
              type="button"
              className="block w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700"
            >
              f Facebook पर हमें फ़ॉलो करें
            </button>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-500 hover:text-red-600"
            >
              ← होम पेज पर वापस जाएं
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
