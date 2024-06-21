import TalentList from "../../talents/talentList";
import React, { useState, useEffect } from "react";
import { MdLocationPin } from "react-icons/md";
import { FaStar, FaPen, FaRegTrashAlt } from "react-icons/fa";
import truncateDescription from "../../../utils/truncateDescriptions";
import TalentSidePanel from "../../talents/sidePanel";
import { toast, Bounce, ToastContainer } from "react-toastify";
import EditTalentCard from "../../profile/tabcontents/EditTalentCard";
import tryRefreshToken from "../../../utils/tryRefreshToken";
import Cookies from "js-cookie";

export default function TalentCardsTabContent() {
    const [talents, setTalents] = useState([]);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const AMOUNT_SKILLS_TO_SHOW = 5;
    const [currentReviews, setCurrentReviews] = useState([]);
    const [formData, setFormData] = useState({});
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleEditTalentCard = (talent) => {
        const { id, title, description, price, skills, portfolio } = talent;
        console.log(talent);
        setFormData({
            id,
            title,
            description,
            price,
            skills: skills,
            portfolio,
        });
        setIsFormOpen(true);
    };

    const handleAddReviewClick = () => {
        toast.error("You cannot add review to your own talent card.", {
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
    };

    const fetchTalentCards = async () => {
        const response = await fetch(
            import.meta.env.VITE_API_URL + "/talent/cards/me",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    // refreshToken: Cookies.get("refreshToken"),
                },
                credentials: "include",
            }
        );
        const data = await response.json();
        console.log(data);

        tryRefreshToken(data);

        if (data.statusCode === 404) {
            setTalents([]);
            return;
        }
        setTalents(data);
    };

    const handleDeleteTalentCard = async (talent) => {
        console.log(talent.id);
        const response = await fetch(
            import.meta.env.VITE_API_URL + "/talent/delete/" + talent.id,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    // refreshToken: Cookies.get("refreshToken"),
                },
                credentials: "include",
            }
        );
        const responseJson = await response.json();

        fetchTalentCards();

        if (responseJson.HttpStatus === 200) {
            toast.success("Talent card deleted successfully", {
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

            fetch(import.meta.env.VITE_API_URL + "/talent/cards/me", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    // refreshToken: Cookies.get("refreshToken"),
                },
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) => setTalents(data));
        } else {
            toast.error("Failed to delete talent card", {
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
        }
    };

    const handleClosePanel = () => {
        setSelectedTalent(null);
        setCurrentReviews([]);
        document.body.classList.remove("overflow-hidden");
        setIsSidePanelOpen(false);
    };

    const handleViewDetails = async (talent) => {
        const response = await fetch(
            import.meta.env.VITE_API_URL +
                "/talent/reviews?talentCardId=" +
                talent.id
        );

        const responseJson = await response.json();
        setCurrentReviews(responseJson.data);
        setSelectedTalent(talent);
        document.body.classList.add("overflow-hidden");
        setIsSidePanelOpen(true);
    };

    useEffect(() => {
        fetchTalentCards();
    }, []);
    console.log(talents);

    return (
        <div className="w-full px-2 py-2 sm:px-6 sm:py-4 flex-col flex-wrap gap-6">
            {talents.length === 0 ? (
                <div className="text-black text-2xl sm:text-6xl text-center mt-16 sm:mt-32 dark:text-white">
                    No talents found
                </div>
            ) : (
                talents.data.map((talent) => (
                    <div
                        className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-5 flex flex-col sm:flex-row dark:text-white"
                        key={talent.id}
                    >
                        <img
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-0 sm:mr-4 border border-black dark:border-gray-50 mx-auto sm:mx-0"
                            src={`${
                                talent.user.profile.profileImage.startsWith(
                                    "https://lh3.googleusercontent.com"
                                )
                                    ? talent.user.profile.profileImage
                                    : `${
                                          import.meta.env.VITE_IMAGE_URL
                                      }/uploads/profileImages/${
                                          talent.user.profile.profileImage
                                      }`
                            }`}
                            alt="Profile image"
                        />
                        <div className="flex-1 border-l-0 sm:border-l-2 dark:border-gray-600 pl-0 sm:pl-4 border-gray-300 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center sm:items-center mb-2">
                                <div className="text-center sm:text-left">
                                    <h2 className="text-lg font-semibold dark:text-gray-200">
                                        {talent.user.profile.firstName &&
                                        talent.user.profile.lastName
                                            ? `${talent.user.profile.firstName} ${talent.user.profile.lastName}`
                                            : talent.user.username}
                                    </h2>
                                    <p className="text-gray-600 dark:text-white">
                                        {truncateDescription(talent.title, 50)}
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                                        <MdLocationPin className="text-sm" />{" "}
                                        {talent.user.profile.country}
                                    </p>
                                </div>
                                <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-0">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded"
                                        onClick={() =>
                                            handleViewDetails(talent)
                                        }
                                    >
                                        View profile
                                    </button>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded"
                                        onClick={() =>
                                            handleEditTalentCard(talent)
                                        }
                                    >
                                        <FaPen />
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded"
                                        onClick={() =>
                                            handleDeleteTalentCard(talent)
                                        }
                                    >
                                        <FaRegTrashAlt />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start text-sm mb-2">
                                <p className="mr-2 dark:text-green-500 text-green-600">
                                    ${talent.price}
                                </p>
                                <p className="hidden sm:block mx-2">|</p>
                                <p className="mt-1 sm:mt-0 dark:text-green-500 text-green-600">
                                    100% Job Success
                                </p>
                                <p className="hidden sm:block mx-2">|</p>
                                <p className="mt-1 sm:mt-0 dark:text-green-500 text-green-600">
                                    $1K+ earned
                                </p>
                                <p className="hidden sm:block mx-2">|</p>
                                <p className="flex items-center gap-1 mt-1 sm:mt-0">
                                    {talent.averageRating}{" "}
                                    <FaStar className="text-yellow-500" />
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start mb-2">
                                {talent.skills
                                    .slice(0, AMOUNT_SKILLS_TO_SHOW)
                                    .map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-200 dark:bg-blue-300 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mt-1"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                {talent.skills.length >
                                    AMOUNT_SKILLS_TO_SHOW && (
                                    <span className="bg-gray-200 dark:bg-blue-300 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mt-1">
                                        +
                                        {talent.skills.length -
                                            AMOUNT_SKILLS_TO_SHOW}
                                    </span>
                                )}
                            </div>
                            <div className="text-gray-700 text-sm max-w-full dark:text-gray-200 text-left sm:text-left">
                                {truncateDescription(talent.description, 50)}
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
            {isFormOpen && (
                <EditTalentCard
                    onClose={() => setIsFormOpen(false)}
                    formData={formData}
                    setFormData={setFormData}
                />
            )}
            <ToastContainer limit={3} />
        </div>
    );
}
