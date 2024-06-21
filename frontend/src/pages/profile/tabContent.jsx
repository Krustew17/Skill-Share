// TabContent.js
import React from "react";
import ProfileTabContent from "./tabcontents/profile.tabcontent";
import ChangePasswordTabContent from "./tabcontents/changePassword.tabcontent";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import TalentCardsTabContent from "./tabcontents/talentCardsContent";
const TabContent = ({ activeTab }) => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className="w-full mx-auto bg-white dark:bg-gray-800 rounded-xl px-8">
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
            {activeTab === 2 && <TalentCardsTabContent />}
            {activeTab === 3 && (
                <div>
                    <ChangePasswordTabContent />
                </div>
            )}
            {activeTab === 4 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Tab 3 Content
                    </h2>
                    <p className="text-lg text-gray-700">
                        This is the content of Tab 3.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TabContent;
