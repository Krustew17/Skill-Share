import React from "react";

const SessionExpired = ({ onContinue }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-white px-10 py-10 rounded-md shadow-md">
                <h1 className="text-5xl text-center text-gray-800 font-bold mb-4">
                    Session Expired!
                </h1>
                <h2 className="text-gray-700 mb-5 text-2xl text-center">
                    Please login again.
                </h2>
                <button
                    onClick={onContinue}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg block w-full text-center"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SessionExpired;
