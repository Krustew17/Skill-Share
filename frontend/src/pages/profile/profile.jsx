import React, { useState } from "react";
import Dashboard from "./dashboard";
import TabContent from "./tabContent";

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    return (
        <div className="flex max-w-7xl mx-auto mt-20 rounded-2xl min-h-full gap-5">
            {/* Dashboard */}
            <Dashboard activeTab={activeTab} handleTabClick={handleTabClick} />

            {/* Tab Content */}
            <TabContent activeTab={activeTab} />
        </div>
    );
};

export default ProfilePage;
