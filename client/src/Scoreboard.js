import { Link } from "react-router-dom";
import useFetch from "./useFetch";

const Scoreboard = ({ username }) => {

    const { data: users, isPending, error } = useFetch('http://localhost:5000/user');

    function item() {
        return (

            <>
                {error && <div>{error}</div>}
                {isPending && <div>Loading...</div>}
                {
                    users && users.sort((a, b) => a.score < b.score ? 1 : -1).map((user, index) => (
                        < div className="profile" key={index} style={username === user.username ? { background: '#00800047' } : {}}>
                            <div className="item">
                                <Link to={`/profile/${user.id_user}`}>
                                    <img src={'http://localhost:5000/' + user.imagePath} alt="img" />
                                </Link>
                                <Link to={`/profile/${user.id_user}`}>
                                    <h3 className="username">{user.username}</h3>
                                </Link>
                            </div>
                            <div className="score">
                                {user.score}
                            </div>
                        </div >
                    ))
                }
            </>
        )
    }

    return (
        <div className="board">
            <h2>Scoreboard</h2>
            <div className="profiles">
                {item()}
            </div>
        </div>
    );
}

export default Scoreboard;