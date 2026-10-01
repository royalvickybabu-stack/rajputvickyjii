"use client";

import { useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  );

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
}

export default function NotificationButton() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function enableNotifications() {
    try {
      setLoading(true);
      setMessage("");

      if (!("Notification" in window)) {
        setMessage("आपका browser notifications support नहीं करता।");
        return;
      }

      if (!("serviceWorker" in navigator)) {
        setMessage("आपका browser service worker support नहीं करता।");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setMessage("Notifications की permission नहीं मिली।");
        return;
      }

      await navigator.serviceWorker.register("/sw.js");

      const registration = await navigator.serviceWorker.ready;

      const publicKey =
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        setMessage("Notification key configured नहीं है।");
        return;
      }

      const existingSubscription =
        await registration.pushManager.getSubscription();

      const subscription =
        existingSubscription ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(publicKey),
        }));

      const subscriptionJson = subscription.toJSON();

      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: subscriptionJson.endpoint,
          p256dh: subscriptionJson.keys?.p256dh,
          auth: subscriptionJson.keys?.auth,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Notification enable नहीं हो पाया।"
        );
        return;
      }

      setMessage("🔔 Notifications चालू हो गई हैं।");
    } catch (error) {
      console.error("Notification setup error:", error);

      setMessage(
        "Notifications चालू करने में समस्या हुई।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={enableNotifications}
        disabled={loading}
        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "चालू हो रहा है..."
          : "🔔 Notifications चालू करें"}
      </button>

      {message && (
        <p className="mt-2 text-sm font-semibold text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}
