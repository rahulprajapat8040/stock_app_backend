"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Base_Url } from "@/utils/constans";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

type LoginFormInputs = {
    email: string;
    otp: string;
    password: string;
};

const PasswordReset = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const [step, setStep] = useState(1);  // Track the step (email, otp, password)
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();

    // Step 1: Email submission handler
    const onSubmitEmail = async (data: LoginFormInputs) => {
        try {
            setLoading(true);
            setErrorMsg(null);

            const res = await axios.post(`${Base_Url}/auth/password-reset-req`, { email: data.email });
            if (res.data.success) {
                setStep(2);  // Move to OTP step
            } else {
                setErrorMsg("Failed to send OTP. Please try again.");
            }
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: OTP verification handler
    const onSubmitOTP = async (data: LoginFormInputs) => {
        try {
            setLoading(true);
            setErrorMsg(null);

            const res = await axios.post(`${Base_Url}/auth/verify-otp`, { email: data.email, otp: data.otp });
            if (res.data.success) {
                setStep(3);  // Move to password reset step
            } else {
                setErrorMsg("Invalid OTP. Please try again.");
            }
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Password reset handler
    const onSubmitPassword = async (data: LoginFormInputs) => {
        try {
            setLoading(true);
            setErrorMsg(null);

            const res = await axios.post(`${Base_Url}/auth/reset-password`, { email: data.email, newPassword: data.password });
            if (res.data.success) {
                router.push("/login");  // Redirect to login after password reset
            } else {
                setErrorMsg("Failed to reset password. Please try again.");
            }
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#01244a] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-center text-[#01244a] mb-6">
                    {step === 1 ? "Enter Your Email" : step === 2 ? "Enter OTP" : "Enter New Password"}
                </h1>

                {errorMsg && (
                    <p className="text-red-600 text-center mb-4">{errorMsg}</p>
                )}

                {/* Email Step */}
                {step === 1 && (
                    <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-5 text-background">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className="w-full px-4 py-2 border border-background outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01244a]"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#01244a] text-white font-semibold py-2 rounded-lg hover:bg-[#023060] transition disabled:opacity-60"
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* OTP Step */}
                {step === 2 && (
                    <form onSubmit={handleSubmit(onSubmitOTP)} className="space-y-5 text-background">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                OTP
                            </label>
                            <input
                                type="text"
                                {...register("otp", { required: "OTP is required" })}
                                className="w-full px-4 py-2 border border-background outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01244a]"
                                placeholder="Enter the OTP"
                            />
                            {errors.otp && (
                                <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#01244a] text-white font-semibold py-2 rounded-lg hover:bg-[#023060] transition disabled:opacity-60"
                        >
                            {loading ? "Verifying OTP..." : "Verify OTP"}
                        </button>
                    </form>
                )}

                {/* Password Reset Step */}
                {step === 3 && (
                    <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-5 text-background">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className="w-full px-4 py-2 border border-background outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01244a]"
                                placeholder="Enter your new password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#01244a] text-white font-semibold py-2 rounded-lg hover:bg-[#023060] transition disabled:opacity-60"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PasswordReset;
