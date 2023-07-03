import { useParams } from "react-router-dom";
import useFetch from "./useFetch";
import ProblemList from "./ProblemList";

const ContestDetails = () => {
    const { id } = useParams();
    const { data: contest, isPending, error } = useFetch('http://localhost:8000/contests/' + id);

    return (
        <div className="contest-details">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {contest && <ProblemList problemset={contest.problems} title={contest.title} titlePrefixe={true} />}
        </div>
    );
}

export default ContestDetails;