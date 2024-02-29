import SubmissionList from "./SubmissionList";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSubmissions } from "./services/submission";

export default function Submissions({ url }) {

    const [currentPage, setCurrentPage] = useState(1);
    const [submissionsPerPage, setSubmissionsPerPage] = useState(10);

    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(1);

    const [count, setCount] = useState(0);

    const { data : subs, isPending, isError, error} = useQuery({
        queryKey : ["submissionsPage",currentPage,submissionsPerPage,url ],
        queryFn : async () => {
            const pageRequest = {
                "page": currentPage,
                "limit": submissionsPerPage
            };

            const res = getAllSubmissions(url, pageRequest);
            const data = await res ;
            setCount(data.count);
            return await res ;
        }
    });



    useEffect(() => {

        if ( count) {
            setCurrentPage(Math.ceil(count / submissionsPerPage))
            setMinPageNumberLimit(Math.ceil(currentPage / pageNumberLimit))
            setMaxPageNumberLimit(minPageNumberLimit + pageNumberLimit - 1)
        }
    }, [count])

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
            {subs && <SubmissionList submissions={subs.rows} />}
            {subs && count !== 0 &&
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
