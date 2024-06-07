import React from "react";

export default function AboutUs() {
    return (
        <section className="bg-white dark:bg-gray-800 py-4 flex flex-col gap-5">
            <span className="block w-full h-spanHeight bg-gray-300 dark:bg-gray-600"></span>
            <div className="max-w-screen-xl mx-auto flex flex-col">
                <h2 className="text-4xl md:text-6xl font-semibold text-gray-900 dark:text-gray-200 mb-8 mt-10 text-center">
                    About <span className="text-blue-500">Skill Share</span>
                </h2>
                <article className="flex flex-col md:flex-row md:gap-32 gap-2 sm:pr-24 px-10">
                    <img
                        src="src/assets/test.png"
                        alt="remote work"
                        className="h-64 md:h-96 lg:ml-32 self-center"
                    />
                    <p className="text-xl text-center md:text-2xl text-gray-700 dark:text-gray-300 max-w-prose mt-6 md:mt-20">
                        At Skill Share, we believe in connecting people with
                        opportunities. Our mission is to create a thriving
                        community where talents meet opportunities, fostering
                        growth and success for all.
                    </p>
                </article>
                <article className="flex flex-col-reverse md:flex-row md:gap-32 gap-2 sm:pr-24 px-10 mt-10">
                    <p className="text-xl text-center md:text-2xl text-gray-700 dark:text-gray-300 max-w-prose mt-20 md:ml-32">
                        With our easy-to-use platform, you can post job
                        openings, browse through a diverse pool of talented
                        individuals, and showcase your skills and services to
                        potential clients.
                    </p>
                    <img
                        src="src/assets/people-connecting.png"
                        alt="star"
                        className="h-48 md:h-64 ml32"
                    />
                </article>
                <p className="text-lg text-gray-700 dark:text-gray-400 mt-20 text-center">
                    Skill Share - Where talents meet opportunities.
                </p>
            </div>
        </section>
    );
}
