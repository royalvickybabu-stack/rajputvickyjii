"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const loginErrors: Record<string, string> = {
  google_cancelled: "Google लॉगिन रद्द हो गया। कृपया दोबारा प्रयास करें।",
  google_state_invalid: "सुरक्षा जाँच पूरी नहीं हुई। कृपया दोबारा लॉगिन करें।",
  google_config_missing: "Google लॉगिन की सेटिंग उपलब्ध नहीं है।",
  google_token_failed: "Google से कनेक्शन नहीं हो पाया। कृपया दोबारा प्रयास करें।",
  google_token_missing: "Google से लॉगिन की अनुमति नहीं मिली।",
  google_profile_failed: "Google खाते की जानकारी नहीं मिल सकी।",
  google_email_unverified: "आपका Google ईमेल सत्यापित होना ज़रूरी है।",
  google_account_conflict: "इस ईमेल से कोई दूसरा Google खाता जुड़ा हुआ है।",
  google_login_failed: "लॉगिन नहीं हो पाया। कृपया दोबारा प्रयास करें।",
};

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error) {
      setMessage(loginErrors[error] || "लॉगिन नहीं हो पाया। कृपया दोबारा प्रयास करें।");
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  function handleGoogleLogin() {
    setMessage("");
    setLoading(true);
    window.location.href = "/api/auth/google";
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">लॉगिन करें</h1>
            <p className="mt-2 text-sm text-gray-500">लोक मचान में आपका स्वागत है</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.99 46.98 31.84 46.98 24.55z" />
              <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {loading ? "Google खुल रहा है..." : "Google से लॉगिन करें"}
          </button>

          {message && (
            <div role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
              {message}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-red-600">
              ← होमपेज पर वापस जाएँ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
