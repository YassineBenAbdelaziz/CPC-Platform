import Scoreboard from "./Scoreboard";

const Home = () => {
    return (
        <div className="home">
            <h2>Welcome <span className="name"></span> !</h2>
            {/* <h3>Anouncements</h3> */}
            <Scoreboard />
        </div>
    );
}

export default Home;