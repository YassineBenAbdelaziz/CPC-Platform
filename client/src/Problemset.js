import useFetch from "./useFetch";
import ProblemList from "./ProblemList";
import { useState } from "react";
import Pagination from "./Pagination";

const Problemset = () => {
    const { data: problemset, isPending, error } = useFetch('http://localhost:5000/problem');

    const [currentPage, setCurrentPage] = useState(1);
    const [problemsPerPage, setProblemsPerPage] = useState(10);

    //Get Current Problems
    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = problemset && problemset.slice(indexOfFirstProblem, indexOfLastProblem);

    //Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const previousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    }
    const nextPage = () => {
        if (problemset && currentPage !== Math.ceil(problemset.length / problemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    }

    //Sort problems
    problemset && problemset.sort((a, b) => a.score > b.score ? 1 : -1);

    return (
        <div className="problemset">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {problemset && <ProblemList problemset={currentProblems} title="Problems" />}
            {problemset &&
                <Pagination
                    postsPerPage={problemsPerPage}
                    setPostsPerPage={setProblemsPerPage}
                    totalPosts={problemset.length}
                    paginate={paginate}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    currentPage={currentPage}
                />}
        </div>
    );
}

export default Problemset;