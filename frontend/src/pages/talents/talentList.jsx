import { useContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TalentSidePanel from "./sidePanel";
import { MdLocationPin } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import truncateDescription from "../../utils/truncateDescriptions";
import { AuthContext } from "../../contexts/AuthContext";
import ReviewForm from "./reviewForm";
import { toast, Bounce } from "react-toastify";
import Cookies from "js-cookie";
import React from "react";

const TalentList = ({ onDataSend }) => {
    const { authenticated, currentUser } = useContext(AuthContext);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [currentReviews, setCurrentReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewDataFromChild, setReviewDataFromChild] = useState(null);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const [skills, setSkills] = useState([]);
    const [talents, setTalents] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(2);

    const navigate = useNavigate();
    const location = useLocation();

    const AMOUNT_SKILLS_TO_SHOW = 8;
    const handleClosePanel = () => {
        setSelectedTalent(null);
        setCurrentReviews([]);
        Cookies.remove("talentUserId");
        document.body.classList.remove("overflow-hidden");
        setIsSidePanelOpen(false);
    };

    const handleSubmitReview = async (reviewData) => {
        const response = await fetch(
            import.meta.env.VITE_API_URL + "/talent/review/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    refreshToken: Cookies.get("refreshToken"),
                },
                body: JSON.stringify(reviewData),
                credentials: "include",
            }
        );
        const responseJson = await response.json();

        if (responseJson.HttpStatus !== 200) {
            toast.error(responseJson.message, {
                position: "bottom-left",
                autoClose: 3000,
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

        if (responseJson.message === "Talent review created successfully") {
            toast.success("Review created successfully", {
                position: "bottom-left",
                autoClose: 3000,
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

    const handleReviewDataFromChildAndSubmit = (e, data) => {
        setReviewDataFromChild(data);
        handleSubmitReview(e, reviewDataFromChild);
    };

    const handleAddReviewClick = useCallback(() => {
        if (!authenticated) {
            toast.error("Please login to add a review", {
                position: "bottom-left",
                autoClose: 3000,
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
        const talentId = Cookies.get("talentUserId");
        const loggedUserId = Cookies.get("loggedUserId");

        if (talentId == loggedUserId) {
            toast.error("You cannot add review to your own talent card.", {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            console.log("hi");
            return;
        }
        setShowReviewForm(true);
    }, []);

    const handlePageChange = (newPage) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", newPage);
        setSearchParams(newSearchParams);
        window.scrollTo(0, 0);
    };
    useEffect(() => {
        const currentPage = new URLSearchParams(location.search).get("page");
        if (currentPage !== page) {
            console.log(currentPage, page);
            setPage(currentPage ? parseInt(currentPage) : 1);
        }
        // console.log(currentPage, page);
    }, [location]);

    const handleViewDetails = async (talent) => {
        console.log(talent);
        const response = await fetch(
            import.meta.env.VITE_API_URL +
                "/talent/reviews?talentCardId=" +
                talent.id
        );
        const responseJson = await response.json();

        setCurrentReviews(responseJson.data);
        setSelectedTalent(talent);
        console.log(talent);
        Cookies.set("talentUserId", talent.user.id, {
            expires: 1,
            secure: true,
            sameSite: "none",
        });
        document.body.classList.add("overflow-hidden");
        setIsSidePanelOpen(true);
    };
    useEffect(() => {
        const fetchTalents = async () => {
            try {
                const queryParams = new URLSearchParams(location.search);
                let url = import.meta.env.VITE_API_URL;

                if (
                    queryParams.has("keywords") ||
                    queryParams.has("skills") ||
                    queryParams.has("minPrice") ||
                    queryParams.has("maxPrice") ||
                    queryParams.has("rating")
                ) {
                    const params = `/talent/search?${queryParams.toString()}&limit=${limit}`;
                    url += params;
                } else {
                    url += `/talent/all?page=${page}&limit=${limit}`;
                }
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                setSkills(data.uniqueSkills);
                setTotal(data.total);
                onDataSend(data.uniqueSkills);
                const talentsWithRatings = await Promise.all(
                    data.talents.map(async (talent) => {
                        const ratingResponse = await fetch(
                            import.meta.env.VITE_API_URL +
                                `/talent/rating/average?talentCardId=${talent.id}`
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
    }, [location.search, page, limit]);

    if (talents.message === "No talents found") {
        return <div>Loading...</div>;
    }
    return (
        <div className="w-full lg:w-4/5 px-6 flex-col flex-wrap gap-6">
            {talents.length === 0 ? (
                <div className="text-black text-6xl text-center mt-32 dark:text-white">
                    No talents found
                </div>
            ) : (
                talents.map((talent) => (
                    <div
                        className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-md dark:shadow-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row dark:text-white"
                        key={talent.id}
                    >
                        <div className="flex justify-center sm:justify-start">
                            <img
                                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-black dark:border-gray-50"
                                src={`${
                                    talent?.user?.profile?.profileImage.startsWith(
                                        "https://lh3.googleusercontent.com"
                                    )
                                        ? talent?.user?.profile?.profileImage
                                        : `${
                                              import.meta.env.VITE_API_URL
                                          }/uploads/profileImages/${
                                              talent?.user?.profile
                                                  ?.profileImage
                                          }`
                                }`}
                                alt="Profile image"
                            />
                        </div>
                        <div className="flex-1 border-l-0 sm:border-l-2 dark:border-gray-600 pl-0 sm:pl-4 border-gray-300">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 ">
                                <div className="text-center sm:text-left">
                                    <h2 className="text-lg font-semibold dark:text-gray-200">
                                        {talent?.user?.profile?.firstName &&
                                        talent?.user?.profile?.lastName
                                            ? talent?.user?.profile?.firstName +
                                              " " +
                                              talent?.user?.profile?.lastName
                                            : talent?.user?.username}
                                    </h2>
                                    <p className="text-gray-600 dark:text-white">
                                        {talent?.title}
                                    </p>
                                    {talent?.user?.profile?.country && (
                                        <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                                            <MdLocationPin className="text-sm" />{" "}
                                            {talent?.user?.profile?.country}
                                        </p>
                                    )}
                                </div>
                                <button
                                    className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    onClick={() => handleViewDetails(talent)}
                                >
                                    View profile
                                </button>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center text-sm mb-2">
                                <p className="mr-0 sm:mr-2 dark:text-green-500 text-green-600">
                                    ${talent?.price}
                                </p>
                                <p className="hidden sm:block mx-2">|</p>
                                <p className="mt-2 sm:mt-0 mx-2 dark:text-green-500 text-green-600">
                                    100% Job Success
                                </p>
                                <p className="hidden sm:block mx-2">|</p>
                                <p className="mt-2 sm:mt-0 dark:text-green-500 text-green-600">
                                    $1K+ earned{" "}
                                </p>
                                <p className="hidden sm:block mx-2">|</p>
                                <p className="mt-2 sm:mt-0 flex items-center gap-2">
                                    {talent?.averageRating}{" "}
                                    <FaStar className="text-yellow-500" />
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center sm:justify-start items-center mb-2">
                                {talent.skills
                                    .slice(0, AMOUNT_SKILLS_TO_SHOW)
                                    .map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-200 dark:bg-blue-300 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mt-2"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                {talent.skills.length >
                                    AMOUNT_SKILLS_TO_SHOW && (
                                    <span className="bg-gray-200 dark:bg-blue-300 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mt-2">
                                        +
                                        {talent.skills.length -
                                            AMOUNT_SKILLS_TO_SHOW}
                                    </span>
                                )}
                            </div>
                            <div className="text-gray-700 text-sm max-w-screen-lg dark:text-gray-200">
                                {truncateDescription(talent.description, 50)}
                            </div>
                        </div>
                    </div>
                ))
            )}
            {talents.length > 0 && (
                <div className="flex gap-5 items-center justify-center mt-8">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded text-white"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        previous
                    </button>
                    <span className="dark:text-white">
                        Page {page} of {Math.ceil(total / limit)}
                    </span>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded text-white"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page * limit >= total}
                    >
                        next
                    </button>
                </div>
            )}
            <TalentSidePanel
                {...{
                    selectedTalent,
                    isSidePanelOpen,
                    handleClosePanel,
                    currentReviews,
                    handleAddReviewClick,
                }}
                setShowReviewForm={setShowReviewForm}
            />

            {showReviewForm && (
                <ReviewForm
                    onClose={setShowReviewForm}
                    onSubmit={handleSubmitReview}
                    passReviewDataToParent={handleReviewDataFromChildAndSubmit}
                    talentCardId={selectedTalent?.id}
                />
            )}
        </div>
    );
};

export default TalentList;
