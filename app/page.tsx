
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { stripNewsHtml } from "@/lib/news-content";

export const dynamic = "force-dynamic";

function getNewsUrl(slug: string) {
  return `/news/${encodeURIComponent(slug.trim())}`;
}

export default async function Home() {
  let news: Awaited<ReturnType<typeof prisma.news.findMany>> = [];
  let loadError = false;

  try {
    news = await prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Homepage news loading error:", error);
    loadError = true;
  }

  const shortNews = news.filter(
    (item) => item.shortContent?.trim()
  );

  const normalNews = news.filter(
    (item) => !item.shortContent?.trim()
  );

  const mainNews = normalNews[0];
  const smallNews = normalNews.slice(1, 6);

  const trendingNews = normalNews
    .filter((item) => item.isTrending)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* TRENDING */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-2 py-2 sm:gap-4 sm:px-4 sm:py-3">
          <span className="whitespace-nowrap font-bold text-red-600">
            ट्रेंडिंग न्यूज़ ⚡
          </span>

          <div className="flex gap-6 overflow-hidden text-sm">
            {trendingNews.map((item) => (
              <Link
                key={item.id}
                href={getNewsUrl(item.slug)}
                className="whitespace-nowrap hover:text-red-600"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* AD SPACE */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-8 w-full sm:h-24" />
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-2 py-2 sm:px-4 sm:py-6">
        {/* MAIN NEWS HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="border-l-4 border-red-600 pl-3 text-2xl font-bold">
            मुख्य खबरें
          </h2>
        </div>

        
{/* NEWS */}
{loadError ? (
  <div className="rounded-xl bg-white p-8 text-center shadow">
    खबरें अभी लोड नहीं हो पा रही हैं। कृपया कुछ देर बाद फिर कोशिश करें।
  </div>
) : normalNews.length === 0 ? (
  <div className="rounded-xl bg-white p-8 text-center shadow">
    अभी कोई मुख्य खबर उपलब्ध नहीं है।
  </div>
) : (
  <div className="space-y-6">
    {/* FEATURED MAIN NEWS */}
    {mainNews && (
      <Link
        href={getNewsUrl(mainNews.slug)}
        className="block overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
      >
        {mainNews.image ? (
          <img
            src={mainNews.image}
            alt={mainNews.title}
            className="aspect-[16/7] w-full object-cover sm:aspect-[16/6] lg:aspect-[16/5]"
          />
        ) : (
          <div className="flex aspect-[16/7] items-center justify-center bg-gray-200 text-gray-500">
            मुख्य समाचार की तस्वीर
          </div>
        )}

        <div className="p-4 sm:p-5">
          <span className="text-sm font-bold text-red-600">
            {mainNews.category}
          </span>

          <h3 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">
            {mainNews.title}
          </h3>

          <p className="mt-3 line-clamp-3 leading-7 text-gray-600">
            {stripNewsHtml(mainNews.content)}
          </p>

          <div className="mt-3 text-sm text-gray-500">
            {new Date(mainNews.createdAt).toLocaleDateString("hi-IN")}
          </div>
        </div>
      </Link>
    )}

    {/* MORE NEWS WITH IMAGES */}
    {smallNews.length > 0 && (
      <section>
        <h2 className="mb-4 border-l-4 border-red-600 pl-3 text-xl font-bold">
          और मुख्य खबरें
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {smallNews.map((item) => (
            <Link
              key={item.id}
              href={getNewsUrl(item.slug)}
              className="overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-gray-200 text-sm text-gray-500">
                  न्यूज़ फोटो
                </div>
              )}

              <div className="p-3 sm:p-4">
                <span className="text-xs font-bold text-red-600">
                  {item.category}
                </span>

                <h3 className="mt-1 line-clamp-3 font-bold leading-snug">
                  {item.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                  {stripNewsHtml(item.content)}
                </p>

                <span className="mt-3 inline-block text-sm font-semibold text-red-600">
                  पूरी खबर पढ़ें →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )}
  </div>
)}


        {/* SPACE */}
        <div className="h-8 w-full sm:h-24" />

        {/* LATEST NEWS */}
        <section className="rounded-xl bg-white p-5 shadow">
          <h2 className="mb-4 border-l-4 border-red-600 pl-3 text-2xl font-bold">
            ताज़ा खबरें
          </h2>

          {loadError ? (
            <p className="py-4 text-gray-600">
              ताज़ा खबरें अभी उपलब्ध नहीं हैं।
            </p>
          ) : normalNews.length === 0 ? (
            <p className="py-4 text-gray-600">
              अभी कोई ताज़ा खबर उपलब्ध नहीं है।
            </p>
          ) : (
            <div className="divide-y">
              {normalNews.map((item) => (
                <Link
                  key={item.id}
                  href={getNewsUrl(item.slug)}
                  className="flex items-center justify-between gap-4 py-4 hover:text-red-600"
                >
                  <h3 className="font-semibold">{item.title}</h3>

                  <span className="whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Kolkata",
                    })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* NEWS IN 60 WORDS */}
        {shortNews.length > 0 && (
          <section className="mt-8">
            <div className="mb-5">
              <h2 className="inline-block border-b-4 border-red-600 pb-2 text-2xl font-extrabold">
                News in 60 words
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shortNews.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href={getNewsUrl(item.slug)}
                  className="block overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gray-300 text-sm text-gray-500">
                      न्यूज़ फोटो
                    </div>
                  )}

                  <div className="p-5">
                    <span className="text-xs font-bold text-red-600">
                      {item.category}
                    </span>

                    <h3 className="mt-2 text-lg font-bold leading-snug">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                      {stripNewsHtml(item.shortContent ?? "")}
                    </p>

                    <div className="mt-4 inline-flex rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white">
                      पढ़ें पूरी खबर →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      
      {/* FOOTER */}
      <footer className="mt-10 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">
            लोक मचान
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            आपकी आवाज़, हमारा मंच
          </p>

          <nav
            aria-label="Footer navigation"
            className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm"
          >
            <Link
              href="/about"
              className="text-gray-700 hover:text-red-600"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-red-600"
            >
              Contact Us
            </Link>

            <Link
              href="/privacy-policy"
              className="text-gray-700 hover:text-red-600"
            >
              Privacy Policy
            </Link>
          </nav>

          <p className="mt-4 text-sm text-gray-500">
            © 2026 Lok Machan. All Rights Reserved.
          </p>
        </div>
      </footer>


    </main>
  );
}
