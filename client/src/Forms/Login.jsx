import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Github, Cloud } from "lucide-react";
import { loginWithGithub } from "../apis/loginWithGithub.js";
import { loginWithGoogle } from "../apis/loginWithGoogle.js";
import { loginUser, fetchUser } from "../apis/userApi.js";

export default function Login({ setUserData }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    email: "keme88@gmail.com",
    password: "abcd",
  });

  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      if (data.error) {
        setServerError(data.error);
        return;
      }
      const user = await fetchUser();
      setUserData(user);
      navigate("/app", { replace: true });
    } catch (error) {
      setServerError(
        error.response?.data?.error ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const hasError = Boolean(serverError);

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => setServerError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 py-6 overflow-hidden">
      {/* Toast */}
      {serverError && (
        <div className="fixed top-5 right-5 z-50 w-80 bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{serverError}</p>
        </div>
      )}

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-5">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-500">
              <Cloud size={28} strokeWidth={1.2} className="text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Stuff<span className="text-gray-500">Vault</span>
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              onChange={handleChange}
              // value={formData.email}
              placeholder="test@email.com"
              type="email"
              name="email"
              className={`w-full px-4 py-3 border rounded-xl shadow-sm
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${hasError ? "border-red-500" : "border-gray-300"}`}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              onChange={handleChange}
              // value={formData.password}
              placeholder="********"
              type="password"
              name="password"
              className={`w-full px-4 py-3 border rounded-xl shadow-sm
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${hasError ? "border-red-500" : "border-gray-300"}`}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            &nbsp;Register
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center space-x-2">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const data = await loginWithGoogle(
                  credentialResponse.credential,
                );
                if (data.error) {
                  setServerError(data.error);
                  return;
                }
                const user = await fetchUser();
                setUserData(user);
                navigate("/app", { replace: true });
              } catch (err) {
                setServerError(err.response?.data?.error);
              }
            }}
            onError={() => console.log("Google Login failed")}
            useOneTap
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={loginWithGithub}
            className="w-[300px] h-[44px]  cursor-pointer flex items-center justify-center gap-2 bg-[#24292f] text-white rounded-md hover:bg-[#1b1f23] transition-colors"
          >
            <Github size={18} />
            <span className="text-sm font-medium">Continue with GitHub</span>
          </button>
        </div>

        <p className="mt-4 text-xs text-center text-gray-500 leading-relaxed">
          By continuing, you agree to our{" "}
          <Link
            to="/terms"
            className="text-indigo-600 hover:underline font-medium"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="text-indigo-600 hover:underline font-medium"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
