import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { sendOtp, verifyOtp } from "../apis/authApi.js";
import { registerUser } from "../apis/userApi.js";

export default function Verify() {
    const navigate = useNavigate();
    const location = useLocation();

    const { email, formData } = location.state || {};

    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [serverError, setServerError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    if (!email || !formData) {
        navigate("/register");
    }

    const handleVerify = async () => {
        setServerError("");
        if (otp.length !== 4) {
            setServerError("OTP must be 4 digits.");
            return;
        }

        try {
            setIsVerifying(true);
            await verifyOtp(email, otp);
            await handleRegister();
        } catch (err) {
            setServerError(err.response?.data?.error || "Something went wrong.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleRegister = async () => {
        try {
            const res = await registerUser({ ...formData, otp });
            setSuccessMsg(res.message || "Account created successfully! Redirecting to login...");
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setServerError(err.response?.data?.error || "Failed to register user.");
        }
    };

    const handleSendOtp = async () => {
        if (!email) {
            setServerError("Email not found. Please go back and enter your email.");
            return;
        }

        try {
            const data = await sendOtp(email);
            // console.log(data.message);
            setSuccessMsg(data.message || "Verification code sent to your email!");
            setServerError("");
        } catch (err) {
            // console.log(err.response?.data);
            setServerError(err.response?.data || "Something went wrong sending OTP.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                {/* Header */}
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Verify Your Identity</h2>
                <p className="text-center text-gray-500 mb-6">
                    Enter the verification code sent to your email
                </p>

                {/* Progress */}
                <div className="flex justify-center items-center mb-6">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">1</div>
                    <div className="w-16 h-1 bg-green-200 mx-2 rounded"></div>
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">2</div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-100 text-blue-800 text-center text-sm p-2 rounded mb-4">
                    We've sent a 4-digit verification code to {email}
                </div>

                {/* Server / success messages */}
                {serverError ? (
                    <p className="text-sm text-red-600 mb-3 bg-red-100 p-3 rounded">
                        {serverError}
                    </p>
                ) : successMsg ? (
                    <p className="text-sm text-green-600 mb-2 bg-green-100 p-3 rounded">
                        {successMsg}
                    </p>
                ) : null}

                {/* OTP Input */}
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                        setOtp(e.target.value);
                        setServerError(null);
                    }} maxLength={4}
                    placeholder="Enter 4-digit code"
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                {/* Links */}
                <div className="flex justify-between text-sm mb-6">
                    <Link to="/register" className="text-blue-600 hover:underline">
                        ← Back to Details
                    </Link>
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={handleSendOtp}
                    >
                        Resend Code
                    </button>
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className={`w-full py-3 rounded-lg bg-blue-600 text-white font-semibold transition ${isVerifying ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                >
                    {isVerifying ? "Verifying..." : "Verify & Register"}
                </button>

                {/* Sign up link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
}
