import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Lok Machan",
  description:
    "Lok Machan ke baare mein jaanein. Hum ek digital news, media aur podcast platform hain.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black sm:py-14">
      <article className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-bold tracking-wider text-black">
          LOK MACHAN · DIGITAL NEWS &amp; MEDIA
        </p>

        <h1 className="mb-6 text-3xl font-extrabold text-black sm:text-4xl">
          About Us
        </h1>

        <p className="mb-8 text-lg leading-8 text-black">
          समाचार, जानकारी और पॉडकास्ट — डिजिटल माध्यम से आप तक।
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-black sm:text-2xl">
            Lok Machan क्या है?
          </h2>
          <p className="leading-8 text-black">
            Lok Machan एक डिजिटल न्यूज़ और मीडिया प्लेटफ़ॉर्म है। हमारी
            वेबसाइट पर समाचार, समसामयिक विषयों से जुड़ी जानकारी और पॉडकास्ट
            प्रस्तुत किए जाते हैं। हमारा उद्देश्य डिजिटल माध्यम से पाठकों,
            दर्शकों और श्रोताओं तक उपयोगी सामग्री पहुँचाना है।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-black sm:text-2xl">
            हमारा उद्देश्य
          </h2>
          <p className="leading-8 text-black">
            हमारा प्रयास है कि समाचार और जानकारी स्पष्ट, समझने में आसान और
            पाठकों के लिए उपयोगी रूप में प्रस्तुत की जाए। हम डिजिटल मीडिया
            के माध्यम से लोगों को अपने आसपास और दुनिया में हो रही घटनाओं से
            परिचित कराने का प्रयास करते हैं।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-black sm:text-2xl">
            समाचार और मीडिया
          </h2>
          <p className="leading-8 text-black">
            Lok Machan पर विभिन्न विषयों से संबंधित समाचार और डिजिटल मीडिया
            सामग्री प्रकाशित की जाती है। सामग्री तैयार करते समय तथ्यों की
            सटीकता, उचित संदर्भ और स्पष्ट प्रस्तुति का ध्यान रखना हमारा
            प्रयास है।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-black sm:text-2xl">
            हमारे पॉडकास्ट
          </h2>
          <p className="leading-8 text-black">
            पॉडकास्ट हमारे डिजिटल मीडिया प्लेटफ़ॉर्म का एक महत्वपूर्ण हिस्सा
            हैं। इनके माध्यम से विभिन्न विषयों और चर्चाओं को सुनने या देखने
            योग्य प्रारूप में प्रस्तुत किया जाता है। हमारा उद्देश्य श्रोताओं
            और दर्शकों को रोचक तथा जानकारीपूर्ण सामग्री उपलब्ध कराना है।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-black sm:text-2xl">
            संपादकीय जिम्मेदारी
          </h2>
          <p className="leading-8 text-black">
            हम प्रकाशित सामग्री में सटीकता और स्पष्टता बनाए रखने का प्रयास
            करते हैं। यदि किसी समाचार या सामग्री में कोई त्रुटि दिखाई दे,
            तो कृपया हमें सूचित करें। हम प्राप्त जानकारी की समीक्षा कर
            आवश्यक सुधार करने का प्रयास करेंगे।
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-black sm:text-2xl">
            हमसे संपर्क करें
          </h2>
          <p className="mb-4 leading-8 text-black">
            आपके सुझाव, प्रश्न और सुधार संबंधी संदेश हमारे लिए महत्वपूर्ण
            हैं। हमसे संपर्क करने के लिए हमारे संपर्क पृष्ठ पर जाएँ।
          </p>

          <Link
            href="/contact"
            className="inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            संपर्क करें
          </Link>
        </section>
      </article>
    </main>
  );
}