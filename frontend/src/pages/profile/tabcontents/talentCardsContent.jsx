import TalentList from "../../talents/talentList";
import { useState, useEffect } from "react";
import { MdLocationPin } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import truncateDescription from "../../../utils/truncateDescriptions";
import TalentSidePanel from "../../talents/sidePanel";
import { toast, Bounce, ToastContainer } from "react-toastify";

export default function TalentCardsTabContent() {
    const [talents, setTalents] = useState([]);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const AMOUNT_SKILLS_TO_SHOW = 5;
    const [currentReviews, setCurrentReviews] = useState([]);

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

    const handleClosePanel = () => {
        setSelectedTalent(null);
        setCurrentReviews([]);
        document.body.classList.remove("overflow-hidden");
        setIsSidePanelOpen(false);
    };

    const handleViewDetails = async (talent) => {
        const response = await fetch(
            "http://127.0.0.1:3000/talent/reviews?talentCardId=" + talent.id,
            {}
        );

        const responseJson = await response.json();
        setCurrentReviews(responseJson.data);
        setSelectedTalent(talent);
        document.body.classList.add("overflow-hidden");
        setIsSidePanelOpen(true);
    };

    useEffect(() => {
        fetch("http://127.0.0.1:3000/talent/cards/me", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setTalents(data));
    }, []);
    console.log(talents);

    return (
        <div className="w-full lg:w-4/5 px-6 flex-col flex-wrap gap-6">
            {talents.length === 0 ? (
                <div className="text-black text-6xl text-center mt-32 dark:text-white">
                    No talents found
                </div>
            ) : (
                talents.data.map((talent) => (
                    <div
                        className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-md dark:shadow-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-6 mb-6 flex dark:text-white"
                        key={talent.id}
                    >
                        <img
                            className="w-16 h-16 rounded-full mr-4 border border-black dark:border-gray-50"
                            src={`${
                                talent.user.profile.profileImage.startsWith(
                                    "https://lh3.googleusercontent.com"
                                )
                                    ? talent.user.profile.profileImage
                                    : `http://127.0.0.1:3000/uploads/profileImages/${talent.user.profile.profileImage}`
                            }`}
                            alt="Profile image"
                        />
                        <div className="flex-1 border-l-2 dark:border-gray-600 pl-4 border-gray-300">
                            <div className="flex justify-between items-center mb-2 ">
                                <div>
                                    <h2 className="text-lg font-semibold dark:text-gray-200">
                                        {talent.user.profile.firstName &&
                                        talent.user.profile.lastName
                                            ? talent.user.profile.firstName +
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
                                    onClick={() => handleViewDetails(talent)}
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
                                {talent.skills.map((skill, index) =>
                                    index > 5 ? (
                                        <span
                                            key={index}
                                            className="bg-gray-200 dark:bg-blue-300 text-gray-800 px-2 py-1 rounded-full text-xs mr-2"
                                        >
                                            +
                                            {talent.skills.length -
                                                (AMOUNT_SKILLS_TO_SHOW + 1)}
                                        </span>
                                    ) : (
                                        <span
                                            key={index}
                                            className="bg-gray-200 dark:bg-blue-300 text-gray-800 px-2 py-1 rounded-full text-xs mr-2"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>
                            <div className="text-gray-700 text-sm max-w-screen-lg dark:text-gray-200">
                                {truncateDescription(talent.description, 250)}
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
                // setShowReviewForm={setShowReviewForm}
            />
            <ToastContainer limit={3} />
        </div>
    );
}
