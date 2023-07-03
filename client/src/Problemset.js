import useFetch from "./useFetch";
import ProblemList from "./ProblemList";

const Problemset = () => {
    const { data: problemset, isPending, error} = useFetch('http://localhost:8000/problemset');

    return (
        <div className="problemset">
            { error && <div>{ error }</div> }
            { isPending && <div>Loading...</div> }
            { problemset==='[]' && !isPending && <div>No Problem Is Available</div> }   {/* fama probleme lena */}
            { problemset && <ProblemList problemset={problemset} title="Problems" />}
        </div>
    );
}

export default Problemset;