import { Link, Navigate } from "react-router-dom";
import LandingSectionOne from "../LandingPages/LandingSectionOne";
import SubscriptionPlans from "../Subscription/SubscriptionPlans";
import LandingSectionTwo from "../LandingPages/LandingSectionTwo";
import HowItWorks from "../LandingPages/HowItWorks.jsx";
import LandingSectionCTA from "../LandingPages/LandingSectionCTA.jsx";
import Footer from "../LandingPages/Footer.jsx";

export default function LandingPage({ userData }) {
  // Redirect logged-in users away from landing
  if (userData) {
    return <Navigate to="/app" replace />;
  }

  return (
    // <div className="min-h-screen flex flex-col">
    //   {/* Top Bar */}
    //   <header className="flex justify-between items-center px-6 py-4 shadow-sm">
    //     <h1 className="text-xl font-bold text-indigo-600">StuffVault</h1>

    //     <div className="flex gap-3">
    //       <Link
    //         to="/login"
    //         className="px-4 py-2 border rounded-lg hover:bg-gray-100"
    //       >
    //         Login
    //       </Link>

    //       <Link
    //         to="/register"
    //         className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
    //       >
    //         Register
    //       </Link>
    //     </div>
    //   </header>

    //   {/* Hero */}
    //   <main className="flex-1 flex items-center justify-center text-center px-4">
    //     <div>
    //       <h2 className="text-4xl font-bold mb-4">
    //         Secure Cloud Storage for Everything
    //       </h2>
    //       <p className="text-gray-600 max-w-xl mx-auto">
    //         Store, manage, and access your files securely from anywhere.
    //       </p>
    //     </div>
    //   </main>
    // </div>
    <>
      <LandingSectionOne />
      <LandingSectionTwo />
      <HowItWorks />
      <SubscriptionPlans />
      <LandingSectionCTA />
      <Footer />
    </>
  );
}
