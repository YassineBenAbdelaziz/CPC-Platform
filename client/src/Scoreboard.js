import { Link } from "react-router-dom";
import useFetch from "./useFetch";
import url from './Url';

const Scoreboard = ({ username }) => {

    const { data: users, isPending, error } = useFetch(url + 'user');

    function item() {
        return (

            <>
                {error && <div>{error}</div>}
                {isPending && <div>Loading...</div>}
                {
                    users && users.sort((a, b) => a.score < b.score ? 1 : -1).map((user, index) => (
                        < div className="profile" key={index} style={username === user.username ? { background: '#00800047' } : {}}>
                            <div className="item">
                                <div style={{ fontWeight: '600', marginRight: '10px' }}>{index + 1}</div>
                                <Link to={`/profile/${user.username}`}>
                                    <img src={url + user.imagePath} alt="img" />
                                </Link>
                                <Link to={`/profile/${user.username}`}>
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="profiles">
                    {item()}
                </div>
            </div>
        </div>
    );
}

export default Scoreboard;