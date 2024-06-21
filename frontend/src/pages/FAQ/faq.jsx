import React, { useState } from "react";

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is Skillshare?",
            answer: "Skillshare is an online platform where talented individuals can offer their services, and users can browse and purchase these services. The platform connects experts in various fields with those looking to hire professionals for specific tasks or projects.",
        },
        {
            question: "How do I hire a talent on Skillshare?",
            answer: "To hire a talent, simply browse through the available service listings, select a talent that fits your needs, and purchase their service directly through the platform. You can communicate with the talent to discuss the details and ensure the service meets your expectations.",
        },
        {
            question: "How much does Skillshare cost?",
            answer: "Currently Skillshare offers a single premium plan for individuals. It is a one-time payment so you don't have to worry about annoying monthly charges. All the benefits are described in the pricing page.",
        },
        {
            question: "How can I offer my services on Skillshare?",
            answer: "Anybody can offer their services in Skillshare for free. The platform connects experts in various fields with those looking to hire professionals for specific tasks or projects. Simply go to the talents page, click on 'add talent', fill in the form and you're all set!",
        },
        {
            question: "What types of services are available on Skillshare?",
            answer: "Skillshare offers a wide range of services, including graphic design, web development, writing, marketing, personal coaching, and more. Users can find professionals for almost any type of project, ensuring a diverse selection of talents and services.",
        },
        {
            question: "How much does Skillshare charge?",
            answer: "Skillshare will tax 1% of the total amount paid for hiring a talent. Using premium Skillshare will NOT charge you a single cent.",
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
                            className={`accordion py-8 px-6 mt-2 border-b border-solid border-gray-200 transition-all duration-500 rounded-2xl hover:bg-indigo-50 dark:hover:bg-gray-700 ${
                                activeIndex === index
                                    ? "bg-indigo-50 dark:bg-gray-700"
                                    : ""
                            }`}
                        >
                            <button
                                className={`accordion-toggle group inline-flex items-center justify-between leading-8 text-gray-900 dark:text-gray-200 w-full transition duration-500 text-left ${
                                    activeIndex === index
                                        ? "font-medium text-indigo-600 dark:text-indigo-400"
                                        : "hover:text-indigo-600 dark:hover:text-indigo-400"
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
                                <p className="text-base text-gray-900 dark:text-gray-200 leading-6">
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
