import React, { useState } from "react";
import Dashboard from "./dashboard";
import TabContent from "./tabContent";

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };

    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto mt-5 md:mt-20 rounded-2xl md:min-h-full gap-5">
            <Dashboard activeTab={activeTab} handleTabClick={handleTabClick} />
            <TabContent activeTab={activeTab} />
        </div>
    );
};

export default ProfilePage;
