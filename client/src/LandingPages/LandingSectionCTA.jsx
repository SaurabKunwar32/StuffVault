import { Link } from "react-router-dom";

export default function LandingSectionCTA() {
  return (
    <section className="py-28 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 px-6 py-20 text-center sm:px-12">
          
          {/* Glow effect */}
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Secure cloud storage, <br className="hidden sm:block" />
              built for everyday use
            </h2>

            {/* Subheading */}
            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-blue-100">
              Upload, organize, and access your files anytime, anywhere.
              Start free and upgrade only when you need more space.
            </p>

            {/* CTA Button */}
            <div className="mt-12 flex justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm sm:text-base font-semibold text-blue-600 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                Get Started for Free
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
