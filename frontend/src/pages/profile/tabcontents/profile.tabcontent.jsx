import React, { useState, useEffect } from "react";

export default function ProfileTabContent({ profileData }) {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        location: "",
    });

    // Effect to set initial form data when profileData changes
    useEffect(() => {
        setFormData({
            username: profileData?.username,
            firstName: profileData?.firstName,
            lastName: profileData?.lastName,
            location: profileData?.location,
        });
    }, [profileData]);

    // Function to handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to submit form data to backend or update state
        console.log("Form submitted:", formData);
    };

    return (
        <div className="min-w-xl bg-white dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                Edit Profile
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block text-lg mb-1 dark:text-gray-200"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md dark:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="firstName"
                        className="block text-lg mb-1 dark:text-gray-200"
                    >
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md dark:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="lastName"
                        className="block text-lg mb-1 dark:text-gray-200"
                    >
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md dark:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="location"
                        className="block text-lg mb-1 dark:text-gray-200"
                    >
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md  dark:bg-whitefocus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
