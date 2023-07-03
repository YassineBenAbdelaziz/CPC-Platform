import { Link } from "react-router-dom";
import useFetch from "./useFetch";

const Contests = () => {
    const { data: contests, isPending, error } = useFetch('http://localhost:8000/contests');

    return (
        <div className="contests">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {contests === '[]' && !isPending && <div>No Contest Is Available</div>}   {/* fama probleme lena */}
            {contests && contests.sort((a, b) => a.date > b.date ? 1 : -1).map((contest, index) => (
                <Link to={`/contests/${contest.id}`} key={index}>
                    <div className="contest">
                        <h2>{contest.title}</h2>
                        <p>Created On {contest.date}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default Contests;