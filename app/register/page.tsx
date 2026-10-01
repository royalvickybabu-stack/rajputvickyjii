"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "अकाउंट नहीं बन पाया।");
        return;
      }

      setMessage("अकाउंट सफलतापूर्वक बन गया। अब लॉगिन करें।");

      setName("");
      setEmail("");
      setMobile("");
      setPassword("");
    } catch {
      setMessage("सर्वर से कनेक्शन नहीं हो पाया।");
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
              नया अकाउंट बनाएं
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              लोक मचान से जुड़ें
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                नाम
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="अपना नाम दर्ज करें"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                ईमेल
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="अपना ईमेल दर्ज करें"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                मोबाइल नंबर
              </label>

              <input
                type="tel"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                placeholder="मोबाइल नंबर दर्ज करें"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="कम से कम 6 characters"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-black outline-none placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  required
                  minLength={6}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-800"
                  aria-label={showPassword ? "पासवर्ड छिपाएं" : "पासवर्ड दिखाएं"}
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
              {loading ? "अकाउंट बन रहा है..." : "अकाउंट बनाएं"}
            </button>

            {message && (
              <p className="text-center text-sm font-semibold text-red-600">
                {message}
              </p>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            पहले से अकाउंट है?

            <Link
              href="/login"
              className="ml-1 font-bold text-red-600 hover:underline"
            >
              लॉगिन करें
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