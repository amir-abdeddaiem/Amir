"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function SetNewPassword({userId}: { userId?: string }) {
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.put(`/api/auth/recover`,{
                userId:userId,
                code:code,
                pass:newPassword
            })
            if (response.data.success) {
                setMessage("Password updated successfully!");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setMessage(response.data.error || "An error occurred. Please try again.");
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data.error || "An error occurred. Please try again.");
            } else {
                setMessage("An unexpected error occurred. Please try again.");
            }
            return;
        }



    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Set New Password
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            6-Digit Code
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the code"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Re-enter password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold"
                    >
                        Set New Password
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
