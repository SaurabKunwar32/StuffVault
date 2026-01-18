import { useState } from "react";
import SubscriptionCards from "./SubscriptionCards.jsx";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SUBSCRIPTION_DATA = {
  monthly: [
    {
      id: "price_month_starter",
      name: "Starter",
      tagline: "Great for individuals",
      storage: "2 TB",
      price: 199,
      period: "/mo",
      cta: "Choose Starter",
      features: [
        "Secure cloud storage",
        "Link & folder sharing",
        "30-day file recovery",
        "Community support",
      ],
      popular: false,
    },
    {
      id: "price_month_pro",
      name: "Pro",
      tagline: "For creators & devs",
      storage: "5 TB",
      price: 399,
      period: "/mo",
      cta: "Choose Pro",
      features: [
        "Everything in Starter",
        "Priority uploads",
        "90-day version history",
        "Email support",
      ],
      popular: true,
    },
    {
      id: "price_month_ultimate",
      name: "Ultimate",
      tagline: "Teams & power users",
      storage: "10 TB",
      price: 699,
      period: "/mo",
      cta: "Choose Ultimate",
      features: [
        "Everything in Pro",
        "Advanced sharing controls",
        "180-day version history",
        "Priority email support",
      ],
      popular: false,
    },
  ],

  yearly: [
    {
      id: "price_year_starter",
      name: "Starter",
      tagline: "Best value for individuals",
      storage: "2 TB",
      price: 1999,
      period: "/yr",
      cta: "Choose Starter",
      features: [
        "Secure cloud storage",
        "Link & folder sharing",
        "1-year file recovery",
        "Device sync across 3 devices",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "price_year_pro",
      name: "Pro",
      tagline: "Serious creators & professionals",
      storage: "5 TB",
      price: 3999,
      period: "/yr",
      cta: "Choose Pro",
      features: [
        "Everything in Starter",
        "Unlimited priority uploads",
        "2-year version history",
        "Advanced sharing analytics",
        "Priority email support",
      ],
      popular: true,
    },
    {
      id: "price_year_ultimate",
      name: "Ultimate",
      tagline: "Long-term teams & businesses",
      storage: "10 TB",
      price: 6999,
      period: "/yr",
      cta: "Choose Ultimate",
      features: [
        "Everything in Pro",
        "Unlimited version history",
        "Admin & access controls",
        "Audit logs & activity tracking",
        "Dedicated priority support",
      ],
      popular: false,
    },
  ],
};

export default function SubscriptionPlans() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("monthly");

  return (
    <div className="relative bg-slate-50/60 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <header className="relative mb-10">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="group absolute left-0 top-1 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <ChevronLeft
              size={18}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            <span>Back</span>
          </button>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Simple, transparent pricing
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Choose a plan that fits your usage. Upgrade or downgrade anytime.
            </p>
          </div>
        </header>

        {/* Billing Toggle */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
            {["monthly", "yearly"].map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`relative rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {m === "monthly" ? "Monthly billing" : "Yearly billing"}
                  {m === "yearly" && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Save 20%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SUBSCRIPTION_DATA[mode].map((plan) => (
            <SubscriptionCards key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Prices shown are for demonstration purposes only. Payments are
          currently disabled.
        </p>
      </div>
    </div>
  );
}
