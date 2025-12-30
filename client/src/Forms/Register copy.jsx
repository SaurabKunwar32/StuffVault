import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from "../apis/loginWithGoogle.js";
import { Ear, Github } from "lucide-react";
import { loginWithGithub } from "../apis/loginWithGithub.js";
import { registerUser } from "../apis/userApi.js";
import { sendOtp, verifyOtp } from '../apis/authApi.js'


export default function Register() {

    const [formData, setFormData] = useState({
        name: "saurab ",
        email: "keme8832@gmail.com",
        password: "abcd",
    });

    // serverError will hold the error message from the server
    const [serverError, setServerError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // OTP state
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const navigate = useNavigate();

    // Handle the input changes
    const handleChange = (e) => {
        // console.log({ [e.target.name]: e.target.value });
        // const { name, value } = e.target;
        // console.log({ name, value });

        // Clear the server error as soon as the user starts typing in Email
        // if (name === "email" && serverError) {
        //     setServerError("");
        // }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        console.log(formData);
    };

    // Countdown timer for resend
    // useEffect(() => {
    //     if (countdown <= 0) return;
    //     const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    //     return () => clearTimeout(timer);
    // }, [countdown]);


    const handleSendOtp = async () => {
        const { email } = formData;
        console.log(email);
        if (!email) {
            setOtpError("Please enter your email first.");
            return;
        }

        try {
            // setIsSending(true);
            const data = await sendOtp(email);
            console.log(data);
            // Assuming a successful response means OTP sent
            // setOtpSent(true);
            // setCountdown(60); // allow resend after 60s
            // setOtpError("");
        } catch (err) {
            console.error("Send OTP error:", err);
            setOtpError(err.response?.data?.error || "Something went wrong sending OTP.");
        }
        //   finally {
        //     // setIsSending(false);
        // }
    };



    const handleVerifyOtp = async () => {
        const { email } = formData;
        if (!otp) {
            setOtpError("Please enter OTP.");
            return;
        }

        try {
            setIsVerifying(true);
            const data = await verifyOtp(email, otp);

            // Assuming a successful response means OTP verified
            setOtpVerified(true);
            setOtpError("");
        } catch (err) {
            console.error("Verify OTP error:", err);
            setOtpError(err.response?.data?.error || "Invalid or expired OTP.");
        } finally {
            setIsVerifying(false);
        }
    };



    // Handler for form submission

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSuccess(false);
        if (!otpVerified) return setOtpError("Please verify your email with OTP.");
        try {
            await registerUser({ ...formData, otp })
            setIsSuccess(true);
            setTimeout(() => navigate("/"), 2000);;
        } catch (error) {
            console.error("Error:", error);
            setServerError(error.response?.data?.error || "Something went wrong. Please try again.");

        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">

            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl transition-all duration-300">
                <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
                    Create an Account
                </h2>
                <form className="space-y-6"
                //  onSubmit={handleSubmit}
                >
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


                    {/* Email Input + Send OTP */}
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
                                className={`w-full pr-32 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${serverError
                                    ? "border-red-500 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                required
                            />

                            {/* <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isSending || countdown > 0}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm rounded-lg text-white transition
      ${isSending || countdown > 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {isSending
                                    ? "Sending..."
                                    : countdown > 0
                                        ? `${countdown}s`
                                        : "Send OTP"}
                            </button> */}

                        </div>
                        {serverError && (
                            <span className="text-sm text-red-600 mt-1">{serverError}</span>
                        )}
                    </div>

                    {/* OTP Input + Verify */}
                    {/* {otpSent && (
                        <div className="mb-4">
                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Enter OTP
                            </label>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="4-digit OTP"
                                    maxLength={4}
                                    required
                                    className="w-full pr-28 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={isVerifying || otpVerified}
                                    className={`absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-white text-sm transition
          ${otpVerified
                                            ? "bg-green-600"
                                            : isVerifying
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                >
                                    {isVerifying
                                        ? "..."
                                        : otpVerified
                                            ? "✓"
                                            : "Verify"}
                                </button>
                            </div>

                            {otpError && (
                                <span className="text-sm text-red-600 mt-1">{otpError}</span>
                            )}
                        </div>
                    )} */}

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
                        // disabled={!otpVerified || isSuccess}
                        onClick={handleSendOtp}
                        className={`w-full text-white py-2 rounded-xl font-semibold shadow-md transition-colors duration-300 ease-in-out
                                ${isSuccess
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        Send OTP
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
