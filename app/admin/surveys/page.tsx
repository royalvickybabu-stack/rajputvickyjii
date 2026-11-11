
"use client";

import { useEffect, useRef, useState } from "react";

type SurveyOption = {
  text: string;
  description: string;
  image: string;
};

type Survey = {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  type: string;
  published: boolean;
  createdAt: string;
  _count?: {
    votes: number;
    responses: number;
  };
};

const emptyOption = (): SurveyOption => ({
  text: "",
  description: "",
  image: "",
});

export default function SurveyAdminPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("POLL");
  const [published, setPublished] = useState(false);
  const [options, setOptions] = useState<SurveyOption[]>([
    emptyOption(),
    emptyOption(),
  ]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [lockedOptionCount, setLockedOptionCount] = useState(0);

  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function loadSurveys() {
    try {
      const res = await fetch("/api/surveys?admin=true");
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setSurveys(data);
      }
    } catch {
      setMessage("Survey load nahi ho paya.");
    }
  }

  useEffect(() => {
    loadSurveys();
  }, []);

  function updateOption(
    index: number,
    field: keyof SurveyOption,
    value: string
  ) {
    setOptions((current) =>
      current.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      )
    );
  }

  function addOption() {
    setOptions((current) => [...current, emptyOption()]);
  }

  function removeOption(index: number) {
    setOptions((current) => current.filter((_, i) => i !== index));
  }

  async function uploadImage(index: number, file: File) {
    if (!file.type.startsWith("image/")) {
      setMessage("Sirf image file upload karein.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image maximum 5 MB ki honi chahiye.");
      return;
    }

    setUploading(index);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Image upload failed");
      }

      updateOption(index, "image", data.url);
      setMessage("Option image upload successful.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Upload failed."
      );
    } finally {
      setUploading(null);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setType("POLL");
    setPublished(false);
    setOptions([emptyOption(), emptyOption()]);
    setEditingId(null);
    setLockedOptionCount(0);
    setMessage("");
fileRefs.current.forEach((input) => {
      if (input) input.value = "";
    });
  }

  async function editSurvey(survey: Survey) {
    try {
      const res = await fetch(`/api/surveys/${survey.id}`);
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Survey load failed.");
        return;
      }

      setEditingId(survey.id);
      setTitle(data.title);
      setDescription(data.description || "");
      setType(data.type);
      setPublished(data.published);
      setLockedOptionCount(data._count?.votes > 0 ? (data.options?.length || 0) : 0);

      setOptions(
        data.options?.length
          ? data.options.map((item: SurveyOption) => ({
              text: item.text,
              description: item.description || "",
              image: item.image || "",
            }))
          : [emptyOption(), emptyOption()]
      );

      setMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setMessage("Survey load nahi ho paya.");
    }
  }

  async function saveSurvey(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!title.trim()) {
      setMessage("Survey question likhna zaroori hai.");
      return;
    }

    if (
      type === "POLL" &&
      (options.length < 2 || options.some((item) => !item.text.trim()))
    ) {
      setMessage("Poll ke liye minimum 2 complete options zaroori hain.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        type,
        published,
        options:
          type === "POLL"
            ? options.map((item) => ({
                text: item.text.trim(),
                description: item.description.trim(),
                image: item.image || null,
              }))
            : [],
      };

      const res = await fetch(
        editingId ? `/api/surveys/${editingId}` : "/api/surveys",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Survey save nahi hua.");
      }

      const successMessage = editingId
        ? "Survey successfully updated!"
        : "Survey created successfully!";

      resetForm();
      setMessage(successMessage);
      await loadSurveys();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteSurvey(id: number) {
    if (
      !window.confirm(
        "Kya aap is survey ko permanently delete karna chahte hain?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/surveys/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Delete failed.");
        return;
      }

      setMessage("Survey deleted successfully.");
      await loadSurveys();
    } catch {
      setMessage("Survey delete nahi ho paya.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Survey Management
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Lok Machan - Public Opinion & Voting
        </p>
      </div>

      <form
        onSubmit={saveSurvey}
        className="space-y-6 rounded-2xl border bg-white p-4 text-gray-900 shadow-sm sm:p-6"
      >
        <h2 className="text-xl font-bold">
          {editingId ? "Edit Survey" : "Create New Survey"}
        </h2>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Survey Question *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={300}
            placeholder="Apna survey question likhein..."
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Survey ke baare mein jankari..."
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500"
          />
        </div>
<div>
          <label className="mb-2 block text-sm font-semibold">
            Survey Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400"
          >
            <option value="POLL">Option Based Poll</option>
            <option value="DIRECT">Direct Answer Survey</option>
          </select>
        </div>

        {type === "POLL" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold">Survey Options</h3>
              <button
                type="button"
                onClick={addOption}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                + Add Option
              </button>
            </div>

            {options.map((option, index) => (
              <div
                key={index}
                className="space-y-3 rounded-xl border bg-gray-50 p-4 text-gray-900"
              >
                <div className="flex items-center justify-between">
                  <strong>Option {index + 1}</strong>
                  {index >= lockedOptionCount && options.length > Math.max(2, lockedOptionCount) && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-sm font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  value={option.text}
                  onChange={(e) =>
                    updateOption(index, "text", e.target.value)
                  }
                  maxLength={200}
                  placeholder="Option ka naam..."
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400"
                />

                <textarea
                  value={option.description}
                  onChange={(e) =>
                    updateOption(index, "description", e.target.value)
                  }
                  maxLength={500}
                  rows={2}
                  placeholder="Option description (Optional)"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    ref={(element) => {
                      fileRefs.current[index] = element;
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(index, file);
                      e.target.value = "";
                    }}
                  />

                  <button
                    type="button"
                    disabled={uploading !== null}
                    onClick={() => fileRefs.current[index]?.click()}
                    className="rounded-lg border bg-white px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {uploading === index
                      ? "Uploading..."
                      : option.image
                        ? "Change Image"
                        : "Add Image (Optional)"}
                  </button>

                  {option.image && (
                    <button
                      type="button"
                      onClick={() => updateOption(index, "image", "")}
                      className="text-sm text-red-600"
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                {option.image && (
                  <img
                    src={option.image}
                    alt={option.text || `Option ${index + 1}`}
                    className="h-28 w-40 rounded-lg border object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center gap-3 rounded-lg border p-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-5 w-5"
          />
          <span className="text-sm font-semibold">
            Publish survey immediately
          </span>
        </label>

        {message && (
          <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            {message}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading || uploading !== null}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Survey"
                : "Create Survey"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border px-6 py-3"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          All Surveys ({surveys.length})
        </h2>

        {surveys.length === 0 ? (
          <div className="rounded-xl border p-8 text-center text-gray-500">
            Abhi koi survey nahi hai.
          </div>
        ) : (
          surveys.map((survey) => (
            <div
              key={survey.id}
              className="flex flex-col justify-between gap-4 rounded-xl border bg-white p-4 text-gray-900 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3">

                <div>
                  <h3 className="font-bold">{survey.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {survey.type === "POLL" ? "Option Poll" : "Direct Answer"}
                    {" Ã‚Â· "}
                    {survey._count?.votes ?? 0} votes
                    {" Ã‚Â· "}
                    {survey._count?.responses ?? 0} answers
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      survey.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {survey.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => editSurvey(survey)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteSurvey(survey.id)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600"
                >
                  Delete
                </button>
                <a
                  href={`/surveys/${survey.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                >
                  View
                </a>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}


