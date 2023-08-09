import SubmissionList from "./SubmissionList";
import useFetch from "./useFetch";
import { useParams } from "react-router-dom";
import Pagination from "./Pagination";
import { useState } from "react";

export default function MySubmissions() {
    const url = 'http://localhost:5000/';

    const { id } = useParams();

    const { data: submissions, isPending, error } = useFetch(url + 'submission/findByProblem/' + id);

    const [currentPage, setCurrentPage] = useState(1);
    const [submissionsPerPage, setSubmissionsPerPage] = useState(10);

    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(1);

    //Sort Submissions
    const created = (ch) => {
        return ch.replace('T', '\n').substring(0, 19)
    }
    submissions && submissions.sort((a, b) => created(a.createdAt) < created(b.createdAt) ? 1 : -1)

    //Get Current Submissions
    const indexOfLastSubmission = currentPage * submissionsPerPage;
    const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
    const currentSubmissions = submissions && submissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

    //Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const previousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
            if ((currentPage - 1) < minPageNumberLimit) {
                setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit)
                setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit)
            }
        }
    }
    const nextPage = () => {
        if (submissions && currentPage !== Math.ceil(submissions.length / submissionsPerPage)) {
            setCurrentPage(currentPage + 1);
            if (currentPage + 1 > maxPageNumberLimit) {
                setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit)
                setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit)
            }
        }
    }

    return (
        <>
            {submissions && <SubmissionList submissions={currentSubmissions} error={error} isPending={isPending} />}
            {submissions &&
                <Pagination
                    postsPerPage={submissionsPerPage}
                    setPostsPerPage={setSubmissionsPerPage}
                    totalPosts={submissions.length}
                    paginate={paginate}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    currentPage={currentPage}
                    maxPageNumberLimit={maxPageNumberLimit}
                    minPageNumberLimit={minPageNumberLimit}
                />}
        </>
    )
}
