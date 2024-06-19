import React, { useState, useEffect, useRef } from "react";
import { toast, Bounce, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

export default function ProfileTabContent({ profileData }) {
    const [profileImage, setProfileImage] = useState(false);
    const fileInputRef = useRef(null);
    const [removeProfileImage, setRemoveProfileImage] = useState(false);
    const [imageName, setImageName] = useState(
        profileData?.profileImage ? "Current Image" : ""
    );

    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        country: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setFormData({
            username: profileData?.username || "",
            firstName: profileData?.firstName || "",
            lastName: profileData?.lastName || "",
            country: profileData?.country || "",
        });
    }, [profileData]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDefaultAvatar = () => {
        setProfileImage("default");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImageName(file.name);
            setRemoveProfileImage(false);
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setImageName("");
        setRemoveProfileImage(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append("username", formData.username);
        form.append("firstName", formData.firstName);
        form.append("lastName", formData.lastName);
        form.append("country", formData.country);

        if (profileImage === "default") {
            form.append("useDefaultProfileImage", true);
        } else if (profileImage) {
            form.append("profileImage", profileImage);
        }

        if (formData.username.trim() === "") {
            setErrorMessage("Username cannot be empty");
            return;
        }

        const response = await fetch(
            import.meta.env.VITE_API_URL + "/users/profile/update",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    refreshToken: Cookies.get("refreshToken"),
                },
                body: form,
                credentials: "include",
            }
        );
        const data = await response.json();
        if (data.message === "Profile updated successfully") {
            toast.success("Profile updated successfully", {
                position: "bottom-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                limit: 1,
                transition: Bounce,
            });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            console.log(`data`, data);
        }
    };

    return (
        <div className="min-w-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-slate-700 p-4 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                Edit Profile
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="text-red-500 mt-3 mb-3 text-md">
                    {errorMessage}
                </div>
                <div className="mb-4 flex flex-col">
                    <label
                        className="block text-lg mb-1 dark:text-gray-200 mr-4"
                        htmlFor="profileImage"
                    >
                        Profile Image
                    </label>
                    <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border rounded-md dark:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {imageName && imageName !== "src/assets/default_avatar.png" && (
                    <div className="flex items-center">
                        <span className="text-sm dark:text-gray-300">
                            {imageName}
                        </span>
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="ml-2 text-red-500 text-sm hover:text-red-700"
                        >
                            x
                        </button>
                    </div>
                )}
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
                        name="username"
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
                        Country
                    </label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md dark:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                        onClick={handleDefaultAvatar}
                    >
                        Use Default Avatar
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
