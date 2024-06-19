import React, { useState } from "react";
import { toast, Bounce, ToastContainer } from "react-toastify";
const TalentCardForm = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [skills, setSkills] = useState([]);
    const [currentSkill, setCurrentSkill] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const nextStep = () => {
        if (step == 1) {
            if (formData.title.trim() === "") {
                setErrorMessage("Title is required");
                return;
            }

            if (formData.description.trim() === "") {
                setErrorMessage("Description is required");
                return;
            }

            if (formData.price.trim() === "") {
                setErrorMessage("Price is required");
                return;
            }

            if (skills.length < 1) {
                setErrorMessage("Skills are required");
                return;
            }
            setStep(step + 1);
            setErrorMessage("");
        } else if (step == 2) {
            console.log(formData.portfolio);
            if (formData.portfolio.length > 5) {
                setErrorMessage("Maximum 5 portfolio images are allowed");
                return;
            }
            setStep(step + 1);
            setErrorMessage("");
        }
    };
    const prevStep = () => {
        setErrorMessage("");
        setStep(step - 1);
    };

    const [formData, setFormData] = useState({
        thumbnail: null,
        title: "",
        description: "",
        price: "",
        skills: "",
        portfolio: [],
        stripeInfo: "",
        stripeInfo2: "",
        stripeInfo3: "",
        stripeInfo4: "",
    });

    const handleKeyDown = (e) => {
        if (e.key === " ") {
            e.preventDefault();
            console.log(currentSkill);
            if (currentSkill.trim()) {
                setSkills([...skills, currentSkill.trim()]);
                setCurrentSkill("");
            }
        }
    };
    const handleSkillClick = (skill) => {
        if (skills.includes(skill)) {
            setSkills(skills.filter((s) => s !== skill));
        } else {
            setSkills([...skills, skill]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "skills") {
            setCurrentSkill(value);
        }
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length <= 5) {
            setErrorMessage("");
        }
        if (name === "portfolio") {
            setFormData({
                ...formData,
                portfolio: Array.from(files),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.portfolio.length > 5) {
            setErrorMessage("Maximum 5 portfolio images are allowed");
            return;
        }

        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("description", formData.description);
        submitData.append("price", formData.price);

        const skillsArray = skills.map((skill) => skill.trim());
        submitData.append("skills", JSON.stringify(skillsArray));

        formData.portfolio.forEach((file) => {
            submitData.append("portfolio", file);
        });

        try {
            const response = await fetch(
                import.meta.env.VITE_API_URL + "/talent/create",
                {
                    method: "POST",
                    body: submitData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        refreshToken: Cookies.get("refreshToken"),
                    },
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (data.HttpStatus === 201) {
                onClose();
                toast.success(data.message, {
                    position: "bottom-left",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-lg shadow-lg w-1/2 p-6 z-10 max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">
                            Step 1: Talent Information
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="text-red-500 text-lg">
                                {errorMessage}
                            </div>
                            <div className="mb-4"></div>
                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-2 border-gray-100 shadow-lg h-8 px-2 active:border-green-200 focus:border-blue-500 focus-within:border-red-500"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-2 border-gray-100 shadow-lg h-24 p-2 leading-4"
                                ></textarea>
                            </div>
                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-lg h-8 px-2"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Skills
                                </label>
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {skills.map((skill) => (
                                        <span
                                            className="px-2 py-1 bg-blue-300 rounded-lg text-sm hover:bg-blue-400 cursor-pointer"
                                            onClick={() =>
                                                handleSkillClick(skill)
                                            }
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    name="skills"
                                    value={currentSkill}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-lg h-8 px-2"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Next
                            </button>
                        </form>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">
                            Step 2: Portfolio
                        </h2>
                        <div className="text-red-500 text-lg">
                            {errorMessage}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Upload Images
                                </label>
                                <input
                                    type="file"
                                    name="portfolio"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    multiple
                                />
                            </div>
                            <button
                                type="button"
                                onClick={prevStep}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
                            >
                                Previous
                            </button>
                            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                                Submit
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TalentCardForm;
