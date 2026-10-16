"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserComment = {
  id: number;
  content: string;
  createdAt: string;
  newsTitle: string;
  newsSlug: string;
  newsPublished: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [comments, setComments] = useState<UserComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/comments", {
        cache: "no-store",
      });
      const data = await response.json();

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "टिप्पणियाँ लोड नहीं हो पाईं।");
      }

      setComments(data.comments ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "टिप्पणियाँ लोड नहीं हो पाईं।"
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  async function handleEdit(comment: UserComment) {
    const content = editContent.trim();

    if (!content || content.length > 2000) {
      setError("टिप्पणी 1 से 2000 अक्षरों की होनी चाहिए।");
      return;
    }

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/news/${encodeURIComponent(comment.newsSlug)}/comments/${comment.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "टिप्पणी अपडेट नहीं हुई।");
      }

      setEditingId(null);
      setEditContent("");
      setNotice("टिप्पणी अपडेट हो गई।");
      await loadComments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "टिप्पणी अपडेट नहीं हुई।"
      );
    }
  }

  async function handleDelete(comment: UserComment) {
    if (!window.confirm("क्या आप अपनी टिप्पणी हटाना चाहते हैं?")) {
      return;
    }

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/news/${encodeURIComponent(comment.newsSlug)}/comments/${comment.id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "टिप्पणी हटाई नहीं जा सकी।");
      }

      setNotice("टिप्पणी हटा दी गई।");
      await loadComments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "टिप्पणी हटाई नहीं जा सकी।"
      );
    }
  }

  async function handleLogout() {
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("लॉगआउट नहीं हो पाया। कृपया दोबारा प्रयास करें।");
      }

      router.replace("/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "लॉगआउट नहीं हो पाया।"
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              मेरा डैशबोर्ड
            </h1>
            <p className="mt-1 text-gray-600">
              आपकी टिप्पणियाँ और समाचार गतिविधियाँ
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
            >
              होम
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            >
              लॉगआउट
            </button>
          </div>
        </header>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {notice && (
          <p role="status" className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
            {notice}
          </p>
        )}

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              मेरी टिप्पणियाँ
            </h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              कुल {comments.length}
            </span>
          </div>

          {loading ? (
            <p className="text-gray-600">टिप्पणियाँ लोड हो रही हैं...</p>
          ) : comments.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <p className="text-gray-700">
                आपने अभी तक कोई टिप्पणी नहीं की है।
              </p>
              <Link
                href="/"
                className="mt-3 inline-block font-semibold text-blue-700 hover:underline"
              >
                समाचार पढ़ना शुरू करें
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString("hi-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-gray-900">
                    {comment.newsTitle}
                  </h3>

                  {editingId === comment.id ? (
                    <div className="mt-3 space-y-3">
                      <textarea
                        rows={4}
                        maxLength={2000}
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void handleEdit(comment)}
                          className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white"
                        >
                          सेव करें
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setEditContent("");
                          }}
                          className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                          रद्द करें
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 whitespace-pre-wrap break-words text-gray-700">
                      {comment.content}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    {comment.newsPublished ? (
                      <Link
                        href={`/${comment.newsSlug}#comments`}
                        className="font-semibold text-blue-700 hover:underline"
                      >
                        समाचार और टिप्पणियाँ देखें
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-500">
                        यह समाचार अब प्रकाशित नहीं है।
                      </span>
                    )}

                    {editingId !== comment.id && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditContent(comment.content);
                            setError("");
                            setNotice("");
                          }}
                          className="font-semibold text-blue-700 hover:underline"
                        >
                          संपादित करें
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(comment)}
                          className="font-semibold text-red-700 hover:underline"
                        >
                          हटाएँ
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}