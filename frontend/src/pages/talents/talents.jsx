import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import TalentCardForm from "./talentCardForm";
import Modal from "./modal";
import Login from "../login/login";
export default function Talents() {
    const { authenticated } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const talents = async () => {
        const response = await fetch("http://127.0.0.1:3000/talents/all");
        const data = await response.json();
        return data;
    };
    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="">
            <div className="max-w-2xl mx-auto mt-10 flex items-center">
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mr-4"
                >
                    Add Talent Card
                </button>
                {showModal && (
                    <Modal>
                        {authenticated ? (
                            <div className="fixed inset-0 flex items-center justify-center z-50 max-w-full">
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                                    onClick={handleCloseModal}
                                ></div>
                                <div className="relative z-10 px-4">
                                    <TalentCardForm
                                        onClose={handleCloseModal}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="fixed inset-0 flex items-center justify-center z-50 max-w-full">
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                                    onClick={handleCloseModal}
                                ></div>
                                <div className="relative z-10 px-4">
                                    <Login />
                                </div>
                            </div>
                        )}
                    </Modal>
                )}
                <form className="flex-grow">
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search services..."
                            required
                        />
                        <button
                            type="submit"
                            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>
            <div className="flex flex-col lg:flex-row mt-16 px-10 ml-48">
                <div className="w-full lg:w-1/5 p-4 bg-gray-100 border-r">
                    <div className="mb-6">
                        <h4 className="mb-2 text-lg font-semibold">Category</h4>
                        <select className="w-full p-2 border rounded">
                            <option value="">Select Category</option>
                            <option value="web-design">Web Design</option>
                            <option value="graphic-design">
                                Graphic Design
                            </option>
                            <option value="writing">Writing</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <h4 className="mb-2 text-lg font-semibold">
                            Price Range
                        </h4>
                        <label className="block mb-2" htmlFor="min-price">
                            Min Price
                        </label>
                        <input
                            type="number"
                            id="min-price"
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="Min Price"
                        />
                        <label className="block mb-2" htmlFor="max-price">
                            Max Price
                        </label>
                        <input
                            type="number"
                            id="max-price"
                            className="w-full p-2 border rounded"
                            placeholder="Max Price"
                        />
                    </div>
                    <div className="mb-6">
                        <h4 className="mb-2 text-lg font-semibold">Rating</h4>
                        <select className="w-full p-2 border rounded">
                            <option value="">Select Rating</option>
                            <option value="4">4 stars & up</option>
                            <option value="3">3 stars & up</option>
                            <option value="2">2 stars & up</option>
                            <option value="1">1 star & up</option>
                        </select>
                    </div>
                </div>
                <div className="w-full lg:w-4/5 px-6 flex flex-wrap gap-6">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <div
                            key={index}
                            className="w-full sm:w-1/2 md:w-1/4 p-4 bg-white border rounded shadow"
                        >
                            <img
                                className="w-full h-56 mb-1"
                                src="https://via.placeholder.com/400"
                                alt="Talent Photo"
                            />
                            <h3 className="text-xs mb-2 font-semibold">
                                Ad by <a href="/">John Doe</a>
                            </h3>
                            <p className="text-sm text-gray-600">
                                I will develop, integrate, and deploy REST APIs
                                with Node.js, Express.js, NestJS
                            </p>
                            <h3 className="text-lg font-semibold mt-3">$100</h3>
                            <p className="text-sm text-gray-600">
                                <a href="/">View Details</a>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
