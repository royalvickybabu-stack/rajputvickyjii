import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { stripNewsHtml } from "@/lib/news-content";
import LatestNewsTicker from "@/app/components/LatestNewsTicker";

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
  const sideNews = normalNews.slice(1, 5);
  const bottomNews = normalNews.slice(5, 10);
  const olderNews = normalNews.slice(10);



  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* TRENDING */}
<LatestNewsTicker news={normalNews.slice(0, 5)} />

{/* AD SPACE */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-8 w-full sm:h-24" />
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-2 py-2 sm:px-4 sm:py-6">
        {/* MAIN NEWS HEADER AND RESPONSIVE NEWS LAYOUT */}
        <section className="space-y-5">
          <h2 className="border-l-4 border-red-600 pl-3 text-xl font-bold sm:text-2xl">
            मुख्य खबरें
          </h2>

          {loadError ? (
            <div className="rounded-xl bg-white p-6 text-center shadow">
              खबरें अभी लोड नहीं हो पा रही हैं।
            </div>
          ) : normalNews.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-center shadow">
              अभी कोई मुख्य खबर उपलब्ध नहीं है।
            </div>
          ) : (
            <>
              {/* FEATURED NEWS + RIGHT SIDE NEWS */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_1fr]">
                {mainNews && (
                  <Link
                    href={getNewsUrl(mainNews.slug)}
                    className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
                  >
                    {mainNews.image ? (
                      <img
                        src={mainNews.image}
                        alt={mainNews.title}
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-gray-200 text-sm text-gray-500">
                        मुख्य समाचार की तस्वीर
                      </div>
                    )}

                    <div className="p-3 sm:p-4">
                      <span className="text-xs font-bold text-red-600">
                        {mainNews.category}
                      </span>
                      <h3 className="mt-1 text-lg font-bold leading-snug sm:text-xl">
                        {mainNews.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                        {stripNewsHtml(mainNews.content)}
                      </p>
                      <span className="mt-2 block text-xs text-gray-500">
                        {new Date(mainNews.createdAt).toLocaleDateString("hi-IN", { timeZone: "Asia/Kolkata" })}
                      </span>
                    </div>
                  </Link>
                )}

                <div className="divide-y rounded-xl bg-white px-3 shadow">
                  {sideNews.map((item) => (
                    <Link
                      key={item.id}
                      href={getNewsUrl(item.slug)}
                      className="flex gap-3 py-3 transition hover:text-red-600"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-20 w-24 shrink-0 rounded-md object-cover sm:h-24 sm:w-32"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500 sm:h-24 sm:w-32">
                          फोटो नहीं
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-red-600 sm:text-xs">
                          {item.category}
                        </span>
                        <h3 className="mt-1 line-clamp-3 text-sm font-semibold leading-snug">
                          {item.title}
                        </h3>
                        <span className="mt-1 block text-[10px] text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString("hi-IN", { timeZone: "Asia/Kolkata" })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* NEXT FIVE NEWS */}
              {bottomNews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {bottomNews.map((item) => (
                    <Link
                      key={item.id}
                      href={getNewsUrl(item.slug)}
                      className="overflow-hidden rounded-lg bg-white shadow transition hover:-translate-y-1 hover:shadow-md"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="aspect-video w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex aspect-video items-center justify-center bg-gray-200 text-xs text-gray-500">
                          न्यूज़ फोटो
                        </div>
                      )}
                      <div className="p-2 sm:p-3">
                        <span className="text-[10px] font-bold text-red-600">
                          {item.category}
                        </span>
                        <h3 className="mt-1 line-clamp-3 text-xs font-bold leading-snug sm:text-sm">
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* OLDER NEWS */}
              {olderNews.length > 0 && (
                <section>
                  <h3 className="mb-3 border-l-4 border-red-600 pl-3 text-lg font-bold">
                    अन्य खबरें
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {olderNews.map((item) => (
                      <Link
                        key={item.id}
                        href={getNewsUrl(item.slug)}
                        className="flex gap-2 rounded-lg bg-white p-2 shadow transition hover:text-red-600"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-14 w-16 shrink-0 rounded object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-14 w-16 shrink-0 rounded bg-gray-200" />
                        )}
                        <h3 className="line-clamp-3 text-xs font-semibold leading-snug">
                          {item.title}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </section>
        {/* SPACE */}
        <div className="h-8 w-full sm:h-24" />

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

