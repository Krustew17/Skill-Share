import { memo, useCallback, useState } from "react";
import { FaStar } from "react-icons/fa";

const ReviewForm = memo(({ onClose, onSubmit, passReviewDataToParent }) => {
    const [stars, setStars] = useState(0);
    const [hoverStars, setHoverStars] = useState(0);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        title: "",
        description: "",
    });

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        reviewData.rating = stars;
        passReviewDataToParent(e, reviewData);
        // Optionally, you can reset the form state here
        // setReviewData({ rating: 0, title: "", description: "" });
    };

    const handleReviewDataChange = useCallback((name, value) => {
        setReviewData((prevData) => ({ ...prevData, [name]: value }));
    }, []);

    return (
        <form
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            onSubmit={onSubmit}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4 dark:text-white">
                <h2 className="text-3xl font-semibold mb-4">Add a Review</h2>
                <div className="flex mb-4 items-center">
                    <h2 className="mr-3 text-xl">Stars:</h2>
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
                                onMouseEnter={() => setHoverStars(starValue)}
                                onMouseLeave={() => setHoverStars(0)}
                                onClick={() => setStars(starValue)}
                            />
                        );
                    })}
                </div>
                <label htmlFor="title" className="text-xl">
                    Title
                </label>
                <input
                    className="w-full p-2 mb-4 border border-gray-300 rounded dark:text-black"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                    value={reviewData.title}
                    onChange={(e) =>
                        handleReviewDataChange(e.target.name, e.target.value)
                    }
                />
                <label htmlFor="description" className="text-xl">
                    Description
                </label>
                <textarea
                    className="w-full p-2 mb-4 border h-32 border-gray-300 rounded dark:text-black"
                    placeholder="Description"
                    name="description"
                    id="description"
                    value={reviewData.description}
                    onChange={(e) =>
                        handleReviewDataChange(e.target.name, e.target.value)
                    }
                />
                <div className="flex justify-end">
                    <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </form>
    );
});

export default ReviewForm;
