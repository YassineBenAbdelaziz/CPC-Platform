import useFetch from "./useFetch";
import ProblemList from "./ProblemList";
import { useState } from "react";
import Pagination from "./Pagination";

const Problemset = () => {

    const { data: tags } = useFetch('http://localhost:5000/tag/count');

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
        <div className="problemset-content">
            <div className="problemset">
                <div className="problems">
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

                <div className="sidebar">
                    <div className="item">
                        <h3>Tags :</h3>
                        <div className="item-content">
                            {tags && tags.sort((a, b) => a.tag > b.tag ? 1 : -1).map((tag, i) => (
                                <div className="tag" key={i}>
                                    <div style={{ width: 'max-content', marginRight: '5px' }}>{tag.tag}</div>
                                    <div>{tag.n_tag}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}


export default Problemset;