import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import TalentCardForm from "./talentCardForm";
import Modal from "./modal";
import Login from "../login/login";
export default function Talents() {
    const { authenticated } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleViewDetails = (talent) => {
        setSelectedTalent(talent);
        setIsSidePanelOpen(true);
    };

    const handleClosePanel = () => {
        setSelectedTalent(null);
        setIsSidePanelOpen(false);
    };

    const TalentList = () => {
        const [talents, setTalents] = useState([]);
        useEffect(() => {
            const fetchTalents = async () => {
                try {
                    const response = await fetch(
                        "http://localhost:3000/talent/all",
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                        }
                    );
                    const responseJson = await response.json();
                    console.log(responseJson);
                    setTalents(responseJson);
                } catch (error) {
                    console.error("Error fetching talents:", error);
                }
            };

            fetchTalents();
        }, []);
        if (talents.message === "No talents found") {
            return <div>Loading...</div>;
        }
        return (
            <div className="w-full lg:w-4/5 px-6 flex-col flex-wrap gap-6">
                {talents.statusCode === 404 ? (
                    <div className="text-black text-6xl ml-48 mt-20">
                        No talents found
                    </div>
                ) : (
                    talents.map(
                        (talent) => (
                            <div
                                className="bg-white shadow rounded-lg p-6 mb-6 flex"
                                key={talent.id}
                            >
                                <img
                                    className="w-16 h-16 rounded-full mr-4"
                                    src={`${talent.user.profile.picture}`}
                                    alt="Profile"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                {talent.name}
                                            </h2>
                                            <p className="text-gray-600">
                                                {talent.title}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {talent.location}
                                            </p>
                                        </div>
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                            onClick={() =>
                                                handleViewDetails(talent)
                                            }
                                        >
                                            View profile
                                        </button>
                                    </div>
                                    <div className="flex items-center text-sm mb-2">
                                        <p className="mx-2">${talent.price}</p>
                                        <p className="mx-2">|</p>
                                        <p className="mx-2">100% Job Success</p>
                                        <p className="mx-2">|</p>
                                        <p>$1K+ earned </p>
                                        <p className="mx-2">|</p>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        {/* {talent.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2"
                                    >
                                        {skill}
                                    </span>
                                ))} */}
                                    </div>
                                    <div className="text-gray-700 text-sm">
                                        {talent.description}
                                    </div>
                                </div>
                            </div>
                        )
                        // <div className="flex w-3/5 bg-gray-50 h-64 py-6 px-4 gap-4 mb-5">
                        //     <div className="flex justify-between">
                        //         <div className="flex gap-6">
                        //             <img
                        //                 className="w-24 h-24 rounded-full"
                        //                 src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                        //                 alt="Talent Photo"
                        //             />
                        //             <div className="flex flex-col">
                        //                 <h2 className="text-xl  font-medium">
                        //                     Talent Name
                        //                 </h2>
                        //                 {talent.title}
                        //                 <p className="text-gray-500">Location</p>
                        //             </div>
                        //         </div>
                        //         <button
                        //             className="bg-blue-500 text-white px-8 text-xs md:h-10 md:px-4 rounded-lg hover:bg-blue-400 md:text-md "
                        //             onClick={() => handleViewDetails(talent)}
                        //         >
                        //             View Details
                        //         </button>
                        //     </div>
                        // </div>
                    )
                )}
                {/* <div className="flex w-4/5 bg-gray-50 h-64 p-4 gap-4">
                    <img
                        className="w-24 h-24 rounded-full"
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                        alt="Talent Photo"
                    />
                    <div className="flex flex-col">
                        <h2 className="text-xl  font-medium">Talent Name</h2>
                        {
                            talent.skills.map()
                        }
                        <p className="text-gray-500">Location</p>
                    </div>
                </div> */}
                {/* {talents.map((talent) => (
                    <div
                        key={talent.id}
                        className="w-full sm:w-1/2 md:w-1/4 p-4 bg-white border rounded shadow h-96"
                    >
                        <img
                            className="w-full h-56 mb-1"
                            src={`http://127.0.0.1:3000/${talent.user.userProfile?.picture}`}
                            alt="Talent Photo"
                        />
                        <h3 className="text-xs mb-2 font-semibold">
                            Ad by <a href="/">{talent.user.username}</a>
                        </h3>
                        <p className="text-sm text-gray-600">{talent.title}</p>
                        <h3 className="text-lg font-semibold mt-3">$100</h3>
                        <p className="text-lg text-gray-600">
                            <button onClick={() => handleViewDetails(talent)}>
                                View Details
                            </button>
                        </p>
                    </div>
                ))} */}
                {isSidePanelOpen && selectedTalent && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-end">
                        <div className="bg-gray-50 w-2/4 h-full p-4 overflow-y-auto">
                            <button
                                onClick={handleClosePanel}
                                className="text-right"
                            >
                                Close
                            </button>
                            <div className="p-4">
                                <img
                                    className="w-96 h-56 mb-4"
                                    src={`http://127.0.0.1:3000/${selectedTalent.thumbnail}`}
                                    alt="Talent Photo"
                                />
                                <h3 className="text-lg font-semibold">
                                    {selectedTalent.title}
                                </h3>
                                <p>{selectedTalent.description}</p>
                                <p>Skills: {selectedTalent.skills}</p>
                                <p>Price: ${selectedTalent.price}</p>
                                {/* Add more details as needed */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
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
                {/* <div className="w-full lg:w-4/5 px-6 flex flex-wrap gap-6"> */}
                <TalentList />
                {/* {Array.from({ length: 30 }).map((_, index) => (
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
                    ))} */}
                {/* </div> */}
            </div>
        </div>
    );
}
