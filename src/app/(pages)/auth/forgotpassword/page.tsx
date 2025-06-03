"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (!email) {
            setMessage("Please enter your email address.");
            return;
        }   
        try {
            const response = await axios.post("/api/auth/recover", { email });
            if (response.data.success) {
                setMessage(`If an account with ${email} exists, a password reset link has been sent.`);
            } else {
                setMessage(response.data.error || "An error occurred. Please try again.");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data.error || "An error occurred. Please try again.");
            } else {
                setMessage("An unexpected error occurred. Please try again.");
            }


        // setTimeout(() => {
        //     router.push("/");
        // }, 3000);
    };
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Forgot Password
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold"
                    >
                        Send Reset Link
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-sm text-green-600 text-center font-medium">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
