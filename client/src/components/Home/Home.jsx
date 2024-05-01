import AdminDashboard from "../AdminDashboard/AdminDashboard.jsx";
import Scoreboard from "./Scoreboard.jsx";
import useAuth from "../../hooks/useAuth.js";
import HeroSection from "./HeroSection.jsx";

const Home = () => {
    const { auth } = useAuth();
    return (
        <>
        <HeroSection />
        <div className="content">
            <div className="home">
                <Scoreboard username={auth?.username} />
            </div>
        </div>
        </>
    );
}

export default Home;