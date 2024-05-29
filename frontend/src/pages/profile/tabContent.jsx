// TabContent.js
import React from "react";
import ProfileTabContent from "./tabcontents/profile.tabcontent";
import ChangePasswordTabContent from "./tabcontents/changePassword.tabcontent";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
const TabContent = ({ activeTab }) => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className="w-3/4 p-4 bg-white dark:bg-gray-700 shadow-lg rounded-xl">
            {activeTab === 1 && (
                <ProfileTabContent
                    profileData={{
                        username: currentUser?.user.username,
                        firstName: currentUser?.userProfile.firstName,
                        lastName: currentUser?.userProfile.lastName,
                        country: currentUser?.userProfile.country,
                    }}
                />
            )}
            {activeTab === 2 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Tab 2 Content
                    </h2>
                    <p className="text-lg text-gray-700">
                        This is the content of Tab 2.
                    </p>
                </div>
            )}
            {activeTab === 3 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Tab 3 Content
                    </h2>
                    <p className="text-lg text-gray-700">
                        This is the content of Tab 3.
                    </p>
                </div>
            )}
            {activeTab === 4 && (
                <div>
                    <ChangePasswordTabContent />
                </div>
            )}
        </div>
    );
};

export default TabContent;
