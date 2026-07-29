import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Swaraj Enterprises",
  description: "Privacy Policy for Swaraj Enterprises. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <section className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[800px] px-5 md:px-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#0f172a] mb-2">
          Privacy Policy
        </h1>
        <p className="text-[14px] text-[#64748b] mb-8">
          Last updated: July 29, 2026
        </p>

        <div className="prose prose-slate max-w-none space-y-6 text-[14px] text-[#334155] leading-relaxed">
          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This includes your name, email address, phone number, shipping address, and payment information. We also collect information automatically when you use our website, including your IP address, browser type, and usage data.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to process your orders, communicate with you about your purchases, improve our website and services, and send you promotional communications (with your consent). We do not sell or rent your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">3. Google OAuth Authentication</h2>
            <p>
              Our website uses Google OAuth for user authentication. When you sign in with Google, we receive your name, email address, and profile picture. This information is used solely for authentication and order tracking purposes. We do not store your Google password or access your Google account beyond what is necessary for authentication.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">4. Payment Information</h2>
            <p>
              Payment processing is handled by Razorpay, a secure third-party payment processor. We do not store your credit card or payment details on our servers. Razorpay&apos;s privacy policy governs the handling of your payment information.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">5. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings. Essential cookies required for authentication and site functionality cannot be disabled.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">7. Third-Party Services</h2>
            <p>
              Our website may contain links to third-party websites or services, including Google OAuth and Razorpay. We are not responsible for the privacy practices or content of these third-party services. We encourage you to review their privacy policies.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">8. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information stored with us. To exercise these rights, please contact us at{" "}
              <a href="mailto:swarajenterprises.co@gmail.com" className="text-[#2563eb] hover:underline">
                swarajenterprises.co@gmail.com
              </a>
              . You can also sign out of your account at any time through the profile page.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">10. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the updated policy on our website. Your continued use of our services after any changes indicates your acceptance of the updated policy.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">11. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
              <a href="mailto:swarajenterprises.co@gmail.com" className="text-[#2563eb] hover:underline">
                swarajenterprises.co@gmail.com
              </a>
              {" "}or call us at{" "}
              <a href="tel:+919844734939" className="text-[#2563eb] hover:underline">
                +91 98447 34939
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
