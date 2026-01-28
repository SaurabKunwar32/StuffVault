import { useState } from "react";
import SubscriptionCards from "./SubscriptionCards.jsx";
import Header from "../Component/Header.jsx";

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

export default function SubscriptionPlans({ setUserData, userData }) {
  // const navigate = useNavigate();

  const [mode, setMode] = useState("monthly");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white max-w-[1540px] mx-auto">
      {/* GLOBAL HEADER */}
      {userData ? <Header userData={userData} setUserData={setUserData} /> : ""}
      {/* PAGE CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 py-14">
        {/* PAGE HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Choose a plan that fits your storage needs. Upgrade or downgrade
            anytime.
          </p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full bg-slate-100 p-1 ring-1 ring-slate-200">
            {["monthly", "yearly"].map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {m === "monthly" ? "Monthly" : "Yearly"}
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

        {/* PRICING GRID */}
        <section className="mt-14">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SUBSCRIPTION_DATA[mode].map((plan) => (
              <SubscriptionCards key={plan.id} plan={plan} />
            ))}
          </div>
        </section>

        {/* FOOTER NOTE */}
        <div className="mt-14 text-center">
          <p className="text-xs text-slate-500">
            Prices shown are for demonstration purposes only. Payments are
            currently disabled.
          </p>
        </div>
      </main>
    </div>
  );
}
