import { Cloud } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Top */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <Cloud className="text-white" size={22} />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                StuffVault
              </span>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-gray-600">
              Secure cloud storage for all your important files and memories.
            </p>
          </div>

          {/* Product */}
          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
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
              </li>

              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-gray-900 transition cursor-pointer"
                >
                  How it Works
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("plans")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="hover:text-gray-900 transition cursor-pointer"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer hover:text-gray-900 transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex items-start sm:items-end lg:items-center">
            <button className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              Get Started
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          © 2025 StuffVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
