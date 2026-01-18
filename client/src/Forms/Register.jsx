import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {  Cloud, Github } from "lucide-react";
import { loginWithGoogle } from "../apis/loginWithGoogle.js";
import { loginWithGithub } from "../apis/loginWithGithub.js";
import { sendOtp } from "../apis/authApi.js";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "saurab ",
    email: "keme88@gmail.com",
    password: "abcd",
  });

  // serverError will hold the error message from the server
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    // console.log({ [e.target.name]: e.target.value });
    const { name, value } = e.target;
    // console.log({ name, value });

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const { email } = formData;
    if (!email) {
      setServerError("Please enter your email first.");
      return;
    }

    try {
      setIsSuccess(true);
      const data = await sendOtp(email);
      // console.log("OTP send:", data);
      navigate("/verify", { state: { email, formData } });
    } catch (err) {
      console.error("Send OTP error:", err);
      setServerError(
        err.response?.data?.error || "Something went wrong sending OTP.",
      );
    } finally {
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl transition-all duration-300">
        <div className="mb-8 flex flex-col items-center">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-500">
              <Cloud size={28} strokeWidth={1.2} className="text-white" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Stuff<span className="text-gray-500">Vault</span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="mt-2 text-l text-gray-500 text-center">
            Create an Account
          </p>
        </div>

        <div className="flex justify-center items-center mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            1
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-2 rounded"></div>
          <div className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center text-black font-semibold">
            2
          </div>
        </div>

        {serverError && (
          <span className="text-sm text-red-600 mt-1">{serverError}</span>
        )}

        <form className="space-y-6" onSubmit={handleSendOtp}>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              onChange={handleChange}
              value={formData.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email  */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative w-full">
              <input
                onChange={handleChange}
                value={formData.email}
                className={`w-full pr-32 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  serverError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                // required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              onChange={handleChange}
              value={formData.password}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full text-white py-2 rounded-xl font-semibold shadow-md transition-colors duration-300 ease-in-out
                                ${
                                  isSuccess
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
          >
            {isSuccess ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <div className="flex justify-center items-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const data = await loginWithGoogle(credentialResponse.credential);
              if (data.error) {
                console.error(data.error);
                return;
              }
              navigate("/"); //  Works only if inside component
            }}
            onError={() => {
              console.log("Login Failed");
            }}
            useOneTap
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={loginWithGithub}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-[#24292f] text-white rounded-lg hover:bg-[#1b1f23] transition-colors"
          >
            <Github size={20} />
            <span>Continue with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
}
