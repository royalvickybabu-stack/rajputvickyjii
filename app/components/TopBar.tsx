"use client";

import { useEffect, useState } from "react";

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-900 text-sm text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">

        <div className="flex items-center gap-2">
          <span>
            {currentTime.toLocaleDateString("hi-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>

          <span className="text-gray-400">|</span>

          <span className="font-medium">
            {currentTime.toLocaleTimeString("hi-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">

          <div className="flex items-center gap-3">
            <span className="font-serif text-sm font-extrabold uppercase tracking-wider text-white">
              Follow us -
            </span>

            <a
              href="https://www.facebook.com/share/1AxdfUbAvJ/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transition hover:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.67.33-1 1-1z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/lokmachan?stkn=b3Yyb2hhMWVjb2hx&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition hover:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>

            <a
              href="https://x.com/lokmachan?s=11"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="transition hover:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M18.244 2H21.5l-7.11 8.128L22.75 22h-6.617l-5.18-6.778L5.02 22H1.76l7.606-8.69L1.5 2h6.785l4.682 6.19L18.244 2Zm-1.143 17.84h1.803L7.217 4.045H5.282L17.101 19.84Z" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-serif text-sm font-extrabold uppercase tracking-wider text-white">
              Subscribe Us -
            </span>

            <a
              href="https://youtube.com/@lokmachan?si=HELx2Vm5zcTVL1wU"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="transition hover:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8ZM9.6 15.8V8.2l6.5 3.8-6.5-3.8Z" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
