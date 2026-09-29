import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const news = await prisma.news.findUnique({
    where: {
      slug,
    },
  });

  return {
    title: news ? `${news.title} | लोक मचान` : "लोक मचान",
    description: news
      ? news.content.slice(0, 160)
      : "लोक मचान पर पढ़ें ताज़ा खबरें और समाचार।",
  };
}

export default async function NewsPage({ params }: PageProps) {
  const { slug } = await params;

  const news = await prisma.news.findUnique({
    where: {
      slug,
    },
  });

  if (!news || !news.published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      {/* ================= HEADER ================= */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">

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

          <Link
            href="/"
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            ← होम
          </Link>

        </div>
      </header>

      {/* ================= ARTICLE ================= */}
      <article className="mx-auto max-w-4xl px-4 py-8">

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          {/* ARTICLE IMAGE */}
          {news.image ? (
            <img
              src={news.image}
              alt={news.title}
              className="h-auto max-h-[600px] w-full object-cover"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-gray-200 text-gray-500">
              खबर की तस्वीर उपलब्ध नहीं है
            </div>
          )}

          <div className="p-5 md:p-8">

            {/* CATEGORY */}
            <div className="mb-4 text-sm font-bold text-red-600">
              {news.category}
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
              {news.title}
            </h1>

            {/* DATE */}
            <div className="mt-4 border-b pb-5 text-sm text-gray-500">
              प्रकाशित:{" "}
              {new Date(news.createdAt).toLocaleDateString("hi-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            {/* CONTENT */}
            <div className="mt-8 whitespace-pre-line text-lg leading-8 text-gray-800 md:text-xl md:leading-9">
              {news.content}
            </div>

            {/* BACK BUTTON */}
            <div className="mt-10 border-t pt-6">

              <Link
                href="/"
                className="inline-flex rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                ← सभी खबरें पढ़ें
              </Link>

            </div>

          </div>

        </div>

      </article>

      {/* ================= FOOTER ================= */}
      <footer className="mt-10 bg-black px-4 py-8 text-center text-white">

        <h2 className="text-2xl font-bold text-red-500">
          लोक मचान
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          आपकी आवाज़, समाज की ताकत
        </p>

        <p className="mt-4 text-xs text-gray-500">
          © 2026 Lok Machan. All Rights Reserved.
        </p>

      </footer>

    </main>
  );
}