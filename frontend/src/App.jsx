import NavBar from "./components/nav/nav.jsx";
import Hero from "./components/hero/hero.jsx";
import Talents from "./components/talents/talents.jsx";
import Jobs from "./components/jobs/jobs.jsx";
import FAQ from "./components/FAQ/faq.jsx";
import SignUp from "./components/sign up/signup.jsx";
import Login from "./components/login/login.jsx";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
        <>
            <NavBar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Hero />} />
                    <Route path="/talents" element={<Talents />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/FAQ" element={<FAQ />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
