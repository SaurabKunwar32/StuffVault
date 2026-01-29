import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  LogIn,
  ChevronDown,
  Cloud,
} from "lucide-react";
import { logoutUser, logoutAllSessions } from "../apis/userApi.js";

export default function Header({ userData, setUserData }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  // const [userRole, setUserRole] = useState("User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const [userPicture, setUserPicture] = useState("");

  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      setLoggedIn(false);
      setUserName("Guest User");
      setUserEmail("guest@example.com");
      setUserPicture("");
      return;
    }

    setLoggedIn(true);
    // setUserRole(userData.role);
    setUserName(userData.name);
    setUserEmail(userData.email);
    setUserPicture(userData.picture);
  }, [userData]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUserData(null);
    } finally {
      setShowUserMenu(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllSessions();
      setUserData(null);
    } finally {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center  ">
      <div className="flex justify-between items-center w-full  max-w-[1540px] mx-auto">
        {/* LOGO */}
        <Link to={userData ? "/app" : "/"} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Cloud size={20} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">
            StuffVault
          </span>
        </Link>

        {/* USER MENU */}
        <div className="relative" ref={userMenuRef}>
          <div
            className="flex items-center justify-between w-64 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => setShowUserMenu((p) => !p)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                {userPicture ? (
                  <img
                    src={userPicture}
                    alt="user"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={18} className="text-white" />
                )}
              </div>

              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{userName}</div>
                <div className="text-xs text-gray-500 truncate">
                  {userEmail}
                </div>
              </div>
            </div>
            <ChevronDown
              size={16}
              className={`transition ${showUserMenu ? "rotate-180" : ""}`}
            />
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              {loggedIn ? (
                <div className="py-2">
                  <MenuItem
                    icon={<LogOut size={18} className="text-red-500" />}
                    label="Logout"
                    onClick={handleLogout}
                  />
                  <MenuItem
                    icon={<LogOut size={18} className="text-orange-500" />}
                    label="Logout all devices"
                    onClick={handleLogoutAll}
                  />
                </div>
              ) : (
                <div className="py-2">
                  <MenuItem
                    icon={<LogIn size={16} />}
                    label="Login"
                    onClick={() => navigate("/login")}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
