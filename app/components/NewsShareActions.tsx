
"use client";

type Props = {
  title: string;
};

export default function NewsShareActions({ title }: Props) {
  async function handleShare() {
    const url = window.location.href;

    // Mobile/Desktop browser with native sharing support
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url,
        });
      } catch (error) {
        // User closed the share menu; no action needed
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }

      return;
    }

    // Fallback for browsers without native sharing
    try {
      await navigator.clipboard.writeText(url);
      alert("न्यूज़ का लिंक कॉपी हो गया!");
    } catch {
      window.prompt("इस लिंक को कॉपी करें:", url);
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new Event("open-comments"));
          document.getElementById("comments")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
        className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-100"
      >
        कमेंट करें
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800"
      >
        शेयर करें
      </button>
    </div>
  );
}
