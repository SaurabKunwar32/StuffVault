import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import RegistrationForm from "./Forms/Register";
import Login from "./Forms/Login";
import VerifyOtp from "./Forms/VerifyOtp.jsx";
import MainView from "./Component/MainView.jsx";
import UsersPage from "./Component/UsersPage.jsx";
import Settings from "./Component/Settings.jsx";
import SubscriptionPlans from "./Subscription/SubscriptionPlans.jsx";
import LandingPage from "./Component/LandingPage.jsx";
import InvalidRoute from "./Component/InvalidRoute.jsx";

import { fetchUser } from "./apis/userApi.js";
import PublicRoute from "./Routes/PublicRoute.jsx";
import ProtectedRoute from "./Routes/ProtectedRoute.jsx";
import RoleRoute from "./Routes/RoleRoute.jsx";
import { useLocation } from "react-router-dom";
import Terms from "./LegalPages/Terms.jsx";
import Privacy from "./LegalPages/Privacy.jsx";

export default function AppRoutes() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const PROTECTED_PREFIXES = [
    "/app",
    "/directory",
    "/users",
    "/setting",
    "/subplans",
  ];

  // Only fetch user if the route is protected
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      if (
        !PROTECTED_PREFIXES.some((prefix) =>
          location.pathname.startsWith(prefix),
        )
      ) {
        setLoading(false); // public page, skip fetch
        return;
      }

      try {
        const data = await fetchUser();
        if (mounted) setUserData(data);
      } catch {
        if (mounted) setUserData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();

    return () => (mounted = false);
  }, [location.pathname]);

  return (
    <Routes>
      {/* LANDING */}
      <Route path="/" element={<LandingPage />} />

      {/* PUBLIC ROUTES */}
      <Route element={<PublicRoute user={userData} loading={loading} />}>
        <Route path="/login" element={<Login setUserData={setUserData} />} />
        <Route path="/register" element={<RegistrationForm setUserData={setUserData}  />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute user={userData} loading={loading} />}>
        <Route
          path="/app"
          element={
            <MainView
              userData={userData}
              loading={loading}
              setUserData={setUserData}
            />
          }
        />

        <Route
          path="/directory/:dirId"
          element={
            <MainView
              userData={userData}
              loading={loading}
              setUserData={setUserData}
            />
          }
        />

        <Route
          path="/subplans"
          element={
            <SubscriptionPlans userData={userData} setUserData={setUserData} />
          }
        />
        <Route path="*" element={<InvalidRoute />} />
        <Route
          path="/setting"
          element={<Settings setUserData={setUserData} />}
        />

        {/* ROLE BASED */}
        <Route
          element={
            <RoleRoute
              user={userData}
              loading={loading}
              allowedRoles={["Admin", "Owner", "Manager"]}
            />
          }
        >
          <Route path="/users" element={<UsersPage setUserData={setUserData} />} />
        </Route>
      </Route>
    </Routes>
  );
}
