import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Cloud, Github } from "lucide-react";
import { loginWithGoogle } from "../apis/loginWithGoogle.js";
import { loginWithGithub } from "../apis/loginWithGithub.js";
import { sendOtp } from "../apis/authApi.js";

export default function Register() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "saurab ",
    email: "keme88@gmail.com",
    password: "abcd",
  });

  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      await sendOtp(email);
      navigate("/verify", { state: { email, formData } });
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Something went wrong sending OTP.",
      );
    } finally {
      setIsSuccess(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-4 overflow-hidden">
      <div className="w-full max-w-md bg-white  py-4 px-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="mb-4 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
              <Cloud size={26} strokeWidth={1.2} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Stuff<span className="text-gray-500">Vault</span>
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-500 text-center">
            Create an Account
          </p>
        </div>

        {/* Steps */}
        <div className="flex justify-center items-center mb-4">
          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            1
          </div>
          <div className="w-12 h-1 bg-gray-200 mx-2 rounded"></div>
          <div className="w-7 h-7 border border-gray-400 rounded-full flex items-center justify-center text-sm font-semibold">
            2
          </div>
        </div>

        {serverError && (
          <p className="text-sm text-red-600 mb-2 text-center">{serverError}</p>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSendOtp}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              onChange={handleChange}
              // value={formData.name}
              placeholder="Ericc "
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              type="text"
              name="name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              onChange={handleChange}
              // value={formData.email}
              placeholder="test@email.com"
              className={`w-full px-4 py-2 border rounded-xl shadow-sm outline-none focus:ring-2 ${
                serverError
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              type="email"
              name="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              onChange={handleChange}
              // value={formData.password}
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              type="password"
              name="password"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-xl font-semibold text-white transition-colors ${
              isSuccess
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSuccess ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {/* Login */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center space-x-2 mt-3">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Social Logins */}
        <div className="flex justify-center items-center mt-3">
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
                navigate("/app", { replace: true });
              } catch (err) {
                setServerError(err.response?.data?.error);
              }
            }}
            onError={() => console.log("Google Login failed")}
            useOneTap
          />
        </div>

        <div className="flex justify-center mt-3">
          <button
            onClick={loginWithGithub}
            className="w-[300px] h-[44px] flex items-center justify-center gap-2 bg-[#24292f] text-white rounded-md hover:bg-[#1b1f23] transition-colors"
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
