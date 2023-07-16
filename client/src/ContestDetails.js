import { useParams } from "react-router-dom";
import useFetch from "./useFetch";
import ProblemList from "./ProblemList";

const ContestDetails = () => {
    const { id } = useParams();
    const { data: contest, isPending, error } = useFetch('http://localhost:5000/contest/' + id);

    // eslint-disable-next-line
    const { data: problems, isPending1, error1 } = useFetch('http://localhost:5000/problem/findByContest/' + id);

    //Sorting problems 
    problems && problems.sort((a, b) => a.score > b.score ? 1 : -1);

    return (
        <div className="contest-details">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {contest && problems && <ProblemList problemset={problems} title={contest.title} titlePrefixe={true} contestId={id} />}
        </div>
    );
}

export default ContestDetails;