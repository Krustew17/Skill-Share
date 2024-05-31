import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import TalentCardForm from "./talentCardForm";
import Modal from "./modal";
import Login from "../login/login";
import { MdLocationPin } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import truncateDescription from "../../utils/truncateDescriptions";
import { toast, Bounce, ToastContainer } from "react-toastify";
import TalentSidePanel from "./sidePanel";

export default function Talents() {
    const { authenticated, currentUser } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [currentReviews, setCurrentReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [stars, setStars] = useState(0);
    const [hoverStars, setHoverStars] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [reviewData, setReviewData] = useState({
        stars: 0,
        title: "",
        description: "",
    });

    const handleReviewDataChange = useCallback((e) => {
        const { name, value } = e.target;
        console.log(e.target.name);
        setReviewData({ ...reviewData, [name]: value });
        console.log(reviewData);
    });

    const handleAddReviewClick = useCallback(() => {
        setStars(0);
        reviewData.title = "";
        reviewData.description = "";
        setShowReviewForm(true);
    }, []);

    const handleCloseReviewForm = () => {
        setShowReviewForm(false);
    };

    const handleSubmitReview = async () => {
        const reviewData = {
            talentCardId: selectedTalent.id,
            title,
            description,
            amountStars: stars,
        };

        const response = await fetch(
            "http://127.0.0.1:3000/talent/review/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            }
        );
        const responseJson = await response.json();
    };

    const handleButtonClick = async () => {
        if (!authenticated) {
            return setShowModal(true);
        }
        const talentCards = await fetch(
            "http://127.0.0.1:3000/talent/cards/me",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        const responseJson = await talentCards.json();
        if (!currentUser?.user?.hasPremium && responseJson.amount === 3) {
            toast.error("You need premium to post more than 3 talent cards", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                limit: 1,
                transition: Bounce,
            });
            return;
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleViewDetails = async (talent) => {
        const response = await fetch(
            "http://127.0.0.1:3000/talent/reviews?talentCardId=" + talent.id,
            {}
        );

        const responseJson = await response.json();
        setCurrentReviews(responseJson.data);
        setSelectedTalent(talent);
        setIsSidePanelOpen(true);
    };

    const handleClosePanel = () => {
        setSelectedTalent(null);
        setCurrentReviews([]);
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
                    const data = await response.json();

                    const talentsWithRatings = await Promise.all(
                        data.map(async (talent) => {
                            const ratingResponse = await fetch(
                                `http://127.0.0.1:3000/talent/rating/average?talentCardId=${talent.id}`
                            );
                            const ratingData = await ratingResponse.json();
                            const rating = Number(ratingData.data).toFixed(1);
                            return {
                                ...talent,
                                averageRating: rating,
                            };
                        })
                    );
                    setTalents(talentsWithRatings);
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
                    talents.map((talent) => (
                        <div
                            className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-md dark:shadow-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-6 mb-6 flex dark:text-white"
                            key={talent.id}
                        >
                            <img
                                className="w-16 h-16 rounded-full mr-4 border border-black dark:border-gray-50"
                                src={`${talent.user.profile.picture}`}
                                alt="Profile"
                            />
                            <div className="flex-1 border-l-2 dark:border-gray-600 pl-4 border-gray-300">
                                <div className="flex justify-between items-center mb-2 ">
                                    <div>
                                        <h2 className="text-lg font-semibold dark:text-gray-200">
                                            {talent.user.profile.firstName &&
                                            talent.user.profile.lastName
                                                ? talent.user.profile
                                                      .firstName +
                                                  " " +
                                                  talent.user.profile.lastName
                                                : talent.user.username}
                                        </h2>
                                        <p className="text-gray-600 dark:text-white">
                                            {talent.title}
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <MdLocationPin className="text-sm" />{" "}
                                            {talent.user.profile.country}
                                        </p>
                                    </div>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                        onClick={() =>
                                            handleViewDetails(talent)
                                        }
                                    >
                                        View profile
                                    </button>
                                </div>
                                <div className="flex items-center text-sm mb-2">
                                    <p className="mr-2 dark:text-green-500 text-green-600">
                                        ${talent.price}
                                    </p>
                                    <p className="mx-2">|</p>
                                    <p className="mx-2 dark:text-green-500 text-green-600">
                                        100% Job Success
                                    </p>
                                    <p className="mx-2">|</p>
                                    <p className="dark:text-green-500 text-green-600">
                                        $1K+ earned{" "}
                                    </p>
                                    <p className="mx-2">|</p>
                                    <p className="flex items-center gap-2">
                                        {talent.averageRating}{" "}
                                        <FaStar className="text-yellow-500" />
                                    </p>
                                </div>
                                <div className="flex items-center mb-2">
                                    {talent.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-200 dark:bg-blue-300 text-gray-800 px-2 py-1 rounded-full text-xs mr-2"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-gray-700 text-sm max-w-screen-lg dark:text-gray-200">
                                    {truncateDescription(
                                        talent.description,
                                        250
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <TalentSidePanel
                    {...{
                        selectedTalent,
                        isSidePanelOpen,
                        handleClosePanel,
                        currentReviews,
                        handleAddReviewClick,
                    }}
                />
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
                <div className="w-full lg:w-1/5 p-4 bg-white shadow-lg border-2">
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
                {showReviewForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4 dark:text-white">
                            <h2 className="text-3xl font-semibold mb-4">
                                Add a Review
                            </h2>
                            <div className="flex mb-4  items-center">
                                <h2 className="mr-3 text-xl">Stars:</h2>
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <FaStar
                                            key={starValue}
                                            className={`cursor-pointer text-xl ${
                                                starValue <=
                                                (hoverStars || stars)
                                                    ? "text-yellow-500"
                                                    : "text-gray-400"
                                            }`}
                                            onMouseEnter={() =>
                                                setHoverStars(starValue)
                                            }
                                            onMouseLeave={() =>
                                                setHoverStars(0)
                                            }
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
                                onChange={handleReviewDataChange}
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
                                onChange={handleReviewDataChange}
                            />
                            <div className="flex justify-end">
                                <button
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
                                    onClick={handleCloseReviewForm}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    onClick={handleSubmitReview}
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <TalentList />
            </div>
            <ToastContainer limit={1} />
        </div>
    );
}
