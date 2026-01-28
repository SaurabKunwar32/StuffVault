import { Link } from "react-router-dom";

export default function LandingSectionCTA() {
  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-500 px-6 py-20 text-center sm:px-12">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Ready to store your stuff?
          </h2>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-blue-100">
            Join thousands of users who trust Storemystuff for their cloud
            storage needs. Start with 500MB free.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Link to={'/register'} className="rounded-full bg-white px-10 py-4 text-sm sm:text-base font-semibold text-blue-600 shadow-md hover:bg-blue-50 transition">
              Create Free Account
            </Link>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-sm text-blue-100">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
