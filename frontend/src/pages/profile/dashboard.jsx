import { GoPersonFill } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaMoneyBillTransfer } from "react-icons/fa6";

import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Dashboard = ({ activeTab, handleTabClick }) => {
    const { currentUser } = useContext(AuthContext);
    const [isDashboardVisible, setDashboardVisible] = useState(false);

    const toggleDashboardVisibility = () => {
        setDashboardVisible(!isDashboardVisible);
    };

    const handleTabSelection = (tabIndex) => {
        handleTabClick(tabIndex);
        setDashboardVisible(false); // Close the menu after selecting a tab
    };

    return (
        <div className="flex flex-col md:flex-row mx-auto">
            <button
                onClick={toggleDashboardVisibility}
                className="sm:hidden bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
                Dashboard
            </button>
            <div
                className={`${
                    isDashboardVisible ? "block" : "hidden"
                } sm:block w-full sm:min-w-[300px] md:min-w-[300px] lg:min-w-[300px] bg-white dark:bg-gray-800 dark:shadow-lg max-h-56 dark:shadow-slate-700 dark:text-white p-4 shadow-lg rounded-xl mx-auto sm:mx-0 mt-4`}
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Dashboard
                </h2>
                <ul>
                    <li
                        className={`cursor-pointer text-lg sm:text-xl mt-5 flex gap-2 ${
                            activeTab === 1
                                ? "text-blue-500"
                                : "text-gray-700 dark:text-gray-200"
                        } hover:text-blue-500`}
                        onClick={() => handleTabSelection(1)}
                    >
                        <GoPersonFill className="text-2xl sm:text-3xl" />{" "}
                        Profile
                    </li>
                    <li
                        className={`cursor-pointer text-lg sm:text-xl mt-1 flex gap-2 ${
                            activeTab === 2
                                ? "text-blue-500"
                                : "text-gray-700 dark:text-gray-200"
                        } hover:text-blue-500`}
                        onClick={() => handleTabSelection(2)}
                    >
                        <FaStar className="text-2xl sm:text-3xl" /> Talent Cards
                    </li>
                    {currentUser?.user?.password ? (
                        <li
                            className={`cursor-pointer text-lg sm:text-xl mt-1 flex gap-2 ${
                                activeTab === 3
                                    ? "text-blue-500"
                                    : "text-gray-700 dark:text-gray-200"
                            } hover:text-blue-500`}
                            onClick={() => handleTabSelection(3)}
                        >
                            <RiLockPasswordFill className="text-2xl sm:text-3xl" />{" "}
                            Change Password
                        </li>
                    ) : null}
                    {/* <li
                        className={`cursor-pointer text-lg sm:text-xl mt-1 flex gap-2  ${
                            activeTab === 4
                                ? "text-blue-500"
                                : "text-gray-700 dark:text-gray-200"
                        } hover:text-blue-500`}
                        onClick={() => handleTabSelection(4)}
                    >
                        <FaMoneyBillTransfer className="text-2xl sm:text-3xl" />{" "}
                        Connect Stripe
                    </li> */}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
