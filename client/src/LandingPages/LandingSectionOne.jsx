import { ArrowRight, Cloud } from "lucide-react";
import uiImage from "../assets/ui.png";
import { Link } from "react-router-dom";

export default function LandingSectionOne() {
  return (
    <section className=" text-gray-900 max-w-6xl mx-auto lg:pt-20 pt-10">
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 z-50 w-full  bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
                <Cloud size={22} strokeWidth={1.5} className="text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Stuff<span className="text-gray-500">Vault</span>
              </h2>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600 ">
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-gray-900 transition cursor-pointer"
              >
                Features
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-gray-900 transition cursor-pointer"
              >
                How It Works
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("plans")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-gray-900 transition cursor-pointer"
              >
                Plans
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/login"
                className="hidden sm:inline text-sm text-gray-600 hover:text-gray-900 transition"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-blue-600 px-4 sm:px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main className="flex  flex-col items-center justify-center px-4 text-center pt-16">
        <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Store everything in
          <span className="block mt-3 text-blue-600">one secure vault.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-lg text-gray-600">
          Stuff Vault is a fast, secure, and scalable cloud storage platform.
          Upload, organize, and access your files anytime with enterprise-level
          protection and simple controls.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to={"/register"}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => {
              document
                .getElementById("plans")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition cursor-pointer"
          >
            View plans
          </button>
        </div>
      </main>

      <div className="min-h-fit  flex items-center justify-center p-4 md:p-8  mt-4">
        <div className="w-full max-w-[1400px]">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden ">
            {/* ===== macOS Top Bar ===== */}
            <div className="h-12 bg-slate-50 border-b flex items-center relative px-4 ">
              {/* mac dots */}
              <div className="flex gap-2 absolute left-4">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="w-3 h-3 bg-green-500 rounded-full" />
              </div>

              {/* title */}
              <div className="mx-auto">
                <span className="text-sm text-slate-500 bg-slate-100 px-4 py-1 rounded-full">
                  app.stuffvault.com.np
                </span>
              </div>
            </div>

            {/* ===== IMAGE CONTENT ===== */}
            <div className="bg-white p-2 md:p-4">
              <img
                src={uiImage}
                alt="StuffVault UI"
                className="
                w-full
                h-auto
                rounded-2xl
                border
                border-slate-200
              "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
