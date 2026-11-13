
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Reporter = {
  id: number;
  name: string;
  photo: string | null;
  designation: string | null;
  bio: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { news: number };
};

const emptyForm = {
  name: "",
  photo: "",
  designation: "",
  bio: "",
  isActive: true,
};

export default function ReportersPage() {
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadReporters() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/reporters", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Reporters load नहीं हुए");

      setReporters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReporters();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function editReporter(reporter: Reporter) {
    setEditingId(reporter.id);
    setForm({
      name: reporter.name,
      photo: reporter.photo || "",
      designation: reporter.designation || "",
      bio: reporter.bio || "",
      isActive: reporter.isActive,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Photo upload failed");
      }

      setForm((prev) => ({ ...prev, photo: data.url }));
      setMessage("Reporter photo uploaded successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function saveReporter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/reporters", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Reporter save नहीं हुआ");
      }

      setMessage(editingId
        ? "Reporter updated successfully."
        : "Reporter added successfully."
      );

      resetForm();
      await loadReporters();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(reporter: Reporter) {
    try {
      const response = await fetch("/api/admin/reporters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reporter.id,
          name: reporter.name,
          photo: reporter.photo,
          designation: reporter.designation,
          bio: reporter.bio,
          isActive: !reporter.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Status update failed");

      await loadReporters();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  }

  async function deleteReporter(reporter: Reporter) {
    const confirmed = window.confirm(
      `क्या आप "${reporter.name}" को Delete करना चाहते हैं? उनकी पुरानी खबरें Delete नहीं होंगी।`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/reporters", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reporter.id }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Delete failed");

      setMessage("Reporter deleted successfully.");
      if (editingId === reporter.id) resetForm();
      await loadReporters();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 text-gray-900 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              Reporter Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Add, manage and update your news reporters.
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-500">Total Reporters</p>
            <p className="text-2xl font-bold">{reporters.length}</p>
          </div>
        </div>

        {(message || error) && (
          <div
            className={`rounded-lg p-3 text-sm ${
              error
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {error || message}
          </div>
        )}

        <section className="rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <h2 className="mb-5 text-xl font-bold">
            {editingId ? "Edit Reporter" : "Add New Reporter"}
          </h2>

          <form onSubmit={saveReporter} className="space-y-5">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border bg-gray-100">
                {form.photo ? (
                  <img
                    src={form.photo}
                    alt="Reporter"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-400">👤</span>
                )}
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Reporter Photo
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadPhoto(file);
                  }}
                  className="block w-full max-w-xs text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG, WEBP or GIF. Maximum 5 MB.
                </p>
                {uploading && (
                  <p className="mt-2 text-sm text-blue-600">
                    Uploading photo...
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Reporter Name *
                </label>
                <input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="पूरा नाम लिखें"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Designation
                </label>
                <input
                  maxLength={100}
                  value={form.designation}
                  onChange={(e) =>
                    setForm({ ...form, designation: e.target.value })
                  }
                  placeholder="जिला संवाददाता, ब्यूरो चीफ आदि"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Reporter Bio
              </label>
              <textarea
                maxLength={1000}
                rows={4}
                value={form.bio}
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value })
                }
                placeholder="Reporter का संक्षिप्त परिचय लिखें..."
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="h-5 w-5"
              />
              <span className="text-sm font-semibold">
                Reporter Active रखें
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Reporter"
                    : "Save Reporter"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border px-6 py-3 font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <h2 className="mb-5 text-xl font-bold">All Reporters</h2>

          {loading ? (
            <p className="py-8 text-center text-gray-500">
              Loading reporters...
            </p>
          ) : reporters.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              अभी कोई Reporter नहीं है। ऊपर से पहला Reporter जोड़ें।
            </p>
          ) : (
            <div className="space-y-3">
              {reporters.map((reporter) => (
                <div
                  key={reporter.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border p-4"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    {reporter.photo ? (
                      <img
                        src={reporter.photo}
                        alt={reporter.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{reporter.name}</h3>
                    <p className="text-sm text-gray-500">
                      {reporter.designation || "No designation"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {reporter._count?.news ?? 0} News
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        reporter.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {reporter.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => editReporter(reporter)}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => void toggleStatus(reporter)}
                      className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 cursor-pointer"
                    >
                      {reporter.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => void deleteReporter(reporter)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
