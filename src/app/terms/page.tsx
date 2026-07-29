import { Metadata } from "next";
import { contact, business, site } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms of Service | ${business.name}`,
  description: `Terms of Service for ${business.name}. Read our terms and conditions for using our website and services.`,
};

export default function TermsPage() {
  return (
    <section className="py-[72px] md:py-[88px] bg-white">
      <div className="mx-auto max-w-[800px] px-5 md:px-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#0f172a] mb-2">
          Terms of Service
        </h1>
        <p className="text-[14px] text-[#64748b] mb-8">
          Last updated: July 29, 2026
        </p>

        <div className="prose prose-slate max-w-none space-y-6 text-[14px] text-[#334155] leading-relaxed">
          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the {business.name} website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">2. Products and Pricing</h2>
            <p>
              All products listed on our website are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. We strive to display accurate pricing, but errors may occur. In the event of a pricing error, we will notify you and provide the option to proceed at the correct price or cancel your order.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">3. Orders and Payments</h2>
            <p>
              When you place an order through our website, you offer to purchase the products you have selected. We will confirm your order by sending you an email. All payments are processed securely through Razorpay. By placing an order, you authorize us to charge your payment method for the total amount of your order.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">4. Shipping and Delivery</h2>
            <p>
              We strive to process and ship orders promptly. Delivery times are estimates and not guaranteed. We are not liable for any delays in delivery caused by shipping carriers or circumstances beyond our control.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">5. Returns and Refunds</h2>
            <p>
              If you are not satisfied with your purchase, please contact us within 7 days of delivery. Refunds will be issued at our discretion and in accordance with our return policy. Products must be returned in their original condition.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">6. Account and Authentication</h2>
            <p>
              Our website uses Google OAuth for user authentication. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">7. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the property of {business.name} and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">8. Limitation of Liability</h2>
            <p>
              {business.name} shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our services. Our total liability shall not exceed the amount paid by you for the specific product or service giving rise to the claim.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes indicates your acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href={`mailto:${contact.email}`} className="text-[#2563eb] hover:underline">
                {contact.email}
              </a>
              {" "}or call us at{" "}
              <a href={`tel:+${contact.phoneRaw}`} className="text-[#2563eb] hover:underline">
                {contact.phone}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
