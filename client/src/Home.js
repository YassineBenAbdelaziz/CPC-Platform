import Scoreboard from "./Scoreboard";
import useAuth from "./hooks/useAuth";

const Home = () => {
    const { auth } = useAuth();
    return (
        <div className="content">
            <div className="home">
                <h2>Welcome <span className="name">{auth?.username}</span> !</h2>
                {/* <h3>Anouncements</h3> */}
                <Scoreboard username={auth?.username} />
            </div>
        </div>
    );
}

export default Home;