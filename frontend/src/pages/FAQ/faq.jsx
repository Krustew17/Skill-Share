import { useState } from "react";

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I update my billing information?",
            answer: "To update your billing information, go to the billing section in your account settings and follow the instructions.",
        },
        {
            question: "How can I contact customer support?",
            answer: "To contact customer support, look for a 'Contact us' or 'Help' button or link on the website or platform. You may be able to email, call, or chat with customer support for assistance.",
        },
        {
            question: "How do I update my profile information?",
            answer: "To update your profile information, go to the profile section in your account settings and make the necessary changes.",
        },
        {
            question: "How do I find my purchase history?",
            answer: "To find your purchase history, go to the orders section in your account settings where you can view your past orders.",
        },
    ];

    return (
        <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h6 className="text-lg text-indigo-600 dark:text-indigo-300 font-medium text-center mb-2">
                        FAQs
                    </h6>
                    <h2 className="text-4xl font-manrope text-center font-bold text-gray-900 dark:text-white leading-[3.25rem]">
                        Frequently asked questions
                    </h2>
                </div>

                <div className="accordion-group">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`accordion py-8 px-6 border-b border-solid border-gray-200 transition-all duration-500 rounded-2xl hover:bg-indigo-50 dark:hover:bg-gray-400 ${
                                activeIndex === index ? "bg-indigo-50" : ""
                            }`}
                        >
                            <button
                                className={`accordion-toggle group inline-flex items-center justify-between leading-8 text-gray-900 dark:text-gray-100 w-full transition duration-500 text-left ${
                                    activeIndex === index
                                        ? "font-medium text-indigo-600 dark:text-indigo-600"
                                        : "hover:text-indigo-600"
                                }`}
                                onClick={() => toggleAccordion(index)}
                                aria-expanded={activeIndex === index}
                            >
                                <h5>{faq.question}</h5>
                                <svg
                                    className={`text-gray-500 transition duration-500 ${
                                        activeIndex === index
                                            ? "rotate-180 text-indigo-600"
                                            : "group-hover:text-indigo-600"
                                    }`}
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                </svg>
                            </button>
                            <div
                                className="accordion-content w-full px-0 overflow-hidden transition-max-height duration-500"
                                style={{
                                    maxHeight:
                                        activeIndex === index ? "200px" : "0",
                                }}
                            >
                                <p className="text-base text-gray-900 leading-6">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
