import { Link } from "react-router-dom";
import useFetch from "./useFetch";
import url from './Url';

const Contests = () => {
    const { data: contests, isPending, error } = useFetch(url + 'contest');

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