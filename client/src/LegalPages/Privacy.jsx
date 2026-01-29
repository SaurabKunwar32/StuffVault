import { useEffect } from "react";

export default function Privacy() {
     useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: January 2026
        </p>

        <section className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              1. Information We Collect
            </h2>
            <p>
              We may collect your name, email address, authentication details,
              and portfolio data you create on StuffVault.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              2. How We Use Your Data
            </h2>
            <p>
              Your data is used to authenticate users, provide services,
              improve features, and maintain platform security.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              3. Data Sharing
            </h2>
            <p>
              We do not sell your personal data. Information may be shared only
              with authentication providers or when required by law.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              4. Data Security
            </h2>
            <p>
              We use reasonable security measures to protect your data, but no
              system can be completely secure.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              5. Cookies
            </h2>
            <p>
              We may use cookies or local storage to maintain sessions and
              improve user experience.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              6. Your Rights
            </h2>
            <p>
              You may request access, updates, or deletion of your data at any
              time.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              7. Contact
            </h2>
            <p>
              For privacy concerns, contact us at{" "}
              <span className="font-medium">privacy@stuffvault.com</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
