import React, { useState } from "react";
import { DiVim } from "react-icons/di";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";

export default function SendResetPasswordRequest() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let resetToken;
    const hasResetToken = queryParams.has("resetToken");

    if (hasResetToken) {
        resetToken = queryParams.get("resetToken");
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();

        const body = {
            password: formData.password,
            confirmPassword: formData.confirmPassword,
        };

        const request = await fetch(
            import.meta.env.VITE_API_URL +
                "/auth/reset-password?resetToken=" +
                resetToken,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );
        const responseJson = await request.json();

        if (responseJson.HttpStatus === 200) {
            setErrorMessage("");
            toast.success(responseJson.message, {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            setTimeout(() => {
                window.location.replace("/");
            }, 2000);
        } else {
            setErrorMessage(responseJson.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            email: formData.email,
        };

        const request = await fetch(
            import.meta.env.VITE_API_URL + "/auth/request-password-reset",
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );
        const responseJson = await request.json();

        if (responseJson.statusCode === 404) {
            setErrorMessage(responseJson.message);
        } else if (responseJson.HttpStatus === 200) {
            setErrorMessage("");
            toast.success(responseJson.message, {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            setTimeout(() => {
                window.location.replace("/");
            }, 2000);
        }
    };

    return (
        <div>
            {hasResetToken ? (
                <div className="flex items-center justify-center mx-auto mt-60 px-4">
                    <form
                        onSubmit={handleResetPasswordSubmit}
                        className="bg-white p-6 rounded-lg shadow-xl dark:shadow-md dark:border dark:border-white dark:shadow-slate-400 shadow-slate-300 dark:bg-gray-800 w-full max-w-md"
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">
                            Reset Password
                        </h2>
                        <div className="text-red-500 mt-2 mb-2">
                            {errorMessage}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-gray-700 mb-2 dark:text-white"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                placeholder="Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-gray-700 mb-2 dark:text-white"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                placeholder="Confirm Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex items-center justify-center mx-auto mt-60 px-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-lg shadow-xl dark:shadow-md dark:border dark:border-white dark:shadow-slate-400 shadow-slate-300 dark:bg-gray-800 w-full max-w-md"
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">
                            Send Password Reset Email
                        </h2>
                        <div className="text-red-500 mt-2 mb-2">
                            {errorMessage}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-gray-700 mb-2 dark:text-white"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="Email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}
