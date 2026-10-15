"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Admin login fail ho gaya.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl border p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <p className="text-sm text-gray-600">
          Admin panel ke liye apni alag ID aur password daalein.
        </p>

        <div className="space-y-2">
          <label htmlFor="admin-id" className="block text-sm font-medium">
            Admin ID
          </label>

          <input
            id="admin-id"
            autoComplete="username"
            value={id}
            onChange={(event) => setId(event.target.value)}
            required
            disabled={loading}
            className="w-full rounded-md border p-3 disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="admin-password" className="block text-sm font-medium">
            Admin Password
          </label>

          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={loading}
            className="w-full rounded-md border p-3 disabled:opacity-60"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ cursor: loading ? "not-allowed" : "pointer" }} className="w-full cursor-pointer rounded-md bg-black p-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Login ho raha hai..." : "Admin Login"}
        </button>
      </form>
    </main>
  );
}
