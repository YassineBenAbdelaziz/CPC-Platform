import { Link } from "react-router-dom";
import { getContests } from "./services/contests";
import { useQuery } from "@tanstack/react-query";

const Contests = () => {
    const { data: contests, isPending, isError, error } = useQuery({
        queryKey : ['contests'],
        queryFn : async () => {
            return getContests();
        }
    });

    return (
        <div className="content">
            <h2>Contests</h2>
            <br />
            <div className="contests">
                {error && <div>{error}</div>}
                {isPending && <div>Loading...</div>}
                {contests && contests.sort((a, b) => a.date > b.date ? 1 : -1).map((contest, index) => (
                    <Link to={`/contests/${contest.id_contest}`} key={index}>
                        <div className="contest">
                            <h2>{contest.title}</h2>
                            <p>Created On {contest.date}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Contests;