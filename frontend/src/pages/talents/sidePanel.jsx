import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import ReviewSlider from "./reviewSlider"; // Assuming this is your slider component
import { MdLocationPin } from "react-icons/md";
const TalentSidePanel = ({
    selectedTalent,
    isSidePanelOpen,
    handleClosePanel,
    currentReviews,
    handleAddReviewClick,
}) => {
    const handleSubmitReview = () => {
        const reviewData = {
            talentCardId: selectedTalent.id,
            title,
            description,
            amountStars: stars,
        };

        fetch("http://127.0.0.1:3000/review/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Review submitted successfully:", data);
                // Update the reviews state or UI as needed
                setShowReviewForm(false);
            })
            .catch((error) => {
                console.error("Error submitting review:", error);
            });
    };

    return (
        <div>
            {isSidePanelOpen && selectedTalent && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-end"
                    key={selectedTalent.id}
                >
                    <div
                        className={`bg-gray-100 dark:bg-gray-800 border-l border-gray-600 shadow-xl shadow-gray-600 w-2/4 h-full p-4 overflow-y-auto ${
                            isSidePanelOpen
                                ? "slide-panel"
                                : "slide-panel-closed"
                        }`}
                    >
                        <button
                            onClick={handleClosePanel}
                            className="text-right dark:text-white hover:bg-red-500 px-4 py-1 rounded-md"
                        >
                            Close
                        </button>
                        <section className="p-4 flex mt-4">
                            <img
                                className="w-28 h-28 rounded-full border border-black dark:border-gray-200 mb-5"
                                src={`${
                                    selectedTalent.user.profile.profileImage.startsWith(
                                        "https://lh3.googleusercontent.com"
                                    )
                                        ? selectedTalent.user.profile
                                              .profileImage
                                        : `http://127.0.0.1:3000/uploads/profileImages/${selectedTalent.user.profile.profileImage}`
                                }`}
                                alt="Talent Photo"
                            />
                            <div className="flex flex-col ml-6">
                                <h3 className="text-2xl font-semibold dark:text-white">
                                    {selectedTalent.user.profile.firstName &&
                                    selectedTalent.user.profile.lastName
                                        ? `${selectedTalent.user.profile.firstName} ${selectedTalent.user.profile.lastName}`
                                        : selectedTalent.user.username}
                                </h3>
                                <h3 className="dark:text-white text-xl">
                                    {selectedTalent.title}
                                </h3>
                                <h3 className="dark:text-gray-400 text-sm flex items-center">
                                    <MdLocationPin />
                                    {selectedTalent.user.profile.country}
                                </h3>
                            </div>
                            <button className="ml-auto mt-5 px-8 max-h-12 text-2xl bg-green-600 hover:bg-green-700 text-white rounded-lg">
                                Hire
                            </button>
                        </section>
                        <span className="block w-full h-spanHeight bg-gray-300 dark:bg-gray-700"></span>
                        <section className="flex p-4 gap-5 dark:text-white">
                            <p>Price ${selectedTalent.price}</p>
                            <p>|</p>
                            <p>100% Job Success</p>
                            <p>|</p>
                            <p>100+ Jobs taken</p>
                            <p>|</p>
                            <p>5+ years of experience</p>
                            <p>|</p>
                            <p>$1K+ Earned</p>
                        </section>
                        <span className="block w-full h-spanHeight bg-gray-300 dark:bg-gray-700"></span>
                        <div className="p-4 flex gap-5">
                            {selectedTalent.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-6 py-1 bg-blue-800 dark:bg-blue-600 rounded-md text-white"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <span className="block w-full h-spanHeight bg-gray-300 dark:bg-gray-700"></span>
                        <p
                            className="p-4 leading-5 max-w-fit dark:text-white"
                            style={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-word",
                            }}
                        >
                            {selectedTalent.description}
                        </p>
                        <div />
                        <span className="block w-full h-spanHeight bg-gray-300 dark:bg-gray-700"></span>
                        <section className="p-4 flex flex-col items-center justify-between">
                            <div className="flex flex-row justify-between w-full">
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-400 px-6 py-2 rounded-xl"
                                    onClick={handleAddReviewClick}
                                >
                                    Add Review
                                </button>
                                <div className="flex flex-row gap-1 items-center text-xl dark:text-white">
                                    Average Rating:{" "}
                                    {selectedTalent.averageRating}{" "}
                                    <FaStar className="text-yellow-500 text-xl" />
                                </div>
                            </div>
                            <div className="w-full justify-start mt-5">
                                <div>
                                    {currentReviews.length === 0 ? (
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No reviews yet
                                        </p>
                                    ) : (
                                        <div>
                                            <p className="dark:text-white text-md mb-5">
                                                Total Reviews:{" "}
                                                {currentReviews.length}
                                            </p>
                                            <ReviewSlider
                                                props={currentReviews}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TalentSidePanel;
