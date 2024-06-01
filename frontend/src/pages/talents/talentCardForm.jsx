import React, { useState } from "react";

const TalentCardForm = ({ onClose }) => {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        console.log(formData);
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "portfolio") {
            setFormData({
                ...formData,
                portfolio: Array.from(files),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append("thumbnail", formData.thumbnail);
        submitData.append("title", formData.title);
        submitData.append("description", formData.description);
        submitData.append("price", formData.price);

        const skillsArray = formData.skills
            .split(",")
            .map((skill) => skill.trim());
        submitData.append("skills", JSON.stringify(skillsArray));

        formData.portfolio.forEach((file) => {
            submitData.append("portfolio", file);
        });
        submitData.append("stripeInfo", formData.stripeInfo);
        submitData.append("stripeInfo2", formData.stripeInfo2);
        submitData.append("stripeInfo3", formData.stripeInfo3);
        submitData.append("stripeInfo4", formData.stripeInfo4);

        try {
            const response = await fetch(
                "http://localhost:3000/talent/create",
                {
                    method: "POST",
                    body: submitData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            const data = await response.json();
            console.log("Data:", data);
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
                            <div className="mb-4"></div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700">
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
                                <label className="block text-sm font-medium text-gray-700">
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
                                <label className="block text-sm font-medium text-gray-700">
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
                                <label className="block text-sm font-medium text-gray-700">
                                    Skills
                                </label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-lg h-8 px-2"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
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
                        <div>
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
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">
                            Step 3: Payment Information
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Stripe Account
                                </label>
                                <input
                                    type="text"
                                    name="stripeInfo"
                                    value={formData.stripeInfo}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Additional Info 1
                                </label>
                                <input
                                    type="text"
                                    name="stripeInfo2"
                                    value={formData.stripeInfo2}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Additional Info 2
                                </label>
                                <input
                                    type="text"
                                    name="stripeInfo3"
                                    value={formData.stripeInfo3}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Additional Info 3
                                </label>
                                <input
                                    type="text"
                                    name="stripeInfo4"
                                    value={formData.stripeInfo4}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={prevStep}
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Previous
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
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
