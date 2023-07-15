import useFetch from "./useFetch";
import ProblemList from "./ProblemList";

const Problemset = () => {
    const { data: problemset, isPending, error } = useFetch('http://localhost:5000/problem');

    return (
        <div className="problemset">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {problemset && <ProblemList problemset={problemset} title="Problems" />}
        </div>
    );
}

export default Problemset;