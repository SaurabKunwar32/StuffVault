import { useEffect, useState } from "react";

function Price({ value }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-semibold text-slate-700">$</span>
      <span className="text-4xl font-bold tracking-tight text-slate-900">
        {value}
      </span>
    </div>
  );
}

export default function SubscriptionCards({ plan, currentUserData }) {
  const [subId, setSubId] = useState("");

  // console.log(currentUserData);

  const handleClick = (plan) => {
    setSubId(plan.id);
    // console.log(plan.id);
  };

  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (currentUserData) {
      setUserData({
        name: currentUserData.name,
        email: currentUserData.email,
      });
    }
  }, [currentUserData]);

  useEffect(() => {
    if (!subId) return;

    const updateSubscription = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/billing/subscription",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({ subId, userData }),
          },
        );

        const { checkoutUrl } = await response.json();
        window.location.href = checkoutUrl;
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    updateSubscription();
  }, [subId]);

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl bg-white p-6 transition-all duration-200 ${
        plan.popular
          ? "border-2 border-blue-600 shadow-lg shadow-blue-500/10"
          : "border border-slate-200 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
          Most popular
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {plan.storage}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>
      </div>

      {/* Price */}
      <div className="mb-6 flex items-end gap-2">
        <Price value={plan.price} />
        <span className="pb-1 text-sm text-slate-500">{plan.period}</span>
      </div>

      {/* Features */}
      <ul className="mb-8 space-y-3 text-sm text-slate-600">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => handleClick(plan)}
        className={`mt-auto w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
          plan.popular
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {plan.cta}
      </button>
    </div>
  );
}
