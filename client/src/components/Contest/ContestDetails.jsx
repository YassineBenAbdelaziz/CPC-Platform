import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch.jsx";
import ProblemList from "../ProblemSet/ProblemList.jsx";
import url from '../utils/Url.js';
import Error from '../Error/Error.jsx';

const ContestDetails = () => {
    const { id } = useParams();
    const { data: contest, isPending, error } = useFetch(url + 'contest/' + id);

    // eslint-disable-next-line
    const { data: problems, isPending1, error1 } = useFetch(url + 'problem/findByContest/' + id);

    //Sorting problems 
    problems && problems.sort((a, b) => a.score > b.score ? 1 : -1);

    return (
        <div className="content">
            <div className="contest-details">
                {error && <Error err={error} />}
                {isPending && <div>Loading...</div>}
                {contest && problems && <ProblemList problemset={problems} title={contest.title} inContests={true} contestId={id} />}
            </div>
        </div>
    );
}

export default ContestDetails;