import useFetch from "./useFetch";

const Scoreboard = () => {

    const { data: users, isPending, error } = useFetch('http://localhost:5000/user');

    function item() {
        return (

            <>
                {error && <div>{error}</div>}
                {isPending && <div>Loading...</div>}
                {
                    users && users.sort((a, b) => a.score < b.score ? 1 : -1).map((user, index) => (
                        < div className="profile" key={index}>
                            <div className="item">
                                <img src={user.img} alt="img" />
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