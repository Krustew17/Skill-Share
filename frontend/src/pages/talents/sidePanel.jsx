import React, { useState, useContext } from "react";
import { FaStar } from "react-icons/fa";
import ReviewSlider from "./reviewSlider"; // Assuming this is your slider component
import { MdLocationPin } from "react-icons/md";
import ImageSlider from "./portfolioImagesSlider";
import SkillList from "./skillsComponent";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../talents/checkoutForm";
import "../../index.css";
import { AuthContext } from "../../contexts/AuthContext";
import { toast, Bounce } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const TalentSidePanel = ({
    selectedTalent,
    isSidePanelOpen,
    handleClosePanel,
    currentReviews,
    handleAddReviewClick,
}) => {
    const [clientSecret, setClientSecret] = useState("");
    const { currentUser } = useContext(AuthContext);
    const handleHireClick = async () => {
        if (!currentUser) {
            toast.error("Please login to hire talent", {
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
        if (currentUser.user.id === selectedTalent.user.id) {
            toast.error("You cannot hire yourself", {
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

        const stripe = await stripePromise;

        const response = await fetch(
            import.meta.env.VITE_API_URL + "/stripe/create-payment-intent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    amount: selectedTalent.price,
                    talentId: selectedTalent.id,
                    description: selectedTalent.description,
                    receiptEmail: currentUser.user.email,
                }),
                credentials: "include",
            }
        );

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
    };
    const appearance = {
        theme: "stripe",
    };
    const options = {
        clientSecret,
        appearance,
    };

    const closeCheckoutForm = () => {
        setClientSecret("");
    };

    return (
        <div>
            {isSidePanelOpen && selectedTalent && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-end">
                    <div
                        className={`bg-gray-100 dark:bg-gray-800 border-l border-gray-600 shadow-xl shadow-gray-600 w-full md:w-2/4 h-full p-4 overflow-y-auto ${
                            isSidePanelOpen
                                ? "slide-panel"
                                : "slide-panel-closed"
                        }`}
                    >
                        <button
                            onClick={handleClosePanel}
                            className="text-right dark:text-white hover:bg-red-500 px-4 py-1 rounded-md"
                        >
                            Close
                        </button>
                        <section className="p-4 flex flex-col sm:flex-row mt-4">
                            <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
                                <img
                                    className="w-28 h-28 rounded-full border border-black dark:border-gray-200"
                                    src={`${
                                        selectedTalent.user.profile.profileImage.startsWith(
                                            "https://lh3.googleusercontent.com"
                                        )
                                            ? selectedTalent.user.profile
                                                  .profileImage
                                            : `${
                                                  import.meta.env.VITE_IMAGE_URL
                                              }/uploads/profileImages/${
                                                  selectedTalent.user.profile
                                                      .profileImage
                                              }`
                                    }`}
                                    alt="Talent Photo"
                                />
                            </div>
                            <div className="flex flex-col sm:ml-6 text-center sm:text-left">
                                <h3 className="text-2xl font-semibold dark:text-white">
                                    {selectedTalent.user.profile.firstName &&
                                    selectedTalent.user.profile.lastName
                                        ? `${selectedTalent.user.profile.firstName} ${selectedTalent.user.profile.lastName}`
                                        : selectedTalent.user.username}
                                </h3>
                                <h3 className="dark:text-white text-xl">
                                    {selectedTalent.title}
                                </h3>
                                <h3 className="text-green-700 dark:text-green-500 text-md">
                                    ${selectedTalent.price}
                                </h3>
                                {selectedTalent.user.profile.country && (
                                    <h3 className="dark:text-gray-400 text-sm flex items-center justify-center sm:justify-start">
                                        <MdLocationPin />
                                        {selectedTalent.user.profile.country}
                                    </h3>
                                )}
                            </div>
                            <button
                                className="mt-4 sm:mt-0 ml-auto px-8 max-h-12 text-xl bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                onClick={handleHireClick}
                            >
                                Hire
                            </button>
                        </section>
                        {/* <span className="block w-full h-1 bg-gray-300 dark:bg-gray-700 my-4"></span> */}
                        {/* <section className="flex flex-col sm:flex-row sm:justify-center items-center sm:gap-5 dark:text-white">
                            <p>Price ${selectedTalent.price}</p>
                            <p className="hidden sm:block mx-2">|</p>
                            <p>100% Job Success</p>
                            <p className="hidden sm:block mx-2">|</p>
                            <p>100+ Jobs taken</p>
                            <p className="hidden sm:block mx-2">|</p>
                            <p>5+ years of experience</p>
                            <p className="hidden sm:block mx-2">|</p>
                            <p>$1K+ Earned</p>
                        </section> */}
                        <span className="block w-full h-1 bg-gray-300 dark:bg-gray-700 my-4"></span>
                        <SkillList
                            skills={selectedTalent.skills}
                            maxSkillsToShow={5}
                        />
                        <span className="block w-full h-1 bg-gray-300 dark:bg-gray-700 my-4"></span>
                        <p
                            className="p-4 leading-5 max-w-full dark:text-white"
                            style={{
                                whiteSpace: "pre-line",
                                wordBreak: "break-word",
                            }}
                        >
                            {selectedTalent.description}
                        </p>
                        <span className="block w-full h-1 bg-gray-300 dark:bg-gray-700 my-4"></span>
                        <ImageSlider images={selectedTalent.portfolio} />
                        <span className="block w-full h-1 bg-gray-300 dark:bg-gray-700 my-4"></span>
                        <section className="p-4 flex flex-col items-center">
                            <div className="flex flex-col sm:flex-row justify-between w-full">
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-400 px-6 py-2 rounded-xl"
                                    onClick={handleAddReviewClick}
                                >
                                    Add Review
                                </button>
                                <div className="flex flex-row gap-1 items-center text-xl dark:text-white mt-4 sm:mt-0">
                                    Average Rating:{" "}
                                    {selectedTalent.averageRating}{" "}
                                    <FaStar className="text-yellow-500 text-xl" />
                                </div>
                            </div>
                            <div className="w-full mt-5">
                                {currentReviews.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No reviews yet
                                    </p>
                                ) : (
                                    <div>
                                        <p className="dark:text-white text-md mb-5">
                                            Total Reviews:{" "}
                                            {currentReviews.length}
                                        </p>
                                        <ReviewSlider props={currentReviews} />
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            )}
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm onClose={closeCheckoutForm} />
                </Elements>
            )}
        </div>
    );
};

export default TalentSidePanel;
