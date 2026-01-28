import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import RegistrationForm from "./Forms/Register.jsx";
import MainView from "./Component/MainView.jsx";
import Login from "./Forms/Login.jsx";
import VerifyOtp from "./Forms/VerifyOtp.jsx";
import UsersPage from "./Component/UsersPage.jsx";
import Settings from "./Component/Settings.jsx";
import SubscriptionPlans from "./Subscription/SubscriptionPlans.jsx";
import LandingPage from "./Component/LandingPage.jsx";

import { fetchUser } from "./apis/userApi.js";
import PublicRoute from "./Routes/PublicRoute.jsx";
import ProtectedRoute from "./Routes/ProtectedRoute.jsx";
import RoleRoute from "./Routes/RoleRoute.jsx";
import InvalidRoute from "./Component/InvalidRoute.jsx";

export default function AppRoutes() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


  

  // 🔐 Fetch user ONCE on app load
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
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

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Routes>
      {/* ================= LANDING ================= */}
      <Route path="/" element={<LandingPage userData={userData} />} />

      {/* ================= PUBLIC ================= */}
      <Route element={<PublicRoute user={userData} loading={loading} />}>
        <Route path="/login" element={<Login setUserData={setUserData} />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/verify" element={<VerifyOtp />} />

        {/* Public 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* ================= PROTECTED ================= */}
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

        {/* handle the default routes */}
        <Route path="/directory/:dirId/*" element={<InvalidRoute />} />

        <Route path="/subplans" element={<SubscriptionPlans />} />

        <Route
          path="/setting"
          element={<Settings setUserData={setUserData} />}
        />

        {/* ===== ROLE BASED ===== */}
        <Route
          element={
            <RoleRoute
              user={userData}
              allowedRoles={["Admin", "Owner", "Manager"]}
            />
          }
        >
          <Route
            path="/users"
            element={<UsersPage setUserData={setUserData} />}
          />
        </Route>

        {/* Protected 404 */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
    </Routes>
  );
}
