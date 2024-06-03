import { FaCheck } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { toast, Bounce } from "react-toastify";
const stripePromise = loadStripe(
    "pk_test_51PHWiFIK3rKcTeQQZeLQQmN3QgdcxdIGV5rc8Xki77jOo40EJQ9BMyDd22Ip7BOTgzJJMJAynkTF1ktpjV3M1jJq002JKrzbst"
);

export default function Premium() {
    const { currentUser } = useContext(AuthContext);

    const processPayment = async (e) => {
        if (!currentUser) {
            return toast.error("Please login first ", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
        if (currentUser.user.hasPremium) {
            return toast.error("You already have premium ", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }

        const stripe = await stripePromise;
        const body = {
            name: "Skill Share Premium",
            price: 999,
            email: currentUser.user.email,
        };
        const headers = {
            "Content-Type": "application/json",
        };

        const request = await fetch(
            "http://127.0.0.1:3000/stripe/create-checkout-session",
            {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            }
        );

        const session = await request.json();
        const result = await stripe.redirectToCheckout({
            sessionId: session.session.id,
        });
        if (result.error) {
            console.log(result.error.message);
        }
    };

    return (
        <section className="flex flex-col gap-3 mt-5 mb-10">
            <span className="block w-full h-spanHeight bg-gray-300 dark:bg-gray-600"></span>

            <h1 className="text-center text-4xl px-10 sm:text-6xl mt-10 font-bold dark:text-white">
                Explore Premium
            </h1>
            <div className="flex flex-col md:flex-row md:px-8 px-12 max-w-screen-xl mx-auto gap-12 lg:gap-48 justify-center mt-16">
                <article className="flex flex-col gap-3 border-black dark:border-gray-200 rounded-lg border-2 px-5 sm:px-10 py-6 sm:py-12 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-4xl sm:text-5xl tracking-wide dark:text-gray-50">
                        Basic
                    </h2>
                    <div className="flex flex-col mt-5 gap-5 max-w-xs">
                        <h3 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300">
                            features
                        </h3>
                        <ul className="flex flex-col flex-wrap gap-5 mt-5 dark:text-gray-100">
                            <li className="flex gap-2 text-sm sm:text-xl">
                                <GoDotFill className=" text-gray-800 dark:text-red-500 text-2xl" />
                                Unlimited talent cards{" "}
                                <IoMdClose className=" text-red-500 text-2xl" />
                            </li>
                            <li className="flex gap-2 text-sm sm:text-xl">
                                <GoDotFill className=" text-gray-800 dark:text-red-500 text-2xl" />
                                Unlimited job listings{" "}
                                <IoMdClose className=" text-red-500 text-2xl" />
                            </li>
                            <li className="flex gap-2 text-sm sm:text-xl">
                                <GoDotFill className=" text-gray-800 dark:text-red-500 text-2xl" />
                                Profile boost
                                <IoMdClose className=" text-red-500 text-2xl" />
                            </li>
                        </ul>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            The Basic Plan is perfect for individuals just
                            starting out. Showcase your top skill and post one
                            job opportunity to attract the right talent.{" "}
                        </p>
                        <button
                            className="text-3xl text-black dark:text-white py-2 bg-blue-500 border-2 border-blue-500 rounded mt-6 sm:mt-10 hover:cursor-not-allowed"
                            disabled
                        >
                            Free
                        </button>
                    </div>
                </article>
                <article className="flex flex-col gap-3 border-black dark:border-gray-200 rounded-lg border-2 px-5 sm:px-10 py-6 sm:py-12 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-4xl sm:text-5xl tracking-wide dark:text-gray-50">
                        Premium
                    </h2>
                    <div className="flex flex-col mt-5 gap-5 max-w-xs">
                        <h3 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300">
                            features
                        </h3>
                        <ul className="flex flex-col flex-wrap gap-5 mt-5 dark:text-gray-100">
                            <li className="flex gap-2 text-sm sm:text-xl">
                                <GoDotFill className=" text-gray-800 dark:text-green-500 text-2xl" />
                                Unlimited talent cards{" "}
                                <FaCheck className=" text-green-500 text-2xl" />
                            </li>
                            <li className="flex gap-2 text-sm sm:text-xl">
                                <GoDotFill className=" text-gray-800 dark:text-green-500  text-2xl" />
                                Unlimited job listings{" "}
                                <FaCheck className=" text-green-500   text-2xl" />
                            </li>
                            <li className="flex gap-2 text-sm sm:text-xl">
                                <GoDotFill className=" text-gray-800 dark:text-green-500  text-2xl" />
                                Profile boost
                                <FaCheck className=" text-green-500 text-2xl" />
                            </li>
                        </ul>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            The Premium Plan is for businesses and professionals
                            who want to maximize their reach and efficiency.
                        </p>
                        <button
                            onClick={processPayment}
                            className="text-3xl text-black text-center dark:text-white py-2 bg-blue-500 border-2 border-blue-500 hover:bg-blue-600 hover:border-blue-600 hover:cursor-pointer rounded mt-6 sm:mt-10"
                        >
                            9.99$
                        </button>
                    </div>
                </article>
            </div>
        </section>
    );
}
