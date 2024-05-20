import NavBar from "./components/nav.jsx";
import Hero from "./components/hero.jsx";
import AboutUs from "./components/about-us.jsx";
import Premium from "./components/premium.jsx";
import Talents from "./pages/talents/talents.jsx";
import Jobs from "./pages/jobs/jobs.jsx";
import Memberships from "./pages/memberships/memberships.jsx";
import FAQ from "./pages/FAQ/faq.jsx";
import SignUp from "./pages/sign up/signup.jsx";
import Login from "./pages/login/login.jsx";
import MagicLinkVerification from "./pages/magic_link_verification/magic_link_verification.jsx";
import "./index.css";
import { Route, Routes } from "react-router-dom";
function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/talents" element={<Talents />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/memberships" element={<Memberships />} />
                <Route path="/FAQ" element={<FAQ />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="verify-email"
                    element={<MagicLinkVerification />}
                />
            </Routes>
            <AboutUs />
            <Premium />
        </>
    );
}

export default App;
