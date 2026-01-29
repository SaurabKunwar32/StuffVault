import { useEffect } from "react";

export default function Terms() {
     useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: January 2026
        </p>

        <section className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              1. Use of the Service
            </h2>
            <p>
              StuffVault allows users to create, manage, and store portfolio
              content using our tools and templates. You agree to use the
              service only for lawful purposes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              2. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account and all activities that occur under it.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              3. User Content
            </h2>
            <p>
              You retain ownership of the content you create or upload.
              We only use your data to provide the service and do not claim
              ownership.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              4. Third-Party Authentication
            </h2>
            <p>
              We support login through third-party providers like Google and
              GitHub. Their services are governed by their own policies.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              5. Termination
            </h2>
            <p>
              We may suspend or terminate accounts that violate these terms
              or misuse the platform.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              6. Disclaimer
            </h2>
            <p>
              StuffVault is provided “as is” without warranties of any kind.
              We do not guarantee uninterrupted or error-free service.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              7. Contact
            </h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <span className="font-medium">support@stuffvault.com</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
