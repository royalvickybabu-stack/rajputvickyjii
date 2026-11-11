
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Survey = {
  id: number;
  title: string;
  description: string | null;
  type: "POLL" | "DIRECT";
  createdAt: string;
  endsAt: string | null;
  _count: {
    votes: number;
    responses: number;
  };
};

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSurveys() {
      try {
        const response = await fetch("/api/surveys", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Surveys load nahi ho paye.");
        }

        const data = await response.json();
        setSurveys(Array.isArray(data) ? data : []);
      } catch {
        setError("Surveys load nahi ho paye. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadSurveys();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-600">
            Lok Machan Public Opinion
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Public Surveys & Polls
          </h1>

          <p className="mt-3 text-gray-600">
            Apni rai dein, voting karein aur dekhein log kya sochte hain.
          </p>
        </div>

        {loading && (
          <p className="py-12 text-center text-gray-600">
            Surveys load ho rahe hain...
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && surveys.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Abhi koi survey available nahi hai.
            </h2>
            <p className="mt-2 text-gray-500">
              Naye surveys ke liye baad mein visit karein.
            </p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {surveys.map((survey) => {
            const total =
              survey._count.votes + survey._count.responses;

            const closed =
              survey.endsAt !== null &&
              new Date(survey.endsAt).getTime() < Date.now();

            return (
              <article
                key={survey.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >

                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {survey.type === "POLL"
                        ? "PUBLIC POLL"
                        : "DIRECT ANSWER"}
                    </span>

                    <span
                      className={`text-xs font-semibold ${
                        closed ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {closed ? "CLOSED" : "OPEN"}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold leading-snug text-gray-900">
                    {survey.title}
                  </h2>

                  {survey.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {survey.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {total}
                      </p>
                      <p className="text-xs text-gray-500">
                        {survey.type === "POLL"
                          ? "Total votes"
                          : "Total responses"}
                      </p>
                    </div>

                    <Link
                      href={`/surveys/${survey.id}`}
                      className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      {closed ? "View Results" : "Participate"}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

