import {
  ShieldCheck,
  FileText,
  Cloud,
  Share2,
  Settings,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Enterprise-Grade Security",
    description:
      "Secure access with OAuth (Google & GitHub), 2FA, and encrypted storage. Your data is protected by industry-leading security standards.",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: FileText,
    title: "Intelligent File Management",
    description:
      "Upload any file type with drag-and-drop ease. Organize with grid views, powerful search, and instant previews for documents and media.",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Cloud,
    title: "Seamless Cloud Integration",
    description:
      "Import directly from Google Drive and enjoy lightning-fast global access via CloudFront CDN and AWS S3 storage.",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Share2,
    title: "Advanced Sharing Controls",
    description:
      "Share securely with granular permissions. Control who views or edits your files with role-based access and real-time activity logs.",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Settings,
    title: "Comprehensive Admin Tools",
    description:
      "Manage users, monitor storage usage, and control system-wide settings from a powerful, centralized dashboard.",
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast Performance",
    description:
      "Experience zero latency with optimized global content delivery, ensuring your files are always available when you need them.",
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

export default function LandingSectionTwo() {
  return (
    <section className="bg-white py-20">
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
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
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
