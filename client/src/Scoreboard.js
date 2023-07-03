import useFetch from "./useFetch";
import image from "./imgs/blank-profile-picture-973460_1280.webp"

const Scoreboard = () => {

    const { data: users, isPending, error } = useFetch('http://localhost:8000/users');

    function item() {
        return (

            <>
                {error && <div>{error}</div>}
                {isPending && <div>Loading...</div>}
                {
                    users && users.sort((a, b) => a.score < b.score ? 1 : -1).map((user, index) => (
                        < div className="profile" key={index}>
                            <div className="item">
                                <img src={image} alt="img" />
                                <h3 className="name">{user.username}</h3>
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