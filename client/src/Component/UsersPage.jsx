import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  LogOut,
  UserCircle2,
  RotateCcw,
  Users,
  CheckCircle,
  Zap,
  ArrowLeft,
} from "lucide-react";
import ConfirmActionModal from "./ConfirmActionModal";
import {
  fetchAllUsers,
  fetchUser,
  deleteUserById,
  logoutUserById,
  deleteUserPermanentlyById,
  updateUserRole as apiUpdateUserRole,
  restoreUserById
} from "../apis/userApi.js";

export default function UsersPage() {
  const BASE_URL = "http://localhost:3000";
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const [userRole, setUserRole] = useState("User");
  const [notificationPopup, setNotificationPopup] = useState({
    message: "",
    type: "",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    user: null,
  });

  // console.log(confirmModal.isOpen, confirmModal.type, confirmModal.user);

  async function refreshUsers() {
    try {
      const usersData = await fetchAllUsers();
      setUsers(usersData.transformedUsers);
      setDeletedUsers(usersData.deletedUsers);

      const currentUser = await fetchUser();
      setUserName(currentUser.name);
      setUserEmail(currentUser.email);
      setUserRole(currentUser.role);
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  }


  useEffect(() => {
    refreshUsers()
  }, []);

  // async function fetchUsers() {
  //   try {
  //     const data = await fetchAllUsers(); // already JSON

  //     setUsers(data.transformedUsers);
  //     setDeletedUsers(data.deletedUsers);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);

  //     // If your helper throws on HTTP errors, handle them here
  //     if (error.status === 403) navigate("/");
  //     else if (error.status === 401) navigate("/login");
  //   }
  // }


  // async function fetchCurrentUser() {
  //   try {
  //     const data = await fetchUser(); // already JSON
  //     setUserName(data.name);
  //     setUserEmail(data.email);
  //     setUserRole(data.role);
  //   } catch (error) {
  //     // Custom helpers often throw normal Error objects, not Axios-style
  //     if (error.status === 401) navigate("/login");
  //     else console.error("Fetching user failed:", error);
  //   }
  // }


  const logoutUser = async (user) => {
    try {
      const { data } = await logoutUserById(user.id)

      setNotificationPopup({
        message: `${user.name} logged out successfully!`,
        type: "logout",
      });
      console.log(data);

      refreshUsers()
    } catch (error) {
      console.error("Logout error:", error);

      setNotificationPopup({
        message: error.response?.data?.error || `Error logging out ${user.name}`,
        type: "error",
      });
    }
  };


  const deleteUser = async (user) => {
    try {
      // Call Axios helper
      await deleteUserById(user.id);

      // Show success notification
      setNotificationPopup({
        message: `${user.name} soft deleted!`,
        type: "delete",
      });

      // Refresh user data
      await refreshUsers();
    } catch (err) {
      console.error("Delete error:", err);

      setNotificationPopup({
        message:
          err.response?.data?.error ||
          err.message ||
          `Failed to soft delete ${user.name}`,
        type: "error",
      });
    }
  };


  const deleteUserPermanently = async (user) => {
    try {
      await deleteUserPermanentlyById(user.id);

      // Show success notification
      setNotificationPopup({
        message: `${user.name} permanently deleted!`,
        type: "delete",
      });

      // Update state immediately to refresh UI
      // setUsers((prevUsers) =>
      //   prevUsers.filter((u) => u.id !== user.id)
      // );
      await refreshUsers();

    } catch (err) {
      console.error("Permanent delete error:", err);

      setNotificationPopup({
        message:
          err.response?.data?.error ||
          err.message ||
          `Error permanently deleting ${user.name}`,
        type: "error",
      });
    }
  };


  const restoreUser = async (user) => {
    try {
      await restoreUserById(user._id);
      // Assuming the API responds with success info
      setNotificationPopup({
        message: `${user.name} restored successfully!`,
        type: "restore",
      });

      await refreshUsers();
    } catch (error) {
      console.error("Restore error:", error);

      setNotificationPopup({
        message: `Error restoring ${user.name}`,
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (notificationPopup.message) {
      const timer = setTimeout(
        () => setNotificationPopup({ message: "", type: "" }),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [notificationPopup]);

  // Function to update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      if (newRole === "Owner") {
        return setNotificationPopup({
          message: `You cannot set the  "${newRole}" role !!`,
          type: "error",
        });
      }

      await apiUpdateUserRole(userId, newRole);
      // Assuming your API returns success info
      setNotificationPopup({
        message: `Role updated successfully to "${newRole}"!`,
        type: "success",
      });

      await refreshUsers();
    } catch (error) {
      console.error("Update role error:", error);

      setNotificationPopup({
        message: error.response?.data?.error || "Error updating role",
        type: "error",
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200">
      {/* Top Bar */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <UserCircle2 className="w-8 h-8 text-gray-600" />
            <div>
              <p className="font-semibold text-gray-800">{userName}</p>
              <p className="text-sm text-gray-500">{userEmail}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${userRole === "Admin"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
              }`}
          >
            {userRole}
          </span>
        </div>
      </header>

      {notificationPopup.message && (
        <div
          className={`fixed top-5 right-5 z-50 w-80 max-w-xs px-5 py-3 rounded-lg shadow-lg flex items-start space-x-3 animate-slideIn
      ${notificationPopup.type === "logout" ? "bg-yellow-500 text-white" : ""}
      ${notificationPopup.type === "delete" ? "bg-red-600 text-white" : ""}
      ${notificationPopup.type === "error" ? "bg-red-600 text-white" : ""}
      ${notificationPopup.type === "restore" ? "bg-green-500 text-white" : ""}
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

      {/* Main Content */}
      <main className="flex flex-col items-center py-3 px-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-tight mb-10">
            User Management Dashboard
          </h1>
          {/* --- User Stats Section --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="text-2xl font-semibold text-gray-800">
                  {users.length + deletedUsers.length}
                </span>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg text-white">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-2xl font-semibold text-gray-800">
                  {users.length}
                </span>
              </div>
              <div className="bg-green-500 p-3 rounded-lg text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Online Users</span>
                <span className="text-2xl font-semibold text-gray-800">
                  {users.filter((u) => u.isLoggedIn).length}
                </span>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg text-white">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Deleted Users</span>
                <span className="text-2xl font-semibold text-gray-800">
                  {deletedUsers.length}
                </span>
              </div>
              <div className="bg-red-500 p-3 rounded-lg text-white">
                <Trash2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              👥 All Users
            </h2>
          </div>

          {/* --- Active Users Table --- */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-12">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                  <th className="py-3 px-5 text-left">Name</th>
                  <th className="py-3 px-5 text-left">Email</th>
                  <th className="py-3 px-5 text-left">Role</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-5 text-center">Actions</th>
                  {(userRole === "Admin" || userRole === "Owner") && (
                    <th className="py-3 px-5 text-center">Soft Delete</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`transition duration-200 hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                  >
                    <td className="py-4 px-5 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-4 px-5 text-gray-700">{user.email}</td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${user.isLoggedIn
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {user.isLoggedIn ? "Online" : "Offline"}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-center">
                      {userRole === "Admin" || userRole === "Owner" ? (
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold 
        ${user.role === "Admin" ? "bg-red-100 text-red-700" :
                              user.role === "Owner" ? "bg-blue-100 text-blue-700" :
                                user.role === "Manager" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-green-100 text-green-700"}
        cursor-pointer hover:opacity-90 transition duration-200`}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Owner">Owner</option>
                          <option value="Manager">Manager</option>
                          <option value="User">User</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold 
        ${user.role === "Admin" ? "bg-red-100 text-red-700" :
                              user.role === "Owner" ? "bg-blue-100 text-blue-700" :
                                user.role === "Manager" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-green-100 text-green-700"}`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>

                    {/* <td className="py-4 px-5 text-center">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          updateUserRole(user.id, e.target.value)
                        }
                        className="px-3 py-1 rounded-full border border-gray-300 bg-white text-sm font-semibold cursor-pointer hover:bg-gray-100"
                      >
                        {" "}
                        <option value="Admin">Admin</option>{" "}
                        <option value="Owner">Owner</option>{" "}
                        <option value="Manager">Manager</option>{" "}
                        <option value="User">User</option>{" "}
                      </select>{" "}
                    </td> */}

                    <td className="py-4 px-5">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() =>
                            setConfirmModal({ isOpen: true, type: "logout", user })
                          }
                          disabled={!user.isLoggedIn}
                          className={`flex items-center gap-2 justify-center px-4 py-2 rounded-lg text-sm font-medium transition ${user.isLoggedIn
                            ? "bg-yellow-500 text-white hover:bg-yellow-600 shadow"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>

                      </div>
                    </td>

                    {(userRole === "Admin" || userRole === "Owner") && (
                      <td className="py-4 px-5 text-center">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() =>
                              setConfirmModal({ isOpen: true, type: "delete", user })
                            }
                            disabled={userEmail === user.email}
                            className={`flex items-center gap-2 justify-center px-4 py-2 rounded-lg text-sm font-medium transition shadow ${userEmail === user.email
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-red-500 text-white hover:bg-red-600"
                              }`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>

                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- Deleted Users Table (only show if there are deleted users) --- */}
          {deletedUsers.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                🗑️ Deleted Users
              </h2>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                      <th className="py-3 px-5 text-left">Name</th>
                      <th className="py-3 px-5 text-left">Email</th>
                      {userRole === "Owner" && (
                        <th className="py-3 px-5 text-center">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {deletedUsers.map((user, idx) => (
                      <tr
                        key={user._id}
                        className={`transition duration-200 hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                      >
                        <td className="py-4 px-5 font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="py-4 px-5 text-gray-700">
                          {user.email}
                        </td>

                        {userRole === "Owner" && (
                          <td className="py-4 px-5 text-center">
                            <button
                              onClick={() => restoreUser(user)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition shadow"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Restore
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Empty State */}
          {users.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p>No users found.</p>
            </div>
          )}

          <ConfirmActionModal
            isOpen={confirmModal.isOpen}
            type={confirmModal.type}
            user={confirmModal.user}
            onClose={() => setConfirmModal({ isOpen: false, type: "", user: null })}
            onConfirm={() => {
              if (confirmModal.type === "logout") {
                logoutUser(confirmModal.user);
                // navigate('/login')
              } else if (confirmModal.type === "delete") {
                deleteUser(confirmModal.user);
                console.log("deleted user");
              }
              setConfirmModal({ isOpen: false, type: "", user: null });
            }}
            onPermanentDelete={() => {
              deleteUserPermanently(confirmModal.user)
              setConfirmModal({ isOpen: false, type: "", user: null });
            }}
          />


        </div>
      </main>
    </div>
  );
}
