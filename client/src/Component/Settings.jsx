import { useState, useEffect } from "react";
import { User, Lock, LogOut, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchUser,
  updateUser,
  setUserPassword,
  changeUserPassword,
  logoutAllSessions,
  logoutUser as apiLogoutUser,
} from "../apis/userApi.js";

export default function Settings({ setUserData }) {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    picture: "",
    hashPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // const [serverError,  setServerError] = useState("");
  const [notificationPopup, setNotificationPopup] = useState({
    message: "",
    type: "",
  });
  const navigate = useNavigate();

  // Password fields for both cases
  const [setPassData, setSetPassData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassData, setChangePassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function fetchCurrentUser() {
    try {
      const res = await fetchUser();

      const data = res.data || res;

      setProfileData({
        name: data.name,
        email: data.email,
        role: data.role,
        picture: data.picture,
        hashPassword: data.hasPassword,
      });

      setEditedName(data.name || "");
    } catch (error) {
      console.error(
        "Error fetching user info:",
        error.response?.data?.error || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  function parseApiError(err, defaultMsg = "Something went wrong") {
    // fallback message first
    let errorMessage =
      err?.response?.data?.message || err?.message || defaultMsg;

    // ✅ Handle Zod-style validation errors: { errors: { field: ["msg"] } }
    if (err?.response?.data?.errors) {
      const fieldErrors = err.response.data.errors;

      errorMessage = Object.values(fieldErrors).flat().join("\n");
    }

    return errorMessage;
  }

  useEffect(() => {
    if (notificationPopup.message) {
      const timer = setTimeout(
        () => setNotificationPopup({ message: "", type: "" }),
        3000,
      );
      return () => clearTimeout(timer);
    }
  }, [notificationPopup]);

  async function handleNameSave() {
    const updatedName = editedName.trim();
    if (!updatedName) {
      setNotificationPopup({
        message: "Name cannot be empty!",
        type: "error",
      });
      return;
    }

    if (updatedName.length < 3) {
      setNotificationPopup({
        message: "Name at least 3 letters!",
        type: "error",
      });
      return;
    }
    try {
      setNotificationPopup({ message: "", type: "" });

      //  Call your Axios API helper
      const data = await updateUser(updatedName);

      //  Update local state
      setProfileData((prev) => ({
        ...prev,
        name: data.name || updatedName,
      }));

      setIsEditing(false);
      // console.log(data);
      setNotificationPopup({
        message: data.message || "Name updated successfully!",
        type: "success",
      });
    } catch (err) {
      // console.error("Error updating name:", err.response.data);
      const message = parseApiError(
        err,
        "Failed to update name. Please try again.",
      );
      setIsEditing(false);
      // console.log(err.response.data);
      setNotificationPopup({
        message: err.response.data || message,
        type: "error",
      });
    }
  }

  //  For users WITH password (change password)
  async function handleChangePassword() {
    const { currentPassword, newPassword, confirmPassword } = changePassData;

    const newTrimmed = newPassword.trim();

    if (newTrimmed.length < 4) {
      return setNotificationPopup({
        message: "Password should not contain any spaces (i.e:'  123').",
        type: "error",
      });
    }

    // Validation checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setNotificationPopup({
        message: "Please fill all fields.",
        type: "error",
      });
    }

    if (newPassword !== confirmPassword) {
      return setNotificationPopup({
        message: "New passwords do not match.",
        type: "error",
      });
    }

    if (newPassword.length < 4) {
      // fixed length check
      return setNotificationPopup({
        message: "Password must be at least 4 characters.",
        type: "error",
      });
    }

    if (newPassword === currentPassword) {
      return setNotificationPopup({
        message: "New password cannot be the same as the current password.",
        type: "error",
      });
    }

    try {
      setNotificationPopup({ message: "", type: "" });

      //  Use Axios helper
      const data = await changeUserPassword(currentPassword, newPassword);

      setNotificationPopup({
        message: data.message || "Password updated successfully!",
        type: "success",
      });

      // Clear form
      setChangePassData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const message = parseApiError(
        err,
        "Failed to update password. Please try again.",
      );

      setNotificationPopup({
        message: err.response.data || message,
        type: "error",
      });
      setChangePassData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }

  // For users with NO password yet (set new)
  async function handleSetPassword() {
    const { newPassword, confirmPassword } = setPassData;

    // Validation checks
    if (!newPassword || !confirmPassword) {
      return setNotificationPopup({
        message: "Please fill all fields.",
        type: "error",
      });
    }

    if (newPassword !== confirmPassword) {
      return setNotificationPopup({
        message: "Passwords do not match.",
        type: "error",
      });
    }

    if (newPassword.length < 4) {
      // fixed to match your message
      return setNotificationPopup({
        message: "Password must be at least 4 characters.",
        type: "error",
      });
    }

    try {
      // Use Axios helper
      const data = await setUserPassword(newPassword);

      setNotificationPopup({
        message: data.message || "Password set successfully!",
        type: "success",
      });

      // Clear form
      setSetPassData({ newPassword: "", confirmPassword: "" });

      // Refresh user data
      fetchCurrentUser();
    } catch (err) {
      const message = parseApiError(
        err,
        "Failed to update password. Please try again.",
      );

      setNotificationPopup({
        message,
        type: "error",
      });
    }
  }

  const logoutUser = async () => {
    try {
      // Call Axios logout helper
      const data = await apiLogoutUser();
      setUserData(null);
      // Show success notification
      setNotificationPopup({
        message: data.message || "Logged out from this device successfully!",
        type: "logout",
      });
      // Redirect to login page
      //   navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);

      // Show error notification
      setNotificationPopup({
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to log out from this device.",
        type: "error",
      });
    }
  };

  const handleLogoutAll = async () => {
    try {
      // Call Axios helper
      const data = await logoutAllSessions();
      setUserData(null);
      // Show success notification
      setNotificationPopup({
        message: data.message || "Logged out from all devices successfully!",
        type: "logout",
      });

      // Redirect to login page
      //   navigate("/login");
    } catch (err) {
      console.error("LogoutAll error:", err);

      // Show error notification
      setNotificationPopup({
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to log out from all devices.",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200">
        <div className="flex flex-col items-center gap-6">
          {/* Spinner */}
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>

          {/* Text */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Loading user data
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Please wait while we prepare your data !!
            </p>
          </div>
        </div>
      </div>
    );  
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {notificationPopup.message && (
        <div
          className={`fixed top-5 right-5 z-50 w-80 max-w-xs px-5 py-3 rounded-lg shadow-lg flex items-start space-x-3 animate-slideIn
      ${notificationPopup.type === "logout" ? "bg-yellow-500 text-white" : ""}
      ${notificationPopup.type === "error" ? "bg-red-600 text-white" : ""}
      ${notificationPopup.type === "success" ? "bg-green-500 text-white" : ""}
    `}
        >
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              />
            </svg>
          </div>
          <div className="flex-1 text-sm font-medium">
            {notificationPopup.message}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-700" />
              <h1 className="text-xl font-semibold text-gray-900">
                Profile Settings
              </h1>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="mt-1 text-sm font-medium text-gray-800">
                {profileData.name}
              </span>
              <div className="mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {profileData.role.charAt(0).toUpperCase() +
                  profileData.role.slice(1)}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 space-y-8">
            {/* Profile Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleNameSave}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm
                                                cursor-pointer"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md">
                      <span className="text-gray-900">{profileData.name}</span>
                      <button
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-600 cursor-not-allowed">
                    {profileData.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}

            {profileData.hashPassword ? (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangePassword();
                }}
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={changePassData.currentPassword}
                    onChange={(e) =>
                      setChangePassData({
                        ...changePassData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={changePassData.newPassword}
                    onChange={(e) =>
                      setChangePassData({
                        ...changePassData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={changePassData.confirmPassword}
                    onChange={(e) =>
                      setChangePassData({
                        ...changePassData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Confirm password"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Password
                </button>
              </form>
            ) : (
              // If user does not have a password (set new)
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSetPassword();
                }}
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={setPassData.newPassword}
                    onChange={(e) =>
                      setSetPassData({
                        ...setPassData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Create new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={setPassData.confirmPassword}
                    onChange={(e) =>
                      setSetPassData({
                        ...setPassData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Set Password
                </button>
              </form>
            )}

            {/* Security Section */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security & Sessions
              </h2>

              <div className="space-y-4">
                {/* Logout from this device */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Logout from this device
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Sign out from your current session
                    </p>
                  </div>
                  <button
                    onClick={logoutUser}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>

                {/* Logout from all devices */}
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-md border border-red-100">
                  <div>
                    <h3 className="font-medium text-red-900">
                      Logout from all devices
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Sign out from all active sessions across all devices
                    </p>
                  </div>
                  <button
                    onClick={handleLogoutAll}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout All
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End Body */}
        </div>
      </div>
    </div>
  );
}
