import React, { useState } from "react";

const TalentCardForm = ({ onClose }) => {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const [formData, setFormData] = useState({
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
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            portfolio: [...e.target.files],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit form logic
        console.log("Form submitted", formData);
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
                        <form>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-2 border-gray-100 shadow-lg h-8 px-2 active:border-green-200 focus:border-blue-500 focus-within:border-red-500"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea className="mt-1 block w-full rounded-md border-2 border-gray-100 shadow-lg h-24 p-2 leading-4"></textarea>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-lg h-8 px-2"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Skills
                                </label>
                                <input
                                    type="text"
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
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Upload Images
                                </label>
                                <input
                                    type="file"
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
                        </form>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">
                            Step 3: Payment Information
                        </h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Stripe Account
                                </label>
                                <input
                                    type="text"
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
