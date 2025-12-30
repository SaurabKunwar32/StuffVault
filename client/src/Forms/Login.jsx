import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Github, Archive, Lock } from 'lucide-react';
import { loginWithGithub } from '../apis/loginWithGithub.js';
import { loginWithGoogle } from '../apis/loginWithGoogle.js';
import { loginUser } from "../apis/userApi.js";

export default function Login() {

    const [formData, setFormData] = useState({
        email: "keme88@gmail.com",
        password: "abcd",
    });

    // serverError will hold the error message from the server
    const [serverError, setServerError] = useState("");

    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (serverError) setServerError(""); // clear error when typing
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData)
            if (data.error) setServerError(data.error);
            else navigate("/");
        } catch (error) {
            console.error("Error:", error);
            setServerError(error.response?.data?.error || "Something went wrong. Please try again.");
        }
    }



    // If there's an error, we'll add "input-error" class to both fields
    const hasError = Boolean(serverError);

    // Auto-hide toast after 4 seconds
    useEffect(() => {
        if (serverError) {
            const timer = setTimeout(() => setServerError(""), 4000);
            return () => clearTimeout(timer);
        }
    }, [serverError]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">

            {/*  Toast Notification */}
            {serverError && (
                <div className="fixed top-5 right-5 z-50 w-80 max-w-xs bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-start space-x-3 animate-slideIn">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
                        </svg>
                    </div>
                    {/* Message */}
                    <div className="flex-1 text-sm font-medium">{serverError}</div>
                </div>
            )}


            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl space-y-6 transition-all duration-300">
                <div className="mb-8 flex flex-col items-center">

                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg">
                            <Archive className="h-5 w-5" />
                        </div>

                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                            Stuff<span className="text-gray-500">Vault</span>
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <p className="mt-2 text-l text-gray-500 text-center">
                        Sign in to continue to your storage
                    </p>

                </div>

                {/* <div className="flex justify-center items-center mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">1</div>
                    <div className="w-16 h-1 bg-gray-200 mx-2 rounded"></div>
                    <div className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center text-black font-semibold">
                        2
                    </div>
                </div> */}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                onChange={handleChange}
                                value={formData.email}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                className={`w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ${hasError ? "input-error" : ""}`}
                                required
                            />
                            <div className="absolute left-3 top-3.5 text-gray-400">
                                📧
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                onChange={handleChange}
                                value={formData.password}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ${hasError ? "input-error" : ""}`}
                                required
                            />
                            <div className="absolute left-3 top-3.5 text-gray-400">
                                🔒
                            </div>
                        </div>

                        {/* Example error message */}
                        {serverError && <span className="text-sm text-red-500 mt-2 block">{serverError}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md transition duration-200"
                    >
                        Login
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                        Register
                    </Link>
                </p>

                {/* Divider */}
                <div className="flex items-center space-x-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-sm text-gray-500">or</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>

                <div className="flex justify-center items-center">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                const data = await loginWithGoogle(credentialResponse.credential);
                                if (data.error) {
                                    setServerError(data.error);
                                    return;
                                }
                                navigate("/");
                            } catch (err) {
                                // console.error("Login error:", err);  
                                setServerError(err.response.data.error);
                            }
                        }}
                        onError={() => console.log("Google Login failed or user dismissed One Tap")}
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


    )
}
