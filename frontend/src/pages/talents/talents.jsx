import { useContext, useState, useEffect, useCallback, memo } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import TalentCardForm from "./talentCardForm";
import Modal from "./modal";
import Login from "../login/login";
import { MdLocationPin } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import truncateDescription from "../../utils/truncateDescriptions";
import { toast, Bounce, ToastContainer } from "react-toastify";
import TalentSidePanel from "./sidePanel";
import ReviewForm from "./reviewForm";
import TalentCardFilters from "./talentCardFilters";
import Search from "./search";

export default function Talents() {
    const { authenticated, currentUser } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [currentReviews, setCurrentReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewDataFromChild, setReviewDataFromChild] = useState(null);

    const handleAddReviewClick = useCallback(() => {
        if (!authenticated) {
            toast.error("Please login to add a review", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            return;
        }
        setIsSidePanelOpen(false);
        setShowReviewForm(true);
    }, []);

    const handleReviewDataFromChildAndSubmit = (e, data) => {
        setReviewDataFromChild(data);
        handleSubmitReview(e, reviewDataFromChild);
    };

    const handleSubmitReview = async (e, reviewData) => {
        e.preventDefault();
        const submitData = {
            ...reviewData,
            talentCardId: selectedTalent.id,
        };
        console.log(submitData);

        const response = await fetch(
            "http://127.0.0.1:3000/talent/review/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(submitData),
            }
        );
        const responseJson = await response.json();

        if (responseJson.message === "Talent review created successfully") {
            toast.success("Review created successfully", {
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
            setShowReviewForm(false);
        }
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

    const TalentList = memo(() => {
        const [talents, setTalents] = useState([]);
        const location = useLocation();
        useEffect(() => {
            const fetchTalents = async () => {
                try {
                    const queryParams = new URLSearchParams(location.search);
                    let url = "http://127.0.0.1:3000/";

                    if (
                        queryParams.has("keywords") ||
                        queryParams.has("skills") ||
                        queryParams.has("minPrice") ||
                        queryParams.has("maxPrice")
                    ) {
                        url += `talent/search?${queryParams.toString()}`;
                    } else {
                        url += "talent/all";
                    }

                    const response = await fetch(url, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    });
                    let data = await response.json();

                    if (data.data) {
                        data = data.data;
                    }

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
        }, [location.search]);

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
                                src={`${talent.user.profile.profileImage}`}
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
    });

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
                <Search />
            </div>
            <div className="flex flex-col lg:flex-row mt-16 px-10 mx-auto max-w-screen-2xl">
                <TalentCardFilters />
                {showReviewForm && (
                    <ReviewForm
                        onClose={setShowReviewForm}
                        onSubmit={handleSubmitReview}
                        passReviewDataToParent={
                            handleReviewDataFromChildAndSubmit
                        }
                    />
                )}
                <TalentList />
            </div>
            <ToastContainer limit={1} />
        </div>
    );
}
