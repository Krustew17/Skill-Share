import React, { useState } from "react";

export default function ChangePasswordTabContent() {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Function to handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                Change Password
            </h3>
            <form onSubmit={handleSubmit}>
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
                        name="currentPassword"
                        value={formData.currentPassword}
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
                        name="confirmPassword"
                        value={formData.confirmPassword}
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
        </div>
    );
}
