import React, { useState } from "react";

const SkillList = ({ skills, maxSkillsToShow }) => {
    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <div className="p-4 flex gap-5 flex-wrap">
            {skills
                .slice(0, showAll ? skills.length : maxSkillsToShow)
                .map((skill, index) => (
                    <span
                        key={index}
                        className="px-6 py-1 bg-blue-800 dark:bg-blue-600 rounded-md text-white"
                    >
                        {skill}
                    </span>
                ))}
            {!showAll && skills.length > maxSkillsToShow && (
                <button
                    onClick={toggleShowAll}
                    className="px-6 py-1 bg-blue-800 dark:bg-blue-600 rounded-md text-white"
                >
                    +{skills.length - maxSkillsToShow}
                </button>
            )}
        </div>
    );
};

export default SkillList;
