import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const AddReview = ({ talentId, onSubmitReview }) => {
    const [showModal, setShowModal] = useState(false);
    const [stars, setStars] = useState(0);
    const [hoverStars, setHoverStars] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        onSubmitReview({ talentId, stars, title, description });
        setShowModal(false);
    };

    return (
        <div>
            <button
                className="bg-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-400 px-6 py-2 rounded-xl"
                onClick={() => setShowModal(true)}
            >
                Add Review
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Add a Review
                        </h2>

                        <div className="flex mb-4">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <FaStar
                                        key={starValue}
                                        className={`cursor-pointer text-xl ${
                                            starValue <= (hoverStars || stars)
                                                ? "text-yellow-500"
                                                : "text-gray-400"
                                        }`}
                                        onMouseEnter={() =>
                                            setHoverStars(starValue)
                                        }
                                        onMouseLeave={() => setHoverStars(0)}
                                        onClick={() => setStars(starValue)}
                                    />
                                );
                            })}
                        </div>

                        <input
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={handleSubmit}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddReview;
