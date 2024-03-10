import SubmissionList from "./SubmissionList";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSubmissions } from "./services/submission";
import Error from './Error'

export default function Submissions({ url }) {

    const [currentPage, setCurrentPage] = useState(1);
    const [submissionsPerPage, setSubmissionsPerPage] = useState(10);

    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(1);

    const [count, setCount] = useState(0);

    const { data: subs, isPending, isError, error } = useQuery({
        queryKey: ["submissionsPage", currentPage, submissionsPerPage, url ],
        queryFn: async () => {
            const pageRequest = {
                "page": currentPage,
                "limit": submissionsPerPage
            };

            const res = await getAllSubmissions(url, pageRequest);
            setCount(res.count);
            return res;
        }
    });


    
    useEffect(() => {
        // console.log(pageNumberLimit, maxPageNumberLimit, minPageNumberLimit, currentPage);
        if (count && currentPage > Math.ceil(count / submissionsPerPage)) {
            // console.log(currentPage, count, submissionsPerPage);
            setCurrentPage(Math.ceil(count / submissionsPerPage))
            setMinPageNumberLimit(Math.floor(currentPage / pageNumberLimit))
            setMaxPageNumberLimit(minPageNumberLimit + pageNumberLimit - 1)
        }
    }, [submissionsPerPage])

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
        if (subs && currentPage !== Math.ceil(count / submissionsPerPage)) {
            setCurrentPage(currentPage + 1);
            if (currentPage + 1 > maxPageNumberLimit) {
                setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit)
                setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit)
            }
        }
    }

    return (
        <>
            {isError && <Error err={error} />}
            {isPending && <div>Loading...</div>}
            {!isError && !isPending && subs && <SubmissionList submissions={subs.rows} />}
            {!isError && !isPending && subs && count !== 0 &&
                <Pagination
                    postsPerPage={submissionsPerPage}
                    setPostsPerPage={setSubmissionsPerPage}
                    totalPosts={count}
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
