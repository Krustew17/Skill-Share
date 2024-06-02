import React, { useState } from "react";

const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedImage, setExpandedImage] = useState(null);
    const amountImages = images.length;

    const handleClick = (index) => {
        setExpandedImage(images[index]);
    };

    const handleClose = () => {
        setExpandedImage(null);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };
    if (amountImages === 0) {
        return (
            <div className="mt-5 mb-5 dark:text-white text-center">
                No Portfolio Provided
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center">
            <button
                onClick={handlePrev}
                className="dark:text-white mx-auto text-3xl"
            >
                &lt;
            </button>
            <div>
                <a
                    href={`http://127.0.0.1:3000/${images[currentIndex]}`}
                    target="_blank"
                >
                    <img
                        className="w-full h-96 rounded-md border border-black dark:border-gray-200 cursor-pointer"
                        src={`http://127.0.0.1:3000/${images[currentIndex]}`}
                        alt="portfolio image"
                        // onClick={() => handleClick(currentIndex)}
                    />
                </a>
            </div>
            <button
                onClick={handleNext}
                className="dark:text-white mx-auto text-3xl"
            >
                &gt;
            </button>
            {expandedImage && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={handleClose}
                >
                    <img
                        src={`http://127.0.0.1:3000/${expandedImage}`}
                        alt="expanded image"
                        className="max-w-full max-h-full"
                    />
                </div>
            )}
        </div>
    );
};

export default ImageSlider;
