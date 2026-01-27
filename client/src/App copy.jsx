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

const App = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ========= PUBLIC ROUTES ========= */}
        <Route
          path="/login"
          element={
            <PublicRoute user={userData} loading={loading}>
              <Login />
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

        {/* ========= AUTHENTICATED ROUTES ========= */}
        <Route element={<ProtectedRoute user={userData} loading={loading} />}>
          {/* All logged-in users */}
          <Route path="/" element={<MainView userData={userData} />} />
          <Route
            path="/directory/:dirId"
            element={<MainView userData={userData} />}
          />
          <Route path="/subplans" element={<SubscriptionPlans />} />
          <Route path="/setting" element={<Settings />} />

          {/* ========= ADMIN / OWNER / MANAGER ========= */}
          <Route
            element={
              <RoleRoute
                user={userData}
                allowedRoles={["Admin", "Owner", "Manager"]}
              />
            }
          >
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>

        {/* ========= FALLBACK ========= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
