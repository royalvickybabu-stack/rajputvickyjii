
"use client";

import { useState } from "react";

type Props = {
  title: string;
};

function WhatsAppLogo() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6 shrink-0" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#25D366" />
      <path
        fill="#fff"
        d="M8.1 24.1l1.1-4A11 11 0 1 1 13 23.8l-4.9.3Zm5.1-3.1.6.3a8.5 8.5 0 1 0-3.1-3.1l.3.6-.7 2.3 2.9-.1Zm8.2-4.1c-.4-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.1-.4.2-.7 0a8.5 8.5 0 0 1-2.5-2.2c-.3-.4.3-.4.8-1.4.1-.2 0-.4 0-.6s-.7-1.7-.9-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.9 5 .8.3 1.4.5 1.9.6.8.2 1.5.2 2 .1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"
      />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6 shrink-0" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#1877F2" />
      <path
        fill="#fff"
        d="M18.2 27V17.1h3.3l.5-3.9h-3.8v-2.5c0-1.1.3-1.8 1.9-1.8h2V5.4c-.4-.1-1.6-.2-3-.2-3 0-5.1 1.8-5.1 5.2v2.8h-3.4v3.9H14V27h4.2Z"
      />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.9 5.8 22H2.6l7.3-8.4L2.1 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L7.6 3.9H5.8L17.8 20Z"
      />
    </svg>
  );
}

export default function NewsShareActions({ title }: Props) {
  const [open, setOpen] = useState(false);

  function shareUrl(platform: "whatsapp" | "facebook" | "x") {
    const url = window.location.href;
    const text = `${title}\n${url}`;

    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    };

    window.open(links[platform], "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new Event("open-comments"));
          document
            .getElementById("comments")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-100"
      >
        {"\u0915\u092e\u0947\u0902\u091f \u0915\u0930\u0947\u0902"}
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800"
        >
          {"\u0936\u0947\u092f\u0930 \u0915\u0930\u0947\u0902"}
        </button>

        {open && (
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
            <button
              type="button"
              onClick={() => shareUrl("whatsapp")}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-gray-800 hover:bg-green-50"
            >
              <WhatsAppLogo />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => shareUrl("facebook")}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-gray-800 hover:bg-blue-50"
            >
              <FacebookLogo />
              <span>Facebook</span>
            </button>

            <button
              type="button"
              onClick={() => shareUrl("x")}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-gray-800 hover:bg-gray-100"
            >
              <XLogo />
              <span>X</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
