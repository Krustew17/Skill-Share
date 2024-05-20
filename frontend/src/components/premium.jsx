import { FaCheck } from "react-icons/fa6";
import { IoClose, IoCloseOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
export default function Premium() {
    return (
        <section className="flex flex-col gap-3 mt-5 mb-10">
            <span className="block w-full h-spanHeight bg-gray-300 dark:bg-gray-600"></span>

            <h1 className="text-center text-6xl mt-10 font-bold dark:text-white">
                Explore Premium
            </h1>
            <div className="flex gap-48 justify-center mt-16">
                <article className="flex flex-col gap-3 border-black dark:border-gray-200 rounded-lg border-2 px-10 py-12">
                    <h2 className="text-5xl tracking-wide dark:text-gray-50">
                        Basic
                    </h2>
                    <div className="flex flex-col mt-5 gap-5 max-w-xs">
                        <h3 className="text-2xl text-gray-700 dark:text-gray-300">
                            features
                        </h3>
                        <ul className="flex flex-col flex-wrap gap-5 mt-5 dark:text-gray-100">
                            <li className="flex gap-2">
                                <GoDotFill className=" text-gray-800 dark:text-red-500 text-2xl" />
                                Unlimited talent cards{" "}
                                <IoMdClose className=" text-red-500 text-2xl" />
                            </li>
                            <li className="flex gap-2">
                                <GoDotFill className=" text-gray-800 dark:text-red-500 text-2xl" />
                                Unlimited job listings{" "}
                                <IoMdClose className=" text-red-500 text-2xl" />
                            </li>
                            <li className="flex gap-2">
                                <GoDotFill className=" text-gray-800 dark:text-red-500 text-2xl" />
                                Profile boost
                                <IoMdClose className=" text-red-500 text-2xl" />
                            </li>
                        </ul>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            The Basic Plan is perfect for individuals just
                            starting out. Showcase your top skill and post one
                            job opportunity to attract the right talent.{" "}
                        </p>
                        <button className="text-3xl text-black dark:text-white py-2 bg-blue-500 border-2 border-blue-500 rounded mt-10">
                            Free
                        </button>
                    </div>
                </article>
                <article className="flex flex-col gap-3 border-black dark:border-gray-100 rounded-lg border-2 px-10 py-8">
                    <h2 className="text-5xl tracking-wide dark:text-white">
                        Premium
                    </h2>
                    <div className="flex flex-col mt-5 gap-5 max-w-xs">
                        <h3 className="text-2xl text-gray-700 dark:text-gray-300">
                            features
                        </h3>
                        <ul className="flex flex-col flex-wrap gap-5 mt-5 dark:text-gray-100">
                            <li className="flex gap-2">
                                <GoDotFill className=" text-gray-800 dark:text-green-500 text-2xl" />
                                Unlimited talent cards{" "}
                                <FaCheck className=" text-green-500 text-2xl" />
                            </li>
                            <li className="flex gap-2">
                                <GoDotFill className=" text-gray-800 dark:text-green-500  text-2xl" />
                                Unlimited job listings{" "}
                                <FaCheck className=" text-green-500   text-2xl" />
                            </li>
                            <li className="flex gap-2">
                                <GoDotFill className=" text-gray-800 dark:text-green-500  text-2xl" />
                                Profile boost
                                <FaCheck className=" text-green-500 text-2xl" />
                            </li>
                        </ul>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                            The Premium Plan is for businesses and professionals
                            who want to maximize their reach and efficiency.
                        </p>
                        <button className="text-3xl text-black dark:text-white py-2 bg-blue-500 border-2 border-blue-500 hover:bg-blue-600 hover:border-blue-600 hover:cursor-pointer rounded mt-10">
                            9.99$
                        </button>
                    </div>
                </article>
            </div>
        </section>
    );
}
