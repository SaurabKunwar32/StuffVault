import {
  ShieldCheck,
  FileText,
  Cloud,
  Share2,
  Settings,
  Zap,
  CreditCard,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure by Default",
    description:
      "Your files are protected with encrypted storage, secure authentication, and optional two-factor verification. Privacy and safety come first.",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: FileText,
    title: "Smart File Organization",
    description:
      "Upload any file in seconds and keep everything organized with folders, grid or list views, instant previews, and fast search.",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Cloud,
    title: "Reliable Cloud Storage",
    description:
      "Store your files safely in the cloud and access them anytime from any device with high availability and fast load times.",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: CreditCard,
    title: "Simple & Transparent Payments",
    description:
      "Upgrade your storage anytime with clear pricing and secure payments. No hidden fees, no surprises—pay only for what you use.",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Settings,
    title: "Full Account Control",
    description:
      "Manage your storage, track usage, and customize settings from a simple, intuitive dashboard built for everyday users.",
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    icon: Zap,
    title: "Fast & Smooth Experience",
    description:
      "Optimized performance ensures quick uploads, instant previews, and smooth navigation—no waiting, no lag.",
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

export default function LandingSectionTwo() {
  return (
    <section className="bg-white py-20 scroll-mt-24" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Everything you need to manage your digital assets
          </h2>
          <p className="mt-4 text-gray-600 text-base sm:text-lg">
            Powerful features designed for speed, security, and collaboration.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto ">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-gray-80 p-6 hover:shadow-md transition bg-slate-100"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
                >
                  <Icon className={`${feature.iconColor}`} size={22} />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
