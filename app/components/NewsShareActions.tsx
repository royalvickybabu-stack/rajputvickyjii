"use client";

type Props = {
  title: string;
  showComments?: boolean;
};

export default function NewsShareActions({
  title,
  showComments = true,
}: Props) {
  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      alert("लिंक कॉपी हो गया!");
    } catch {
      window.prompt("इस लिंक को कॉपी करें:", url);
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      {showComments && (
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
      )}

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
