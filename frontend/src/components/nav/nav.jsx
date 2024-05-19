import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

export default function NavBar() {
    const { authenticated, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-lg p-4">
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/"
                        className="text-2xl lg:text-4xl font-dancing-script mr-10"
                    >
                        Skill Share
                    </Link>
                    <div className="hidden md:flex space-x-4 text-xl list-none">
                        <CustomLink to="/talents">Talents</CustomLink>
                        <CustomLink to="/jobs">Jobs</CustomLink>
                        <CustomLink to="/memberships">Memberships</CustomLink>
                        <CustomLink to="/FAQ">FAQ</CustomLink>
                    </div>
                </div>
                <div className="hidden md:flex space-x-4">
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
                                className=" text-black px-4 py-2 rounded hover:bg-blue-400"
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
                <div className="md:hidden">
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
                <div className="md:hidden mt-4 space-y-2 list-none flex flex-col gap-4 h-full text-center">
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
