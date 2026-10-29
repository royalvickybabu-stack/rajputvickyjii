"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-5 rounded-xl border p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <p className="text-sm text-gray-600">
          Apne authorized Google account se login karein.
        </p>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            Google login nahi ho paya. Sirf authorized Gmail use karein.
          </p>
        )}

        <a
          href="/api/admin/google"
          className="block w-full rounded-md bg-black p-3 text-center font-medium text-white hover:bg-gray-800"
        >
          Continue with Google
        </a>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="p-6">Loading...</main>}>
      <AdminLoginForm />
    </Suspense>
  );
}
