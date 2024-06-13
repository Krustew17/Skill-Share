import React, { useState } from "react";
import { toast, Bounce, ToastContainer } from "react-toastify";
export default function ChangePasswordTabContent() {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    // Function to handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://127.0.0.1:3000/auth/password/change",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify(formData),
                    credentials: "include",
                }
            );
            const data = await response.json();
            console.log(data);
            if (data.HttpStatus !== 200) {
                setErrorMessage(data.message);
            } else {
                toast.success("Password changed successfully", {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });

                setErrorMessage("");

                setFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 shadow-lg dark:shadow-slate-700 p-4 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                Change Password
            </h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <p className="text-red-500 mt-3 mb-3 text-md">
                        {errorMessage}
                    </p>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="currentPassword"
                        className="block text-lg mb-1 dark:text-white"
                    >
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 dark:text-black focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="newPassword"
                        className="block text-lg mb-1 dark:text-white"
                    >
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 dark:text-black focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-lg mb-1 dark:text-white"
                    >
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 dark:text-black focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                >
                    Change Password
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}
