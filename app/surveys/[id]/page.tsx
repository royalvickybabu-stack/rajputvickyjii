
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Option = {
  id: number;
  text: string;
  description: string | null;
  image: string | null;
  _count: { votes: number };
};

type Comment = {
  id: number;
  name: string | null;
  comment: string | null;
  createdAt: string;
};

type SurveyResponse = {
  id: number;
  name: string;
  content: string;
  createdAt: string;
};

type Survey = {
  id: number;
  title: string;
  description: string | null;
  type: "POLL" | "DIRECT";
  published: boolean;
  startsAt: string | null;
  endsAt: string | null;
  options: Option[];
  votes: Comment[];
  responses: SurveyResponse[];
  _count: {
    votes: number;
    responses: number;
  };
};

export default function SurveyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSurvey = useCallback(async () => {
    try {
      const response = await fetch(`/api/surveys/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Survey load nahi ho paya.");
      }

      setSurvey(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Survey load nahi ho paya."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadSurvey();
  }, [loadSurvey]);

  const isClosed = survey
    ? (survey.startsAt !== null &&
        new Date(survey.startsAt).getTime() > Date.now()) ||
      (survey.endsAt !== null &&
        new Date(survey.endsAt).getTime() < Date.now())
    : false;

  async function submitVote() {
    if (!selectedOption) {
      setError("Please ek option select karein.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/surveys/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionId: selectedOption,
          name,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Vote submit nahi hua.");
      }

      setMessage("Aapka vote successfully record ho gaya!");
      setSelectedOption(null);
      setComment("");
      await loadSurvey();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Vote submit nahi hua."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function submitAnswer() {
    if (!name.trim() || !answer.trim()) {
      setError("Name aur answer dono zaroori hain.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/surveys/${id}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          content: answer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Answer submit nahi hua.");
      }

      setMessage("Aapka answer successfully submit ho gaya!");
      setAnswer("");
      await loadSurvey();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Answer submit nahi hua."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center">
        Survey load ho raha hai...
      </main>
    );
  }

  if (!survey) {
    return (
      <main className="min-h-screen bg-gray-50 p-10 text-center">
        <h1 className="text-xl font-bold">Survey nahi mila.</h1>
        <Link href="/surveys" className="mt-4 inline-block text-red-600">
          Back to Surveys
        </Link>
      </main>
    );
  }

  const totalVotes = survey._count.votes;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/surveys"
          className="mb-6 inline-block text-sm font-semibold text-red-600"
        >
          â† All Surveys
        </Link>

        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {survey.type === "POLL" ? "PUBLIC POLL" : "DIRECT ANSWER SURVEY"}
          </span>

          <h1 className="mt-5 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
            {survey.title}
          </h1>

          {survey.description && (
            <p className="mt-4 whitespace-pre-wrap text-gray-600">
              {survey.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-4 border-b border-gray-100 pb-5 text-sm text-gray-500">
            <span>
              {survey.type === "POLL"
                ? `${totalVotes} votes`
                : `${survey._count.responses} responses`}
            </span>
            <span>{isClosed ? "Voting closed" : "Accepting responses"}</span>
          </div>

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {!isClosed && survey.type === "POLL" && (
            <section className="mt-7">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Apna option select karein
              </h2>

              <div className="space-y-3">
                {survey.options.map((option) => (
                  <label
                    key={option.id}
                    className={`block cursor-pointer rounded-xl border p-4 transition ${
                      selectedOption === option.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="survey-option"
                        checked={selectedOption === option.id}
                        onChange={() => setSelectedOption(option.id)}
                        className="mt-1 h-4 w-4 accent-red-600"
                      />

                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-gray-900">
                          {option.text}
                        </span>

                        {option.description && (
                          <p className="mt-1 text-sm text-gray-600">
                            {option.description}
                          </p>
                        )}

                        {option.image && (
                          <img
                            src={option.image}
                            alt={option.text}
                            loading="lazy"
                            className="mt-3 max-h-52 w-full rounded-lg object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder="Your name (optional)"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
                />

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Comment (optional)"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
                />

                <button
                  onClick={submitVote}
                  disabled={submitting || !selectedOption}
                  className="w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Vote"}
                </button>
              </div>
            </section>
          )}

          {!isClosed && survey.type === "DIRECT" && (
            <section className="mt-7 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">
                Apni rai share karein
              </h2>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
              />

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                maxLength={2000}
                rows={5}
                placeholder="Apna answer yahan likhein..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-red-500"
              />

              <button
                onClick={submitAnswer}
                disabled={submitting || !name.trim() || !answer.trim()}
                className="w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Answer"}
              </button>
            </section>
          )}

          {survey.type === "POLL" && (
            <section className="mt-9 border-t border-gray-100 pt-7">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Live Voting Results
              </h2>

              <div className="mb-5 text-sm text-gray-500">
                Total votes: {totalVotes}
              </div>

              <div className="space-y-5">
                {survey.options.map((option) => {
                  const votes = option._count.votes;
                  const percentage =
                    totalVotes > 0
                      ? (votes / totalVotes) * 100
                      : 0;

                  const highest =
                    totalVotes > 0 &&
                    votes ===
                      Math.max(
                        ...survey.options.map((item) => item._count.votes)
                      );

                  return (
                    <div key={option.id}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="font-semibold text-gray-800">
                          {option.text}
                          {highest && (
                            <span className="ml-2 text-xs font-bold text-green-600">
                              LEADING
                            </span>
                          )}
                        </span>

                        <span className="whitespace-nowrap text-sm font-bold text-gray-700">
                          {percentage.toFixed(1)}% ({votes})
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${
                            highest ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {survey.type === "POLL" && (
            <section className="mt-9 border-t border-gray-100 pt-7">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Public Comments ({survey.votes.length})
              </h2>

              {survey.votes.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Abhi koi public comment nahi hai.
                </p>
              ) : (
                <div className="space-y-4">
                  {survey.votes.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg bg-gray-50 p-4"
                    >
                      <p className="font-semibold text-gray-800">
                        {item.name || "Anonymous"}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                        {item.comment}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {survey.type === "DIRECT" && (
            <section className="mt-9 border-t border-gray-100 pt-7">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Public Answers ({survey.responses.length})
              </h2>

              {survey.responses.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Abhi koi public answer nahi hai.
                </p>
              ) : (
                <div className="space-y-4">
                  {survey.responses.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg bg-gray-50 p-4"
                    >
                      <p className="font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {item.content}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </article>
      </div>
    </main>
  );
}




