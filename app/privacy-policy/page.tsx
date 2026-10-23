
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Lok Machan",
  description:
    "Lok Machan की Privacy Policy पढ़ें और जानें कि हमारी वेबसाइट जानकारी, cookies और विज्ञापनों का उपयोग कैसे करती है।",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black sm:py-14">
      <article className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-bold tracking-wider">
          LOK MACHAN · DIGITAL NEWS &amp; MEDIA
        </p>

        <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">
          Privacy Policy
        </h1>

        <p className="mb-8 text-sm text-gray-600">
          अंतिम अपडेट: 23 अक्टूबर 2026
        </p>

        <p className="mb-8 leading-8">
          Lok Machan में आपका स्वागत है। यह Privacy Policy बताती है कि
          हमारी वेबसाइट का उपयोग करते समय जानकारी कैसे एकत्र की जा सकती
          है, उसका उपयोग कैसे किया जा सकता है और आपकी गोपनीयता का ध्यान
          कैसे रखा जाता है। हमारी वेबसाइट का उपयोग करके आप इस नीति में
          वर्णित प्रक्रियाओं को समझ सकते हैं।
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            1. हम कौन-सी जानकारी एकत्र कर सकते हैं?
          </h2>
          <p className="leading-8">
            जब आप हमारी वेबसाइट पर आते हैं, हम तकनीकी जानकारी जैसे
            browser का प्रकार, device की जानकारी, देखे गए पेज और
            वेबसाइट के उपयोग से संबंधित सामान्य जानकारी प्राप्त कर
            सकते हैं। यदि आप किसी सुविधा के माध्यम से स्वयं जानकारी
            देते हैं, जैसे संपर्क संदेश या account registration, तो
            उस सुविधा को चलाने के लिए आवश्यक जानकारी संसाधित की जा
            सकती है।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            2. जानकारी का उपयोग
          </h2>
          <p className="leading-8">
            जानकारी का उपयोग वेबसाइट को संचालित करने, समाचार और
            सामग्री उपलब्ध कराने, उपयोगकर्ता अनुभव बेहतर बनाने,
            तकनीकी समस्याओं का पता लगाने, सुरक्षा बनाए रखने और
            उपयोगकर्ताओं के संदेशों का जवाब देने के लिए किया जा
            सकता है।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            3. Cookies और समान तकनीकें
          </h2>
          <p className="leading-8">
            हमारी वेबसाइट या उससे जुड़ी third-party services cookies
            अथवा समान तकनीकों का उपयोग कर सकती हैं। इनका उपयोग
            वेबसाइट की सुविधाएँ चलाने, preferences याद रखने,
            traffic समझने और विज्ञापन सेवाएँ उपलब्ध कराने के लिए
            किया जा सकता है। आप अपने browser की settings से cookies
            को नियंत्रित या हटाने का विकल्प चुन सकते हैं। कुछ
            cookies बंद करने पर वेबसाइट की कुछ सुविधाएँ प्रभावित
            हो सकती हैं।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            4. Google AdSense और विज्ञापन
          </h2>
          <p className="leading-8">
            हमारी वेबसाइट Google AdSense सहित third-party advertising
            services का उपयोग कर सकती है। यदि विज्ञापन सेवाएँ सक्रिय
            की जाती हैं, तो Google और उसके advertising partners cookies
            या समान तकनीकों का उपयोग करके इस वेबसाइट अथवा अन्य
            वेबसाइटों पर आपकी गतिविधि के आधार पर विज्ञापन दिखा सकते
            हैं, जहाँ कानून इसकी अनुमति देता है।
          </p>
          <p className="mt-3 leading-8">
            Google विज्ञापन और गोपनीयता के बारे में अधिक जानकारी के
            लिए{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-700 underline"
            >
              Google की Advertising Policy
            </a>{" "}
            देखें। विज्ञापन personalization और consent से जुड़े
            विकल्प आपकी location तथा लागू नियमों के अनुसार उपलब्ध
            हो सकते हैं।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            5. Third-party सेवाएँ और links
          </h2>
          <p className="leading-8">
            हमारी वेबसाइट पर अन्य वेबसाइटों, वीडियो, social media
            platforms या third-party services के links हो सकते हैं।
            इन बाहरी सेवाओं की privacy policies और practices उनके
            अपने नियंत्रण में होती हैं। किसी बाहरी लिंक पर जाने
            से पहले उसकी privacy policy पढ़ने की सलाह दी जाती है।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            6. जानकारी की सुरक्षा
          </h2>
          <p className="leading-8">
            हम जानकारी को अनधिकृत पहुँच, दुरुपयोग या नुकसान से
            सुरक्षित रखने के लिए उचित कदम उठाने का प्रयास करते हैं।
            हालांकि, इंटरनेट पर जानकारी भेजने या electronic storage
            की कोई भी व्यवस्था पूर्ण सुरक्षा की गारंटी नहीं दे
            सकती।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            7. बच्चों की गोपनीयता
          </h2>
          <p className="leading-8">
            हमारी वेबसाइट सामान्य दर्शकों के लिए है। हम लागू कानूनों
            के अनुसार बच्चों की व्यक्तिगत जानकारी की सुरक्षा का
            ध्यान रखने का प्रयास करते हैं। यदि आपको लगता है कि किसी
            बच्चे ने उचित अनुमति के बिना व्यक्तिगत जानकारी दी है,
            तो कृपया हमें सूचित करें ताकि आवश्यक कदमों की समीक्षा
            की जा सके।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            8. आपकी गोपनीयता संबंधी पसंद
          </h2>
          <p className="leading-8">
            आपके क्षेत्र में लागू कानूनों के अनुसार आपको अपनी
            व्यक्तिगत जानकारी तक पहुँचने, उसमें सुधार करने या उसे
            हटाने का अनुरोध करने जैसे अधिकार प्राप्त हो सकते हैं।
            ऐसे अनुरोधों के लिए हमसे संपर्क करें। हम लागू कानून
            और अपनी जिम्मेदारियों के अनुसार अनुरोध पर विचार करेंगे।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            9. Privacy Policy में बदलाव
          </h2>
          <p className="leading-8">
            हम समय-समय पर इस Privacy Policy को अपडेट कर सकते हैं।
            बदलाव इसी पेज पर प्रकाशित किए जाएँगे और ऊपर दी गई
            अपडेट की तारीख बदली जाएगी।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold">
            10. हमसे संपर्क करें
          </h2>
          <p className="leading-8">
            इस Privacy Policy या आपकी गोपनीयता से संबंधित प्रश्नों
            के लिए हमारे Contact Us पेज पर जाएँ।
          </p>

          <Link
            href="/contact"
            className="mt-4 inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Contact Us
          </Link>
        </section>

        <div className="mt-10 border-t border-gray-200 pt-5">
          <Link
            href="/"
            className="font-semibold text-blue-700 hover:underline"
          >
            ← Homepage पर वापस जाएँ
          </Link>
        </div>
      </article>
    </main>
  );
}
