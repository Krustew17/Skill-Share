import React, { useState, useContext } from "react";
import SignUp from "../pages/sign up/signup";
import Login from "../pages/login/login";
import { AuthContext } from "../contexts/AuthContext";

export default function Hero() {
    const { currentUser } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleLearnMore = () => {
        window.scrollTo({ top: 1000, behavior: "smooth" });
    };

    const handleClose = (data) => {
        if (data === "close") {
            setIsModalOpen(false);
            setIsMenuOpen(false);
        }
    };

    const openLogin = () => {
        setIsLoginOpen(true);
    };

    const closeLogin = () => {
        setIsLoginOpen(false);
    };

    const openModal = () => {
        if (currentUser) {
            window.location.replace("/talent");
            return;
        }
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleSignUp = () => {
        setIsModalOpen(true);
        setIsLoginOpen(false);
    };

    const handleSignIn = () => {
        setIsLoginOpen(true);
        setIsModalOpen(false);
    };

    return (
        <section className="bg-white dark:bg-gray-800 mt-10 md:mt-32 ">
            <div className="container mx-auto py-8 px-4 text-center lg:py-8 lg:px-12">
                <h1 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl md:text-8xl lg:text-9xl">
                    Connect with top{" "}
                    <span className="text-blue-500">Talent</span> and Services
                </h1>
                <p className="mt-4 text-xl sm:text-3xl lg:text-4xl text-gray-400">
                    Find the best professionals and services for your needs.
                </p>
                <div className="mt-16 flex justify-center md:-translate-x-5 gap-5 ">
                    <button
                        className="bg-blue-500 text-white px-8 py-4 text-xs md:px-16 md:py-6 rounded-lg hover:bg-blue-400  md:text-3xl"
                        onClick={openModal}
                    >
                        Get Started
                    </button>
                    <button
                        className="bg-blue-500 text-white px-8 py-4 text-xs  md:px-16 md:py-6 rounded-lg hover:bg-blue-400 md:text-3xl"
                        onClick={handleLearnMore}
                    >
                        Learn More
                    </button>
                </div>
                <h2 className="text-xl md:text-3xl text-left mb-10 mt-20  text-gray-300">
                    Trusted by
                </h2>
                <div className="flex flex-wrap gap-16 md:gap-32 flex-row mb-10">
                    <img
                        src="images/Airbnb_Logo.png"
                        alt="airbnb logo"
                        className="h-4 sm:h-10 xl:h-12"
                    />
                    <img
                        src="images/Microsoft_logo.png"
                        alt="microsoft logo"
                        className="h-4 sm:h-10 xl:h-12"
                    />
                    <img
                        src="images/Nike-Logo.png"
                        alt="nike logo"
                        className="h-6 sm:h-10 xl:h-12"
                    />
                </div>
            </div>
            {isLoginOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 max-w-full">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={closeLogin}
                    ></div>
                    <div className="relative z-10 px-4">
                        <Login handleSignUp={handleSignUp} />
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 max-w-full">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={closeModal}
                    ></div>
                    <div className="relative z-10 px-4">
                        <SignUp
                            setter={handleClose}
                            handleSignIn={handleSignIn}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
