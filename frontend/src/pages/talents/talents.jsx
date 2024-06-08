import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import TalentCardForm from "./talentCardForm";
import Modal from "./modal";
import Login from "../login/login";
import { toast, Bounce, ToastContainer } from "react-toastify";
import TalentCardFilters from "./talentCardFilters";
import Search from "./search";
import TalentList from "./talentList";
import React from "react";

export default function Talents() {
    const { authenticated, currentUser } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const [currentReviews, setCurrentReviews] = useState([]);

    const [childData, setChildData] = useState("");

    const handleDataFromChild = (data) => {
        setChildData(data);
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
    const handleClosePanel = () => {
        setSelectedTalent(null);
        setCurrentReviews([]);
        setIsSidePanelOpen(false);
    };

    return (
        <div className="">
            <div className="max-w-2xl mx-auto mt-10 flex items-center">
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm lg:px-4 px-2 py-1 lg:py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mr-4"
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
                <TalentCardFilters {...childData} />
                <TalentList onDataSend={handleDataFromChild} />
            </div>
            <ToastContainer limit={3} />
        </div>
    );
}
