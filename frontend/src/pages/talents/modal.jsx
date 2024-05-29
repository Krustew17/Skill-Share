import React from "react";

const Modal = ({ onClose, children }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                aria-hidden="true"
            ></div>
            <div
                className="relative z-10 bg-white rounded-lg shadow-lg p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
