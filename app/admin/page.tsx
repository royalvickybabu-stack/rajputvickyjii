"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type News = {
  id: number;
  title: string;
  slug: string;
  content: string;
  shortContent: string | null;
  image: string | null;
  category: string;
  language: string;
  isTrending: boolean;
  published: boolean;
  createdAt: string;
};

const hindiToEnglish: Record<string, string> = {
  "à¤…": "a",
  "à¤†": "aa",
  "à¤‡": "i",
  "à¤ˆ": "ee",
  "à¤‰": "u",
  "à¤Š": "oo",
  "à¤": "e",
  "à¤": "ai",
  "à¤“": "o",
  "à¤”": "au",
  "à¤•": "k",
  "à¤–": "kh",
  "à¤—": "g",
  "à¤˜": "gh",
  "à¤™": "n",
  "à¤š": "ch",
  "à¤›": "chh",
  "à¤œ": "j",
  "à¤": "jh",
  "à¤ž": "n",
  "à¤Ÿ": "t",
  "à¤ ": "th",
  "à¤¡": "d",
  "à¤¢": "dh",
  "à¤£": "n",
  "à¤¤": "t",
  "à¤¥": "th",
  "à¤¦": "d",
  "à¤§": "dh",
  "à¤¨": "n",
  "à¤ª": "p",
  "à¤«": "ph",
  "à¤¬": "b",
  "à¤­": "bh",
  "à¤®": "m",
  "à¤¯": "y",
  "à¤°": "r",
  "à¤²": "l",
  "à¤µ": "v",
  "à¤¶": "sh",
  "à¤·": "sh",
  "à¤¸": "s",
  "à¤¹": "h",
  "à¤•à¥à¤·": "ksh",
  "à¤¤à¥à¤°": "tr",
  "à¤œà¥à¤ž": "gy",
  "à¤¾": "a",
  "à¤¿": "i",
  "à¥€": "i",
  "à¥": "u",
  "à¥‚": "u",
  "à¥ƒ": "ri",
  "à¥‡": "e",
  "à¥ˆ": "ai",
  "à¥‹": "o",
  "à¥Œ": "au",
  "à¤‚": "n",
  "à¤ƒ": "h",
  "à¤": "n",
  "à¥": "",
  "à¥¤": " ",
};

function generateEnglishSlug(text: string) {
  let result = "";

  for (const char of text) {
    if (hindiToEnglish[char] !== undefined) {
      result += hindiToEnglish[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      result += char.toLowerCase();
    } else if (char === " ") {
      result += "-";
    } else {
      result += "-";
    }
  }

  return result
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

const categoryOptions = [
  "à¤¤à¤¾à¤œà¤¼à¤¾ à¤–à¤¬à¤°à¥‡à¤‚",
  "à¤¦à¥‡à¤¶",
  "à¤°à¤¾à¤œà¥à¤¯",
  "à¤‰à¤¤à¥à¤¤à¤° à¤ªà¥à¤°à¤¦à¥‡à¤¶",
  "à¤¦à¥à¤¨à¤¿à¤¯à¤¾",
  "à¤°à¤¾à¤œà¤¨à¥€à¤¤à¤¿",
  "à¤…à¤ªà¤°à¤¾à¤§",
  "à¤µà¥à¤¯à¤¾à¤ªà¤¾à¤°",
  "à¤–à¥‡à¤²",
  "à¤®à¤¨à¥‹à¤°à¤‚à¤œà¤¨",
  "à¤Ÿà¥‡à¤•à¥à¤¨à¥‹à¤²à¥‰à¤œà¥€",
  "à¤¶à¤¿à¤•à¥à¤·à¤¾",
  "à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯",
  "à¤§à¤°à¥à¤®",
  "à¤²à¤¾à¤‡à¤«à¤¸à¥à¤Ÿà¤¾à¤‡à¤²",
  "à¤ªà¥‰à¤¡à¤•à¤¾à¤¸à¥à¤Ÿ",
  "à¤µà¥€à¤¡à¤¿à¤¯à¥‹",
];

export default function AdminPage() {
  const [news, setNews] = useState<News[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [shortContent, setShortContent] = useState("");

  const [is60Words, setIs60Words] = useState(false);

  const [image, setImage] = useState("");
  const [language, setLanguage] = useState("hi");
  const [isTrending, setIsTrending] = useState(false);
  const [published, setPublished] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [trendingFilter, setTrendingFilter] = useState("all");

  async function loadNews() {
    try {
      const response = await fetch("/api/news?admin=true");
      const data = await response.json();

      if (Array.isArray(data)) {
        setNews(data);
      }
    } catch (error) {
      console.error("News load error:", error);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      loadNews();
    }, 0);
  }, []);

  function resetForm() {
    setTitle("");
    setSlug("");
    setCategory("");
    setContent("");
    setShortContent("");
    setIs60Words(false);
    setImage("");
    setLanguage("hi");
    setIsTrending(false);
    setPublished(true);
    setEditingId(null);
    setSelectedFile(null);
    setImagePreview("");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!editingId) {
      setSlug(generateEnglishSlug(value));
    }
  }

  function handleFileChange(file: File | null) {
    if (!file) {
      setSelectedFile(null);
      setImagePreview("");
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function handleShortContentChange(value: string) {
    setShortContent(value);
  }

  function handleShortContentPaste(
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) {
    event.preventDefault();

    const pastedText =
      event.clipboardData.getData("text/plain");

    const textarea = event.currentTarget;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue =
      shortContent.slice(0, start) +
      pastedText +
      shortContent.slice(end);

    setShortContent(newValue);

    requestAnimationFrame(() => {
      const cursorPosition =
        start + pastedText.length;

      textarea.focus();
      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    });
  }

  async function uploadImage() {
    if (!selectedFile) {
      return image;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Image upload à¤¨à¤¹à¥€à¤‚ à¤¹à¥à¤ˆ");
        return null;
      }

      setImage(data.url);
      return data.url;
    } catch (error) {
      console.error(error);
      alert("Image upload à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¹à¥à¤ˆ");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Headline à¤¡à¤¾à¤²à¥‡à¤‚");
      return;
    }

    if (!category.trim()) {
      alert("Category à¤šà¥à¤¨à¥‡à¤‚");
      return;
    }

    if (is60Words) {
      if (!shortContent.trim()) {
        alert("News in 60 Words à¤µà¤¾à¤²à¤¾ content à¤¡à¤¾à¤²à¥‡à¤‚");
        return;
      }

      const wordCount = shortContent
        .trim()
        .split(/\s+/)
        .length;

      if (wordCount > 60) {
        alert(
          "News in 60 Words à¤®à¥‡à¤‚ à¤…à¤§à¤¿à¤•à¤¤à¤® 60 words à¤¹à¥‹à¤¨à¥‡ à¤šà¤¾à¤¹à¤¿à¤à¥¤ à¤…à¤­à¥€ " +
            wordCount +
            " words à¤¹à¥ˆà¤‚à¥¤"
        );
        return;
      }
    }

    if (!is60Words && !content.trim()) {
      alert("News content à¤¡à¤¾à¤²à¥‡à¤‚");
      return;
    }

    setLoading(true);

    try {
      let finalImage = image;

      if (selectedFile) {
        finalImage = await uploadImage();

        if (finalImage === null) {
          setLoading(false);
          return;
        }
      }

      const payload = {
        title,
        slug: slug || generateEnglishSlug(title),
        category,
        content: is60Words ? "" : content.trim(),
        shortContent: is60Words
          ? shortContent.trim()
          : null,
        image: finalImage || null,
        language,
        isTrending,
        published,
      };

      const response = await fetch("/api/news", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId
            ? {
                ...payload,
                id: editingId,
              }
            : payload
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "News save à¤¨à¤¹à¥€à¤‚ à¤¹à¥à¤ˆ");
        return;
      }

      alert(
        editingId
          ? "News update à¤¹à¥‹ à¤—à¤ˆ"
          : "News save à¤¹à¥‹ à¤—à¤ˆ"
      );

      resetForm();
      await loadNews();
    } catch (error) {
      console.error(error);
      alert("News save à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¹à¥à¤ˆ");
    } finally {
      setLoading(false);
    }
  }

  function editNews(item: News) {
    setEditingId(item.id);

    setTitle(item.title);
    setSlug(item.slug);
    setCategory(item.category);
    setContent(item.content);
    setShortContent(item.shortContent || "");

    setIs60Words(
      Boolean(
        item.shortContent &&
          item.shortContent.trim() !== ""
      )
    );

    setImage(item.image || "");
    setLanguage(item.language);
    setIsTrending(item.isTrending);
    setPublished(item.published);

    setSelectedFile(null);
    setImagePreview(item.image || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteNews(id: number) {
    const confirmDelete = window.confirm(
      "à¤•à¥à¤¯à¤¾ à¤†à¤ª à¤‡à¤¸ à¤–à¤¬à¤° à¤•à¥‹ delete à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch("/api/news", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Delete à¤¨à¤¹à¥€à¤‚ à¤¹à¥à¤ˆ");
        return;
      }

      alert("News delete à¤¹à¥‹ à¤—à¤ˆ");

      await loadNews();
    } catch (error) {
      console.error(error);
      alert("Delete à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¸à¤®à¤¸à¥à¤¯à¤¾ à¤¹à¥à¤ˆ");
    }
  }

  async function togglePublished(item: News) {
    try {
      const response = await fetch("/api/news", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          slug: item.slug,
          category: item.category,
          content: item.content,
          shortContent: item.shortContent,
          image: item.image,
          language: item.language,
          isTrending: item.isTrending,
          published: !item.published,
        }),
      });

      if (!response.ok) {
        alert("Status update à¤¨à¤¹à¥€à¤‚ à¤¹à¥à¤†");
        return;
      }

      await loadNews();
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleTrending(item: News) {
    try {
      const response = await fetch("/api/news", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          slug: item.slug,
          category: item.category,
          content: item.content,
          shortContent: item.shortContent,
          image: item.image,
          language: item.language,
          isTrending: !item.isTrending,
          published: item.published,
        }),
      });

      if (!response.ok) {
        alert("Trending status update à¤¨à¤¹à¥€à¤‚ à¤¹à¥à¤†");
        return;
      }

      await loadNews();
    } catch (error) {
      console.error(error);
    }
  }

  const categories = Array.from(
    new Set(
      news
        .map((item) => item.category)
        .filter(
          (item) =>
            item && item.trim() !== ""
        )
    )
  );

  const filteredNews = news.filter((item) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      item.title.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText) ||
      item.slug.toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "all" ||
      item.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" &&
        item.published) ||
      (statusFilter === "unpublished" &&
        !item.published);

    const matchesTrending =
      trendingFilter === "all" ||
      (trendingFilter === "trending" &&
        item.isTrending) ||
      (trendingFilter === "normal" &&
        !item.isTrending);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesTrending
    );
  });

  const shortWordCount = shortContent.trim()
    ? shortContent.trim().split(/\s+/).length
    : 0;

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-3xl font-extrabold">
              à¤²à¥‹à¤• à¤®à¤šà¤¾à¤¨ Admin
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              News Management Panel
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-black px-5 py-2.5 font-semibold text-white transition hover:bg-gray-800"
          >
            Website
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <section className="rounded-2xl bg-white p-5 shadow md:p-7">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {editingId
                  ? "à¤–à¤¬à¤° Edit à¤•à¤°à¥‡à¤‚"
                  : "à¤¨à¤ˆ à¤–à¤¬à¤° à¤œà¥‹à¤¡à¤¼à¥‡à¤‚"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Headline à¤¡à¤¾à¤²à¤¤à¥‡ à¤¹à¥€ English slug à¤…à¤ªà¤¨à¥‡ à¤†à¤ª à¤¬à¤¨à¥‡à¤—à¤¾à¥¤
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-100"
              >
                Edit Cancel
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block font-semibold">
                Headline / à¤–à¤¬à¤° à¤•à¥€ à¤¹à¥‡à¤¡à¤²à¤¾à¤‡à¤¨
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  handleTitleChange(e.target.value)
                }
                placeholder="à¤‰à¤¦à¤¾à¤¹à¤°à¤£: à¤¯à¥‚à¤ªà¥€ à¤®à¥‡à¤‚ à¤µà¤¿à¤§à¤¾à¤¨à¤¸à¤­à¤¾ à¤šà¥à¤¨à¤¾à¤µ à¤•à¥€ à¤¤à¥ˆà¤¯à¤¾à¤°à¥€ à¤¤à¥‡à¤œ"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                English Slug
              </label>

              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value)
                }
                placeholder="up-me-vidhansabha-chunav-ki-taiyari-tez"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-red-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                URL: /news/
                {slug || "your-news-slug"}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500"
                >
                  <option value="">
                    Category à¤šà¥à¤¨à¥‡à¤‚
                  </option>

                  {categoryOptions.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Language
                </label>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500"
                >
                  <option value="hi">
                    Hindi
                  </option>

                  <option value="en">
                    English
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                News Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) =>
                  handleFileChange(
                    e.target.files?.[0] || null
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white p-3"
              />

              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, WEBP à¤¯à¤¾ GIF - maximum 5 MB
              </p>

              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-72 rounded-xl border object-contain"
                  />
                </div>
              )}

              {image && !selectedFile && (
                <p className="mt-2 text-xs text-green-600">
                  Existing image: {image}
                </p>
              )}
            </div>

            <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-5">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">
                    News Type
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    à¤…à¤—à¤° 60 Words à¤µà¤¾à¤²à¥€ à¤›à¥‹à¤Ÿà¥€ à¤–à¤¬à¤° à¤¬à¤¨à¤¾à¤¨à¥€ à¤¹à¥ˆ à¤¤à¥‹
                    à¤‡à¤¸à¥‡ ON à¤•à¤°à¥‡à¤‚à¥¤
                  </p>
                </div>

                <div className="shrink-0">
                  <input
                    type="checkbox"
                    checked={is60Words}
                    onChange={(e) =>
                      setIs60Words(e.target.checked)
                    }
                    className="h-6 w-6 cursor-pointer accent-red-600"
                  />
                </div>
              </label>

              <div
                className={
                  "mt-4 rounded-xl px-4 py-3 text-sm font-semibold " +
                  (is60Words
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700")
                }
              >
                {is60Words
                  ? "60 Words News ON - à¤…à¤¬ à¤¨à¥€à¤šà¥‡ à¤¸à¤¿à¤°à¥à¤« 60 Words à¤µà¤¾à¤²à¤¾ content à¤¡à¤¾à¤²à¥‡à¤‚à¥¤"
                  : "Normal News - à¤…à¤¬ à¤¨à¥€à¤šà¥‡ à¤ªà¥‚à¤°à¥€ à¤–à¤¬à¤° à¤•à¤¾ content à¤¡à¤¾à¤²à¥‡à¤‚à¥¤"}
              </div>
            </div>

            {!is60Words && (
              <div className="rounded-2xl border border-gray-200 bg-white">
                <div className="border-b bg-gray-50 px-4 py-3">
                  <label className="font-bold">
                    Full News Content
                  </label>

                  <p className="mt-1 text-xs text-gray-500">
                    à¤¯à¤¹à¤¾à¤‚ à¤ªà¥‚à¤°à¥€ à¤–à¤¬à¤° à¤²à¤¿à¤–à¥‡à¤‚à¥¤
                  </p>
                </div>

                <div className="p-4">
                  <textarea
                    value={content}
                    onChange={(e) =>
                      setContent(e.target.value)
                    }
                    placeholder="à¤¯à¤¹à¤¾à¤‚ à¤ªà¥‚à¤°à¥€ à¤–à¤¬à¤° à¤²à¤¿à¤–à¥‡à¤‚..."
                    rows={12}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
                  />
                </div>
              </div>
            )}

            {is60Words && (
              <div className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <label className="font-bold text-gray-900">
                      News in 60 Words
                    </label>

                    <p className="mt-1 text-xs text-gray-500">
                      à¤‡à¤¸ box à¤®à¥‡à¤‚ à¤…à¤§à¤¿à¤•à¤¤à¤® 60 words à¤•à¥€ à¤–à¤¬à¤° à¤²à¤¿à¤–à¥‡à¤‚à¥¤
                    </p>
                  </div>

                  <span
                    className={
                      "shrink-0 text-sm font-bold " +
                      (shortWordCount > 60
                        ? "text-red-600"
                        : shortWordCount === 60
                          ? "text-green-600"
                          : "text-gray-500")
                    }
                  >
                    {shortWordCount} / 60
                  </span>
                </div>

                <textarea
                  value={shortContent}
                  onChange={(e) =>
                    handleShortContentChange(
                      e.target.value
                    )
                  }
                  onPaste={handleShortContentPaste}
                  placeholder="à¤¯à¤¹à¤¾à¤‚ 60 words à¤•à¥‡ à¤…à¤‚à¤¦à¤° à¤–à¤¬à¤° à¤²à¤¿à¤–à¥‡à¤‚..."
                  rows={7}
                  className={
                    "w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-red-500 " +
                    (shortWordCount > 60
                      ? "border-red-500"
                      : "border-red-200")
                  }
                />

                {shortWordCount > 60 && (
                  <div className="mt-3 rounded-lg bg-red-100 p-3 text-sm font-semibold text-red-700">
                    à¤†à¤ªà¤•à¥€ à¤–à¤¬à¤°{" "}
                    {shortWordCount - 60} words à¤œà¥à¤¯à¤¾à¤¦à¤¾ à¤¹à¥ˆà¥¤
                    Save à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤‡à¤¸à¥‡ 60 words à¤¯à¤¾ à¤‰à¤¸à¤¸à¥‡ à¤•à¤® à¤•à¤°à¥‡à¤‚à¥¤
                  </div>
                )}

                {shortWordCount > 0 &&
                  shortWordCount <= 60 && (
                    <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-700">
                      {60 - shortWordCount} words à¤”à¤° à¤²à¤¿à¤– à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤
                    </div>
                  )}

                <div className="mt-3 rounded-lg bg-white p-3 text-xs text-gray-500">
                  à¤‡à¤¸ mode à¤®à¥‡à¤‚ Full News Content à¤¡à¤¾à¤²à¤¨à¥‡ à¤•à¥€ à¤œà¤°à¥‚à¤°à¤¤ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤
                  à¤¸à¤¿à¤°à¥à¤« à¤¯à¤¹à¥€ content public website à¤•à¥‡
                  <strong> News in 60 Words </strong>
                  section à¤®à¥‡à¤‚ à¤¦à¤¿à¤–à¤¾à¤ˆ à¤¦à¥‡à¤—à¤¾à¥¤
                </div>
              </div>
            )}

            <div className="grid gap-4 rounded-xl bg-gray-50 p-4 md:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) =>
                    setIsTrending(e.target.checked)
                  }
                  className="h-5 w-5"
                />

                <span className="font-semibold">
                  Trending News
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) =>
                    setPublished(e.target.checked)
                  }
                  className="h-5 w-5"
                />

                <span className="font-semibold">
                  Publish News
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full rounded-xl bg-red-600 px-5 py-4 text-lg font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Image Upload à¤¹à¥‹ à¤°à¤¹à¥€ à¤¹à¥ˆ..."
                : loading
                  ? "Save à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ..."
                  : editingId
                    ? "News Update à¤•à¤°à¥‡à¤‚"
                    : "News Save à¤•à¤°à¥‡à¤‚"}
            </button>
          </form>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-5 shadow md:p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Manage News
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              à¤¯à¤¹à¤¾à¤‚ à¤¸à¥‡ à¤¸à¤­à¥€ à¤–à¤¬à¤°à¥‹à¤‚ à¤•à¥‹ search, filter, edit,
              publish à¤”à¤° delete à¤•à¤° à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Search
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Headline / category / slug"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500"
                >
                  <option value="all">
                    à¤¸à¤­à¥€ Categories
                  </option>

                  {categories.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Publish Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500"
                >
                  <option value="all">
                    à¤¸à¤­à¥€
                  </option>

                  <option value="published">
                    Published
                  </option>

                  <option value="unpublished">
                    Unpublished
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Trending
                </label>

                <select
                  value={trendingFilter}
                  onChange={(e) =>
                    setTrendingFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-red-500"
                >
                  <option value="all">
                    à¤¸à¤­à¥€
                  </option>

                  <option value="trending">
                    Trending
                  </option>

                  <option value="normal">
                    Normal News
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm font-semibold text-gray-600">
                {filteredNews.length} à¤–à¤¬à¤°
                {filteredNews.length !== 1
                  ? "à¥‡à¤‚"
                  : ""} à¤®à¤¿à¤²à¥€
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                  setTrendingFilter("all");
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100"
              >
                à¤¸à¤­à¥€ Filters à¤¹à¤Ÿà¤¾à¤à¤‚
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredNews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                à¤•à¥‹à¤ˆ à¤–à¤¬à¤° à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¥€à¥¤
              </div>
            ) : (
              filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 p-4 transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-32 w-full rounded-xl object-cover sm:w-48"
                        />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400 sm:w-48">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                          {item.category}
                        </span>

                        {item.published ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
                            Unpublished
                          </span>
                        )}

                        {item.isTrending && (
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                            Trending
                          </span>
                        )}

                        {item.shortContent && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            60 Words
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-xl font-bold">
                        {item.title}
                      </h3>

                      <p className="mt-1 break-all text-xs text-gray-400">
                        /news/{item.slug}
                      </p>

                      {item.content ? (
                        <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                          {item.content}
                        </p>
                      ) : (
                        <p className="mt-3 text-sm font-semibold text-blue-600">
                          à¤¯à¤¹ 60 Words à¤µà¤¾à¤²à¥€ à¤–à¤¬à¤° à¤¹à¥ˆ
                        </p>
                      )}

                      {item.shortContent && (
                        <div className="mt-3 rounded-lg bg-red-50 p-3">
                          <p className="text-xs font-bold text-red-700">
                            News in 60 Words:
                          </p>

                          <p className="mt-1 line-clamp-3 text-sm text-gray-700">
                            {item.shortContent}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={"/news/" + item.slug}
                          target="_blank"
                          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                          à¤¦à¥‡à¤–à¥‡à¤‚
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            editNews(item)
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            togglePublished(item)
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                        >
                          {item.published
                            ? "Unpublish"
                            : "Publish"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleTrending(item)
                          }
                          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                          {item.isTrending
                            ? "Trending à¤¹à¤Ÿà¤¾à¤à¤‚"
                            : "Trending"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteNews(item.id)
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <footer className="mt-10 bg-black px-4 py-8 text-center text-white">
        <h2 className="text-2xl font-bold text-red-500">
          à¤²à¥‹à¤• à¤®à¤šà¤¾à¤¨
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          à¤†à¤ªà¤•à¥€ à¤†à¤µà¤¾à¤œà¤¼, à¤¹à¤®à¤¾à¤°à¤¾ à¤®à¤‚à¤š
        </p>

        <p className="mt-4 text-xs text-gray-500">
          Â© 2026 Lok Machan. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}

