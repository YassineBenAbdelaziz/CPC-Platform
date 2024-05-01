import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPreviousContests, getUpcomingContests } from "../../services/contests.js";
import Error from '../Error/Error.jsx'
import Pagination from "../utils/Pagination.jsx";
import ContestList from "./ContestList.jsx";


const Contests = () => {
    const { data: contests, isPending, isError, error } = useQuery({
        queryKey : ['contests'],
        queryFn : async () => {
            return await getUpcomingContests();
        }
    });

    const { data: prevContests, prevIsPending, prevIsError, prevError } = useQuery({
        queryKey : ['previousContests'],
        queryFn : async () => {
            const body = {
                page : currentPage,
                limit : contestsPerPage,
                status : 'closed'
            }
            return await getPreviousContests(body);
        }
    });


    const [currentPage, setCurrentPage] = useState(1);
    const [contestsPerPage, setContestsPerPage] = useState(10);

    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(1);

    useEffect(() => {
        setMinPageNumberLimit(Math.ceil(currentPage / pageNumberLimit))
        setMaxPageNumberLimit(minPageNumberLimit + pageNumberLimit)
    }, [currentPage])

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
        if (problems && currentPage !== Math.ceil(problems.count / problemsPerPage)) {
            setCurrentPage(currentPage + 1);
            if (currentPage + 1 > maxPageNumberLimit) {
                setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit)
                setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit)
            }
        }
    }


    return (

        <div className="content">
            <h1>Contests</h1>
            <hr style={{marginTop : '20px'}} />
            <br />
            <h2 style={{marginBottom : '10px'}}>Current and Upcoming Contests</h2>
            <div className="contests">
                {isError && <Error err={error} />}
                {isPending && <div>Loading...</div>}
                {console.log(isError + isPending + contests )}
                {!isError && !isPending && contests  && contests.count === 0 &&
                    <div>No contests found, stay tuned!</div>}

                {!isError && !isPending && contests && contests.count !== 0 && 
                <ContestList
                    rows={contests} type="upcoming"
                />}


            </div>

            <br />

            <h2 style={{marginBottom : '10px'}}>Previous Contests</h2>

            <div className="contests">
                {prevIsError && <Error err={prevError} />}
                {prevIsPending && <div>Loading...</div>}
                {!prevIsError && !prevIsPending && prevContests  && prevContests.count === 0 &&
                    <div>Sorry, No contests found!</div>}

                {!prevIsError && !prevIsPending && prevContests && prevContests.count !== 0 && 
                <ContestList
                    rows={prevContests.rows} type="previous"
                />}
                {!prevIsError && !prevIsPending && prevContests && prevContests.count !== 0 && 
                < Pagination
                    postsPerPage={contestsPerPage}
                    setPostsPerPage={setContestsPerPage}
                    totalPosts={prevContests.count}
                    paginate={paginate}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    currentPage={currentPage}
                    maxPageNumberLimit={maxPageNumberLimit}
                    minPageNumberLimit={minPageNumberLimit}
                />}

            </div>
        </div>
        
    );
}

export default Contests;