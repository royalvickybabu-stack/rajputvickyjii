"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "लॉगिन करने में समस्या हुई।");
        return;
      }

      setMessage("लॉगिन सफल हुआ।");
    } catch {
      setMessage("सर्वर से कनेक्ट नहीं हो पाया।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4">
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
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-97px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              लॉगिन करें
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              लोक मचान में आपका स्वागत है
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                मोबाइल नंबर या ईमेल
              </label>

              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="मोबाइल नंबर या ईमेल दर्ज करें"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black placeholder:text-gray-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                पासवर्ड
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="पासवर्ड दर्ज करें"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-black placeholder:text-gray-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
                  aria-label={
                    showPassword
                      ? "पासवर्ड छुपाएं"
                      : "पासवर्ड दिखाएं"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
            </button>
          </form>

          {message && (
            <div className="mt-5 rounded-lg bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-800">
              {message}
            </div>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">या</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Google से लॉगिन करें
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            अभी अकाउंट नहीं है?

            <Link
              href="/register"
              className="ml-1 font-bold text-red-600 hover:underline"
            >
              नया अकाउंट बनाएं
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-500 hover:text-red-600"
            >
              ← होम पेज पर वापस जाएं
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}