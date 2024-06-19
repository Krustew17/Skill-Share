import NavBar from "./components/nav.jsx";
import Hero from "./components/hero.jsx";
import AboutUs from "./components/about-us.jsx";
import Premium from "./components/premium.jsx";
import Footer from "./components/footer.jsx";
import Talents from "./pages/talents/talents.jsx";
import Jobs from "./pages/jobs/jobs.jsx";
import FAQ from "./pages/FAQ/faq.jsx";
import ProfilePage from "./pages/profile/profile.jsx";
import MagicLinkVerification from "./pages/magic_link_verification/magic_link_verification.jsx";
import { AuthContext } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/protectedRouteComponent.jsx";

import { Route, Router, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useContext } from "react";
import React from "react";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import ProtectedElement from "./components/protectedRouteComponent.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

function App() {
    const location = useLocation();
    const { setAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const status = searchParams.get("successful_payment");
        if (status === "true") {
            toast.success("Successful Payment ", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });

            setTimeout(() => {
                window.location.replace("/");
            }, 1000);
        } else if (status === "false") {
            toast.error("Payment failed, please try again. ", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            setTimeout(() => {
                window.location.replace("/");
            }, 1000);
        }
        if (searchParams.get("token")) {
            console.log(searchParams.get("token"));
            localStorage.setItem("token", searchParams.get("token"));
            setAuthenticated(true);
            window.location.replace("/");
        }
    }, [location]);

    return (
        <>
            <NavBar />
            {/* <Router> */}
            <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/talent" element={<Talents />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/FAQ" element={<FAQ />} />
                <Route
                    path="/verify-email"
                    element={<MagicLinkVerification />}
                />
                <Route
                    path="/profile"
                    element={<ProtectedElement component={ProfilePage} />}
                />
            </Routes>
            {/* </Router> */}
            {location.pathname == "/" && (
                <>
                    <AboutUs />
                    <Elements stripe={stripePromise}>
                        <Premium />
                    </Elements>
                    <Footer />
                    <ToastContainer
                        position="bottom-left"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                        transition:Bounce
                        limit={1}
                    />
                </>
            )}
        </>
    );
}

export default App;
