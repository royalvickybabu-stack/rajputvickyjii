
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";

type CommentItem = {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  isOwner: boolean;
};

type Props = {
  slug: string;
};

export default function NewsComments({ slug }: Props) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [content, setContent] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const commentsUrl = `/api/news/${encodeURIComponent(slug)}/comments`;

  const loadComments = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(commentsUrl, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Comments load nahi ho paaye.");
      }

      setComments(data.comments ?? []);
      setLoggedIn(Boolean(data.loggedIn));
      setError("");
    } catch {
      setError("Comments load nahi ho paaye. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  }, [commentsUrl]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const cleanContent = content.trim();

    if (!cleanContent) {
      setError("Kripya apna comment likhein.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(commentsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cleanContent }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Comment save nahi hua.");
      }

      setContent("");
      setNotice("Aapka comment safalta se post hua.");
      await loadComments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Comment save nahi hua. Dobara try karein."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(commentId: number) {
    const cleanContent = editContent.trim();

    if (!cleanContent) {
      setError("Comment khaali nahi ho sakta.");
      return;
    }

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${commentsUrl}/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: cleanContent }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Comment edit nahi hua.");
      }

      setEditingId(null);
      setEditContent("");
      setNotice("Comment update ho gaya.");
      await loadComments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Comment edit nahi hua."
      );
    }
  }

  async function handleDelete(commentId: number) {
    if (!window.confirm("Kya aap apna comment delete karna chahte hain?")) {
      return;
    }

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${commentsUrl}/${commentId}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Comment delete nahi hua.");
      }

      setNotice("Comment delete ho gaya.");
      await loadComments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Comment delete nahi hua."
      );
    }
  }

  return (
    <section
      id="comments"
      className="mt-10 scroll-mt-24 border-t border-gray-200 pt-8"
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        {"Comments ("}{comments.length}{")"}
      </h2>

      {loggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <label
              htmlFor="comment-content"
              className="mb-1 block font-medium text-gray-800"
            >
              Aapka comment
            </label>
            <textarea
              id="comment-content"
              required
              rows={4}
              maxLength={2000}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Apna comment likhein..."
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-right text-sm text-gray-500">
              {content.length}/2000
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Post ho raha hai..." : "Comment post karein"}
          </button>
        </form>
      ) : (
        <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="mb-3 text-gray-800">
            Comment karne ke liye pehle apne account mein login karein.
          </p>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(
              `/${slug}#comments`
            )}`}
            className="inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Login karein
          </Link>
          <p className="mt-3 text-sm text-gray-600">
            Naya account hai?{" "}
            <Link href="/register" className="font-semibold text-blue-700 underline">
              Register karein
            </Link>
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {notice && (
        <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {notice}
        </p>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600">Comments load ho rahe hain...</p>
        ) : comments.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-4 text-gray-600">
            Abhi tak koi comment nahi. Aap pehle comment karein.
          </p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-gray-900">{comment.name}</h3>
                <time
                  dateTime={comment.createdAt}
                  className="text-sm text-gray-500"
                >
                  {new Date(comment.createdAt).toLocaleString("hi-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>

              {editingId === comment.id ? (
                <div className="space-y-3">
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
                      onClick={() => void handleEdit(comment.id)}
                      className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                      className="rounded-lg border border-gray-300 px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap break-words text-gray-700">
                  {comment.content}
                </p>
              )}

              {comment.isOwner && editingId !== comment.id && (
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditContent(comment.content);
                      setError("");
                      setNotice("");
                    }}
                    className="text-sm font-semibold text-blue-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(comment.id)}
                    className="text-sm font-semibold text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
