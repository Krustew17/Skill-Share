import { useState, useEffect, useContext } from "react";
import React from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useResolvedPath, useMatch, useNavigate } from "react-router-dom";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import SignUp from "../pages/sign up/signup";
import Login from "../pages/login/login";

export default function NavBar() {
    const navigate = useNavigate();

    const { authenticated, logout, currentUser } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [DarkMode, setDarkMode] = useState(() => {
        return (
            localStorage.getItem("darkMode") === "true" ||
            window.matchMedia("(prefers-color-scheme: dark)").matches
        );
    });
    const hasGmailPhoto = currentUser?.userProfile?.profileImage.startsWith(
        "https://lh3.googleusercontent.com"
    );
    console.log(hasGmailPhoto);
    const test = (data) => {
        if (data === "close") {
            setIsModalOpen(false);
            setIsMenuOpen(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const openLogin = () => {
        setIsLoginOpen(true);
    };

    const closeLogin = () => {
        setIsLoginOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDarkMode = () => {
        setDarkMode(!DarkMode);
    };

    useEffect(() => {
        if (DarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        }
    }, [DarkMode]);

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg p-4">
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4 list-none dark:text-white">
                    <CustomLink
                        to="/"
                        className="text-2xl lg:text-4xl font-dancing-script mr-6 lg:mr-10 "
                    >
                        Skill Share
                    </CustomLink>
                    <div className="hidden md:flex space-x-4 text-xl list-none">
                        <CustomLink to="/talents">Talents</CustomLink>
                        <CustomLink to="/" scrollTo={2000}>
                            Premium
                        </CustomLink>
                        <CustomLink to="/FAQ">FAQ</CustomLink>
                    </div>
                </div>

                <div className="hidden md:flex space-x-4">
                    <DarkModeSwitch
                        className="mr-4"
                        checked={DarkMode}
                        onChange={toggleDarkMode}
                        size={35}
                        moonColor="#d3d6db"
                        sunColor="#1f2937"
                    />

                    {authenticated ? (
                        <div className="flex gap-10 list-none">
                            <CustomLink to="/profile">
                                <img
                                    className="h-10 w-10 rounded-full border-2 border-gray-800 dark:border-gray-300 hover:cursor-pointer hover:shadow-blue-600 dark:hover:shadow-blue-300 hover:shadow-lg"
                                    src={
                                        hasGmailPhoto
                                            ? `${currentUser?.userProfile?.profileImage}`
                                            : `http://127.0.0.1:3000/uploads/profileImages/${currentUser?.userProfile?.profileImage}`
                                    }
                                />
                            </CustomLink>
                            <button
                                onClick={logout}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="list-none flex gap-5 items-center">
                            <CustomLink
                                // to="/sign-up"
                                onClick={openModal}
                                className=" text-black dark:text-white px-4 py-2 rounded hover:bg-blue-400"
                            >
                                Sign up
                            </CustomLink>
                            <CustomLink
                                onClick={openLogin}
                                className="bg-blue-500 text-white px-8 py-2 rounded-lg hover:bg-blue-400"
                            >
                                Login
                            </CustomLink>
                        </div>
                    )}
                </div>
                <div className="md:hidden flex flex-row flex-wrap gap-10">
                    <DarkModeSwitch
                        className=""
                        checked={DarkMode}
                        onChange={toggleDarkMode}
                        size={30}
                        moonColor="#d3d6db"
                        sunColor="#1f2937"
                    />
                    <button
                        onClick={toggleMenu}
                        className="text-gray-700 focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {isLoginOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 max-w-full">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={closeLogin}
                    ></div>
                    <div className="relative z-10 px-4">
                        <Login />
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
                        <SignUp setter={test} />
                    </div>
                </div>
            )}

            {isMenuOpen && (
                <div className="md:hidden mt-4 space-y-2 list-none flex flex-col gap-4 h-full text-center dark:text-white">
                    <CustomLink to="/talents" className="block text-lg">
                        Talents
                    </CustomLink>
                    <CustomLink
                        to="/"
                        scrollTo={2150}
                        className="block text-lg"
                    >
                        Premium
                    </CustomLink>
                    <CustomLink to="/FAQ" className="block text-lg">
                        FAQ
                    </CustomLink>
                    {authenticated ? (
                        <button
                            onClick={logout}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 max-w-32 self-center"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 items-center">
                            <CustomLink
                                // to="/sign-up"
                                onClick={openModal}
                                className="block max-w-32 text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                            >
                                Sign up
                            </CustomLink>
                            <CustomLink
                                // to="/login"
                                onClick={openLogin}
                                className="block max-w-32 text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                            >
                                Login
                            </CustomLink>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

function CustomLink({ to, children, scrollTo, ...props }) {
    const navigate = useNavigate();
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname });

    const handleClick = (e) => {
        e.preventDefault();
        if (scrollTo !== undefined) {
            navigate("/");
            setTimeout(() => {
                window.scrollTo({
                    top: scrollTo,
                    behavior: "smooth",
                });
            }, 300);
        } else {
            navigate(to);
        }
    };

    return (
        <li className={isActive ? `text-blue-500` : ""}>
            <Link to={to} onClick={handleClick} {...props}>
                {children}
            </Link>
        </li>
    );
}
