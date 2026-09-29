import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  const news = await prisma.news.findMany({
    where: {
      category: decodeURIComponent(category),
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (news.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
          <Link href="/">
            <img
              src="/logo.png.png"
              alt="लोक मचान"
              className="h-16 w-auto object-contain"
            />
          </Link>

          <div>
            <Link href="/">
              <h1 className="text-2xl font-extrabold text-black">
                लोक मचान
              </h1>
            </Link>

            <p className="text-sm text-gray-500">
              आपकी आवाज़, हमारा मंच
            </p>
          </div>
        </div>
      </header>

      {/* CATEGORY TITLE */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="border-l-4 border-red-600 pl-3 text-3xl font-bold">
          {decodeURIComponent(category)} की खबरें
        </h1>

        {/* NEWS GRID */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-52 w-full object-cover"
                />
              )}

              <div className="p-5">

                <div className="text-sm font-bold text-red-600">
                  {item.category}
                </div>

                <h2 className="mt-2 text-xl font-bold leading-tight">
                  {item.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-gray-600">
                  {item.content}
                </p>

                <div className="mt-4 text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString("hi-IN")}
                </div>

              </div>
            </Link>
          ))}

        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-10 bg-black px-4 py-8 text-center text-white">
        <h2 className="text-2xl font-bold text-red-500">
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