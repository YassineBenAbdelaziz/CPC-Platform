import SubmissionList from "./SubmissionList";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";
import Axios from "axios";

export default function Submissions({ url }) {

    const [currentPage, setCurrentPage] = useState(1);
    const [submissionsPerPage, setSubmissionsPerPage] = useState(10);

    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(1);

    const [subs, setSubs] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const pageRequest = {
            "page": currentPage,
            "limit": submissionsPerPage
        }
        Axios.post(url, pageRequest)
            .then(res => {
                console.log('Submission Page Fetched')
                const newData = res.data.rows;
                setSubs(newData);
                setCount(res.data.count)
            }).catch(err => {
                console.log("Fetching Submissions Error")
                console.log(err)
            });
        if (!subs.length && count) {
            setCurrentPage(Math.ceil(count / submissionsPerPage))
            setMinPageNumberLimit(Math.ceil(currentPage / pageNumberLimit))
            setMaxPageNumberLimit(minPageNumberLimit + pageNumberLimit - 1)
        }
    }, [currentPage, count, submissionsPerPage, url, subs.length, minPageNumberLimit, pageNumberLimit])

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
            {subs && <SubmissionList submissions={subs} />}
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
