import { UserPlus, CloudUpload, Unlock } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Create an account",
    description: "Sign up for free to get your secure storage.",
    icon: UserPlus,
  },
  {
    step: 2,
    title: "Upload your files",
    description:
      "Upload any type of files. We support all major file types with high-speed upload.",
    icon: CloudUpload,
  },
  {
    step: 3,
    title: "Access",
    description: "Access your files from any device, anywhere in the world.",
    icon: Unlock,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-24 scroll-mt-24" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            How it works
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Get started with StuffVault in three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-20 grid gap-16 lg:grid-cols-3">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-12 h-px left-[16.66%] right-[16.66%]  bg-blue-200" />

          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative text-center">
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z- ">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {item.step}
                  </span>
                </div>

                {/* Icon card */}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-200">
                  <Icon className="text-blue-600" size={36} />
                </div>

                {/* Text */}
                <h3 className="mt-8 text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
