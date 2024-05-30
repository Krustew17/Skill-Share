import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ReviewCard from "./reviewCard";
const ReviewSlider = ({ ...reviews }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNextReview = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === reviews.props.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPreviousReview = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? reviews.props.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="relative">
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                <button
                    className="text-3xl text-white bg-gray-500 rounded-full w-12 h-12 flex items-center justify-center absolute left-0 z-10"
                    onClick={goToPreviousReview}
                >
                    <FaArrowLeft />
                </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                <button
                    className="text-3xl text-white bg-gray-500 rounded-full w-12 h-12 flex items-center justify-center absolute right-0 z-10"
                    onClick={goToNextReview}
                >
                    <FaArrowRight />
                </button>
            </div>
            <div className="max-w-2xl mx-auto">
                <ReviewCard review={reviews.props[currentIndex]} />
            </div>
        </div>
    );
};

export default ReviewSlider;
