import { Link } from "react-router-dom";
import url from '../utils/Url.js';
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/user.js";
import Error from "../Error/Error.jsx";

const Scoreboard = ({ username }) => {

    const { data : users, isError, error, isPending } = useQuery({
        queryKey : ['users'],
        queryFn : async () => { 
            return (await getAllUsers())?.data;
        }
    }
    );


    function setCurrentUserStyle(index) {
        const style = {}
        style.backgroundColor = '#00800047'
        if (index === 0) {
            style.borderTopLeftRadius = '15px'
            style.borderTopRightRadius = '15px'
        }
        if (index === users.length - 1) {
            style.borderBottomLeftRadius = '15px'
            style.borderBottomRightRadius = '15px'
        }
        return style;
    }
    
    function item() {
        return (

            <>
                {isError && <Error err={error}/>}
                {isPending && <div>Loading...</div>}
                {!isPending && !isError && !users && <div>No users Found</div>}
                {
                    !isPending && !isError && 
                    users && users.sort((a, b) => a.score < b.score ? 1 : -1).map((user, index) => (
                        < div className="profile" key={index} style={username === user.username ? setCurrentUserStyle(index) : {}}>
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