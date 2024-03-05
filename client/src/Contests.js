import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getContests } from "./services/contests";
import Error from './Error'

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
                {isError && <Error err={error} />}
                {isPending && <div>Loading...</div>}
                {!isError && !isPending && contests && contests.sort((a, b) => a.date > b.date ? 1 : -1).map((contest, index) => (
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