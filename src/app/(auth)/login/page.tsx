"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Base_Url } from "@/utils/constans";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'
import Link from "next/link";

type LoginFormInputs = {
    email: string;
    password: string;
};

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setLoading(true);
            setErrorMsg(null);

            const res = await axios.post(`${Base_Url}/auth/login`, data);
            if (res.data.success) {
                Cookies.set("accessToken", res.data.data.accessToken);
                router.push("/admin");
            } else {
                setErrorMsg("Invalid credentials");
            }
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#01244a] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <h1 className="text-2xl font-bold text-center text-[#01244a] mb-6">
                    Login
                </h1>

                {errorMsg && (
                    <p className="text-red-600 text-center mb-4">{errorMsg}</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-background">
                    {/* Email */}
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

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full px-4 py-2 border border-background outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01244a]"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <div>
                        <span>Forgot your passowrd? <Link href={'/password-reset'} className="underline">click here</Link></span>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#01244a] text-white font-semibold py-2 rounded-lg hover:bg-[#023060] transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
