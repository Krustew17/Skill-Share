import { Link } from "react-router-dom";
import React from "react";

export default function Hero() {
    return (
        <section className="bg-white dark:bg-gray-800 mt-10 md:mt-32 ">
            <div className="container mx-auto py-8 px-4 text-center lg:py-8 lg:px-12">
                <h1 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl md:text-8xl lg:text-9xl">
                    Connect with top{" "}
                    <span className="text-blue-500">Talent</span> and Services
                </h1>
                <p className="mt-4 text-xl sm:text-3xl lg:text-4xl text-gray-400">
                    Find the best professionals and services for your needs.
                </p>
                <div className="mt-16 flex justify-center md:-translate-x-10 gap-5 ">
                    <Link
                        to="/sign-up"
                        className="bg-blue-500 text-white px-8 py-4 text-xs md:px-16 md:py-6 rounded-lg hover:bg-blue-400  md:text-3xl"
                    >
                        Get Started
                    </Link>
                    <button className="bg-blue-500 text-white px-8 py-4 text-xs  md:px-16 md:py-6 rounded-lg hover:bg-blue-400 md:text-3xl">
                        Learn More
                    </button>
                </div>
                <h2 className="text-xl md:text-3xl text-left mb-10 mt-20  text-gray-300">
                    Trusted by
                </h2>
                <div className="flex flex-wrap gap-16 md:gap-32 flex-row mb-10">
                    <img
                        src="/src/assets/Airbnb_Logo.png"
                        alt="airbnb logo"
                        className="h-4 sm:h-10 xl:h-12"
                    />
                    <img
                        src="/src/assets/Microsoft_logo.png"
                        alt="microsoft logo"
                        className="h-4 sm:h-10 xl:h-12"
                    />
                    <img
                        src="/src/assets/Nike-Logo.png"
                        alt="nike logo"
                        className="h-6 sm:h-10 xl:h-12"
                    />
                </div>
            </div>
        </section>
    );
}
