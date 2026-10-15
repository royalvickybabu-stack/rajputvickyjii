"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSending(true);
    setStatus("संदेश भेजा जा रहा है...");

    try {
      await emailjs.send(
        "service_rcz35p4",
        "template_vqctaql",
        {
          from_name: String(formData.get("name") ?? ""),
          from_email: String(formData.get("email") ?? ""),
          purpose: String(formData.get("purpose") ?? ""),
          message: String(formData.get("message") ?? ""),
        },
        { publicKey: "o1R59FiMn2VKc0UXL" }
      );

      setStatus("आपका संदेश सफलतापूर्वक भेज दिया गया है। धन्यवाद!");
      form.reset();
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus(
        "संदेश नहीं भेजा जा सका। कृपया कुछ देर बाद कोशिश करें या villagersstalk@gmail.com पर ईमेल भेजें।"
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <section className="mb-8 rounded-2xl bg-black px-5 py-8 text-white sm:px-8">
        <p className="mb-2 text-sm font-semibold text-red-400">
          लोक मचान
        </p>

        <h1 className="text-3xl font-extrabold sm:text-4xl">
          संपर्क करें
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
          खबर भेजने, विज्ञापन देने, व्यापार संबंधी पूछताछ या सुझाव के लिए
          लोक मचान की टीम से संपर्क करें।
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border bg-white p-5 text-black shadow-sm sm:p-7">
          <h2 className="mb-5 text-xl font-bold text-black">
            हमें संदेश भेजें
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1 block text-sm font-medium text-black"
              >
                आपका नाम
              </label>

              <input
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                className="w-full rounded-lg border px-3 py-3 text-black placeholder:text-gray-500 outline-none focus:border-red-500"
                placeholder="अपना नाम लिखें"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1 block text-sm font-medium text-black"
              >
                ईमेल पता
              </label>

              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                className="w-full rounded-lg border px-3 py-3 text-black placeholder:text-gray-500 outline-none focus:border-red-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-purpose"
                className="mb-1 block text-sm font-medium text-black"
              >
                संपर्क करने का कारण
              </label>

              <select
                id="contact-purpose"
                name="purpose"
                required
                defaultValue="समाचार या खबर भेजें"
                className="w-full rounded-lg border bg-white px-3 py-3 text-black"
              >
                <option value="समाचार या खबर भेजें">
                  समाचार या खबर भेजें
                </option>
                <option value="विज्ञापन संबंधी पूछताछ">
                  विज्ञापन संबंधी पूछताछ
                </option>
                <option value="व्यापार संबंधी पूछताछ">
                  व्यापार संबंधी पूछताछ
                </option>
                <option value="सुझाव या अन्य विषय">
                  सुझाव या अन्य विषय
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1 block text-sm font-medium text-black"
              >
                आपका संदेश
              </label>

              <textarea
                id="contact-message"
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                className="w-full rounded-lg border px-3 py-3 text-black placeholder:text-gray-500 outline-none focus:border-red-500"
                placeholder="अपना संदेश यहाँ लिखें..."
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "भेजा जा रहा है..." : "संदेश भेजें"}
            </button>

            {status && (
              <p
                role="status"
                aria-live="polite"
                className="text-sm leading-6 text-black"
              >
                {status}
              </p>
            )}

            <p className="text-xs leading-5 text-gray-600">
              आपका संदेश ईमेल के माध्यम से लोक मचान की टीम तक पहुँचाया जाएगा।
            </p>
          </form>
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border bg-white p-5 text-black shadow-sm sm:p-7">
            <h2 className="mb-4 text-xl font-bold text-black">
              संपर्क विवरण
            </h2>

            <p className="mb-2 text-sm text-gray-700">
              आधिकारिक ईमेल
            </p>

            <a
              className="break-all font-semibold text-red-600 hover:underline"
              href="mailto:villagersstalk@gmail.com"
            >
              villagersstalk@gmail.com
            </a>

            <p className="mb-2 mt-6 text-sm text-gray-700">
              कार्यालय का पता
            </p>

            <p className="leading-7 text-gray-800">
              बलिया, उत्तर प्रदेश
              <br />
              पिन कोड – 277209, भारत
            </p>
          </section>

          <section className="rounded-2xl border border-red-100 bg-red-50 p-5 sm:p-7">
            <h2 className="mb-3 text-lg font-bold text-black">
              खबर और विज्ञापन
            </h2>

            <p className="text-sm leading-7 text-gray-800">
              स्थानीय समाचार, खबरों की जानकारी, विज्ञापन और व्यावसायिक
              साझेदारी के लिए हमें आधिकारिक ईमेल पर संदेश भेजें।
            </p>

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=villagersstalk@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            >
              ईमेल करें
            </a>
          </section>
        </aside>
      </div>
    </main>
  );
}