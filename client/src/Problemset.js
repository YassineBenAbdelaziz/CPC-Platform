import useFetch from "./useFetch";
import ProblemList from "./ProblemList";
import { useState } from "react";
import Pagination from "./Pagination";

const Problemset = () => {
    const { data: problemset, isPending, error } = useFetch('http://localhost:5000/problem');

    const [currentPage, setCurrentPage] = useState(1);
    const [problemsPerPage] = useState(10);
    problemset && console.log(problemsPerPage, problemset.length);

    //Get Current Problems
    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = problemset && problemset.slice(indexOfFirstProblem, indexOfLastProblem);

    //Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="problemset">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {problemset && <ProblemList problemset={currentProblems} title="Problems" />}
            {problemset && problemset.length > 10 && <Pagination postsPerPage={problemsPerPage} totalPosts={problemset.length} paginate={paginate} />}
        </div>
    );
}

export default Problemset;