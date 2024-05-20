import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useResolvedPath, useMatch } from "react-router-dom";
import { DarkModeSwitch } from "react-toggle-dark-mode";

export default function NavBar() {
    const { authenticated, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    let [DarkMode, setDarkMode] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDarkMode = () => {
        setDarkMode(!DarkMode);
    };

    useEffect(() => {
        if (DarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
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
                        <CustomLink to="/jobs">Jobs</CustomLink>
                        <CustomLink to="/memberships">Memberships</CustomLink>
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
                        <button
                            onClick={logout}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="list-none flex gap-5">
                            <CustomLink
                                to="/sign-up"
                                className=" text-black dark:text-white px-4 py-2 rounded hover:bg-blue-400"
                            >
                                Sign up
                            </CustomLink>
                            <CustomLink
                                to="/login"
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
            {isMenuOpen && (
                <div className="md:hidden mt-4 space-y-2 list-none flex flex-col gap-4 h-full text-center dark:text-white">
                    <CustomLink to="/talents" className="block text-lg">
                        Talents
                    </CustomLink>
                    <CustomLink to="/jobs" className="block text-lg">
                        Jobs
                    </CustomLink>
                    <CustomLink to="/memberships" className="block text-lg">
                        Memberships
                    </CustomLink>
                    <CustomLink to="/FAQ" className="block text-lg">
                        FAQ
                    </CustomLink>
                    {authenticated ? (
                        <button
                            onClick={logout}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 items-center">
                            <CustomLink
                                to="/sign-up"
                                className="block max-w-32 text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                            >
                                Sign up
                            </CustomLink>
                            <CustomLink
                                to="/login"
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

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname });

    return (
        <li className={isActive ? `text-blue-500` : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}
