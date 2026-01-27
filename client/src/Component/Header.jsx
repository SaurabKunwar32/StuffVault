import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  User,
  LogOut,
  LogIn,
  ChevronDown,
  Plus,
  Grid3X3,
  List,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { logoutUser, logoutAllSessions } from "../apis/userApi.js";

export default function Header({
  onCreateFolderClick,
  onUploadFilesClick,
  fileInputRef,
  handleFileSelect,
  SetShowInLines,
  disabled = false,
  userData,
  setUserData,
}) {
  // const BASE_URL = "http://localhost:3000";

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userRole, setUserRole] = useState("User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const [userPicture, setUserPicture] = useState("");
  // const [maxStorageInBytes, setMaxStorageInBytes] = useState(0);
  // const [usedStorageInBytes, setUsedStorageInBytes] = useState(0);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // const usedGB = usedStorageInBytes / 1024 ** 3;
  // const totalGB = (maxStorageInBytes / 1024 ** 3).toFixed(2);

  // const percentageUsed = totalGB > 0 ? (usedGB / totalGB) * 100 : 0;

  useEffect(() => {
    if (!userData) {
      setLoggedIn(false);
      setUserName("Guest User");
      setUserEmail("guest@example.com");
      setUserPicture("");
      return;
    }

    setLoggedIn(true);
    setUserRole(userData.role);
    setUserName(userData.name);
    setUserEmail(userData.email);
  }, [userData]);

  // Toggle dropdown

  const handleUserIconClick = () => {
    setShowUserMenu((prev) => !prev);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log("logged outt user");
      setUserData(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  // Logout all devices
  const handleLogoutAll = async () => {
    try {
      await logoutAllSessions();
      setUserData(null);
    } catch (err) {
      console.error("Logout all error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleDocumentClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  return (
    <>
      {/* HEADER BAR */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-end">
          {/* USER SECTION */}
          <div className="relative" ref={userMenuRef}>
            <div
              className="flex items-center justify-between w-64 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
              onClick={handleUserIconClick}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full overflow-hidden flex items-center justify-center">
                  {userPicture ? (
                    <img
                      src={userPicture}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                <div className="truncate">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {userName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {userEmail}
                  </div>
                </div>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-600 transform transition-transform duration-200 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* USER DROPDOWN */}
            {showUserMenu && (
              <div className="absolute top-full right-0 w-64 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {loggedIn ? (
                  <>
                    <div className="py-2">
                      <button
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        onClick={handleLogout}
                      >
                        <LogOut className="text-red-500" size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>

                    <div className="py-2">
                      <button
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        onClick={handleLogoutAll}
                      >
                        <LogOut className="text-orange-500" size={18} />
                        <span className="font-medium">Logout all devices</span>
                      </button>
                    </div>

                    <div className="py-2">
                      <button
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        onClick={() => navigate("/setting")}
                      >
                        <Settings className="text-blue-500" size={18} />
                        <span className="font-medium">Settings</span>
                      </button>
                    </div>

                    {(userRole === "Owner" ||
                      userRole === "Admin" ||
                      userRole === "Manager") && (
                      <div className="py-2">
                        <button
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          onClick={() => navigate("/users")}
                        >
                          <LayoutDashboard
                            className="text-green-500"
                            size={18}
                          />
                          <span className="font-medium">Dashboard</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="flex items-center space-x-2 px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors duration-200 rounded-md"
                    onClick={() => {
                      navigate("/login");
                      setShowUserMenu(false);
                    }}
                  >
                    <LogIn size={16} />
                    <span className="text-sm font-medium">Login</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* FILE + FOLDER ACTION BAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Create Folder */}
            <button
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              title="Create folder"
              onClick={onCreateFolderClick}
              disabled={disabled}
            >
              <Plus size={16} />
              <span>New Folder</span>
            </button>

            {/* Upload Files */}
            <button
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              title="Upload Files"
              onClick={onUploadFilesClick}
              disabled={disabled}
            >
              <Upload size={16} />
              <span>Upload</span>
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </div>

          {/* Search & View Switcher */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {/* <div > */}
              <button
                className="p-2 rounded-md hover:bg-gray-200 cursor-pointer "
                onClick={() => SetShowInLines(false)}
              >
                <Grid3X3 size={18} />
              </button>
              {/* </div>
              <div> */}
              <button
                className="p-2 rounded-md hover:bg-gray-200 cursor-pointer "
                onClick={() => SetShowInLines(true)}
              >
                {" "}
                <List size={18} />
              </button>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
