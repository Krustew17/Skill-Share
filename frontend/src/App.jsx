import NavBar from "./components/nav.jsx";
import Hero from "./components/hero.jsx";
import AboutUs from "./components/about-us.jsx";
import Premium from "./components/premium.jsx";
import Footer from "./components/footer.jsx";
import Talents from "./pages/talents/talents.jsx";
import Jobs from "./pages/jobs/jobs.jsx";
import FAQ from "./pages/FAQ/faq.jsx";
import SignUp from "./pages/sign up/signup.jsx";
import Login from "./pages/login/login.jsx";
import MagicLinkVerification from "./pages/magic_link_verification/magic_link_verification.jsx";
import "./index.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
    "pk_test_51PHWiFIK3rKcTeQQZeLQQmN3QgdcxdIGV5rc8Xki77jOo40EJQ9BMyDd22Ip7BOTgzJJMJAynkTF1ktpjV3M1jJq002JKrzbst"
);

function App() {
    const location = useLocation();

    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/talents" element={<Talents />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/FAQ" element={<FAQ />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="verify-email"
                    element={<MagicLinkVerification />}
                />
            </Routes>
            {location.pathname == "/" && (
                <>
                    <AboutUs />
                    <Elements stripe={stripePromise}>
                        <Premium />
                    </Elements>
                    <Footer />
                </>
            )}
        </>
    );
}

export default App;
