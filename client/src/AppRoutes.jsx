import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import RegistrationForm from "./Forms/Register";
import MainView from "./Component/MainView.jsx";
import Login from "./Forms/Login";
import VerifyOtp from "./Forms/VerifyOtp.jsx";
import UsersPage from "./Component/UsersPage.jsx";
import Settings from "./Component/Settings.jsx";
import SubscriptionPlans from "./Subscription/SubscriptionPlans.jsx";

import { fetchUser } from "./apis/userApi.js";
import PublicRoute from "./Component/PublicRoute.jsx";
import ProtectedRoute from "./Component/ProtectedRoute.jsx";
import RoleRoute from "./Component/RoleRoute.jsx";
import LandingPage from "./Component/LandingPage.jsx";
import { useLocation } from "react-router-dom";

export default function AppRoutes() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH USER ONLY ONCE (COOKIE / SESSION BASED)

  const location = useLocation();
  const PROTECTED_PREFIXES = [
    "/app",
    "/directory",
    "/users",
    "/setting",
    "/subplans",
  ];

  useEffect(() => {
    const isProtectedRoute = PROTECTED_PREFIXES.some((path) =>
      location.pathname.startsWith(path),
    );

    // DO NOT fetch user unless route is protected
    if (!isProtectedRoute) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadUserData() {
      try {
        const data = await fetchUser();
        setUserData(data);
      } catch {
        setUserData(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage userData={userData} />} />

      {/* ========= PUBLIC ROUTES ========= */}
      <Route
        path="/login"
        element={
          <PublicRoute user={userData} loading={loading}>
            <Login setUserData={setUserData} />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute user={userData} loading={loading}>
            <RegistrationForm />
          </PublicRoute>
        }
      />

      <Route
        path="/verify"
        element={
          <PublicRoute user={userData} loading={loading}>
            <VerifyOtp />
          </PublicRoute>
        }
      />

      {/* ========= PROTECTED ROUTES ========= */}
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
        <Route path="/subplans" element={<SubscriptionPlans />} />
        <Route
          path="/setting"
          element={<Settings setUserData={setUserData} />}
        />

        {/* ========= ROLE BASED ========= */}
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
      </Route>

      {/* ========= FALLBACK ========= */}
      <Route
        path="*"
        element={
          loading ? null : userData ? (
            <Navigate to="/app" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
