import { FaStar } from "react-icons/fa";
import truncateDescription from "../../utils/truncateDescriptions";
import { useState } from "react";
import formatDate from "../../utils/formatDate";
const ReviewCard = ({ review }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <div className="bg-gray-200 dark:bg-gray-800  shadow-xl dark:shadow-lg border border-gray-500 dark:shadow-gray-600 rounded-lg px-6 pt-6 pb-2 mb-6">
            <div className="flex items-center mb-2">
                {[...Array(review.rating)].map((_, index) => {
                    const filled = index < review.rating;
                    return (
                        <FaStar
                            key={index}
                            className={`text-yellow-500 ${
                                filled ? "fill-current" : "stroke-current"
                            }`}
                        />
                    );
                })}
            </div>
            <h2 className="text-lg font-semibold dark:text-gray-200">
                {review.title}
            </h2>
            <p className="text-gray-600 dark:text-white break-words">
                {showMore
                    ? review.description
                    : truncateDescription(review.description, 65)}
            </p>
            <button className="dark:text-gray-300" onClick={toggleShowMore}>
                {showMore ? "Show less" : "Show more"}
            </button>
            <div className="flex items-center mt-5">
                <span className="text-gray-400 dark:text-gray-500">
                    Submitted by:{" "}
                    {review.user?.profile?.firstName || review.user?.username}
                </span>
                <span className="text-gray-400 dark:text-gray-500 mx-2">•</span>
                <span className="text-gray-400 dark:text-gray-500">
                    {formatDate(review.createdAt)}
                </span>
            </div>
        </div>
    );
};

export default ReviewCard;
