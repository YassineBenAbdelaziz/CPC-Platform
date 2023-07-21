import useFetch from "./useFetch";
import ProblemList from "./ProblemList";
import { useEffect, useState, useCallback } from "react";
import Pagination from "./Pagination";
import Axios from 'axios'
import close from "./imgs/close.png";

const Problemset = () => {

    const url = "http://localhost:5000/";

    const urlGetPage = url + 'problem/problemPage'

    const { data: tags, tagIsPending, tagError } = useFetch(url + 'tag/count');

    const { data: problemset, isPending, error } = useFetch(url + 'problem');

    const [currentPage, setCurrentPage] = useState(1);
    const [problemsPerPage, setProblemsPerPage] = useState(10);

    const [pageNumberLimit] = useState(15);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(15);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(1);

    const [column, setColumn] = useState("title");
    const [type, setType] = useState("asc");
    const [tag, setTag] = useState("");
    const [problems, setProblems] = useState([]);
    const [count, setCount] = useState(0);

    const [chosenTagDisplay, setChosenTagDisplay] = useState("none");
    const [tagName, setTagName] = useState("");

    const handleTagClick = useCallback((tag) => {
        setTag([tag])
        setChosenTagDisplay("flex")
        setTagName(tag)
    }, [])

    const handleTagDelete = useCallback(() => {
        setTag("")
        setChosenTagDisplay("none")
    }, [])

    useEffect(() => {
        const pageRequest = {
            "page": currentPage,
            "limit": problemsPerPage,
            "column": column,
            "type": type,
            "tags": tag
        }
        Axios.post(urlGetPage, pageRequest).then(res => {
            console.log('Problem Page Fetched')
            setCount(res.data.results.count)
            const newData = res.data.results.rows;
            setProblems(newData);
        }).catch(err => {
            console.log("Fetching Problems Error")
            console.log(err)
        });
        if (!problems.length && count) setCurrentPage(Math.ceil(count / problemsPerPage))
    }, [column, count, currentPage, problems.length, problemsPerPage, tag, type, urlGetPage])

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
        if (problemset && currentPage !== Math.ceil(count / problemsPerPage)) {
            setCurrentPage(currentPage + 1);
            if (currentPage + 1 > maxPageNumberLimit) {
                setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit)
                setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit)
            }
        }
    }

    //Sort problems
    const handleScoreSort = () => {
        setColumn("score")
        type === "asc" ? setType("desc") : setType("asc")
    }

    const handleTitleSort = () => {
        setColumn("title")
        type === "asc" ? setType("desc") : setType("asc")
    }

    return (
        <div className="problemset-content">
            <div className="problemset">
                <div className="problems">
                    {error && <div>{error}</div>}
                    {isPending && <div>Loading...</div>}
                    {problemset && <ProblemList
                        problemset={problems}
                        title="Problems"
                        handleScoreSort={handleScoreSort}
                        handleTitleSort={handleTitleSort}
                    />}
                    {problemset &&
                        <Pagination
                            postsPerPage={problemsPerPage}
                            setPostsPerPage={setProblemsPerPage}
                            totalPosts={count}
                            paginate={paginate}
                            previousPage={previousPage}
                            nextPage={nextPage}
                            currentPage={currentPage}
                            maxPageNumberLimit={maxPageNumberLimit}
                            minPageNumberLimit={minPageNumberLimit}
                        />}
                </div>

                <div className="sidebar">
                    <div className="item">
                        <h3>Tags :</h3>
                        <div className="tag" style={{ width: 'max-content', backgroundColor: "rgb(221 221 221 / 79%)", display: chosenTagDisplay }}>
                            <div>{tagName}</div>
                            <img src={close} style={{
                                width: '13px',
                                height: '13px',
                                cursor: 'pointer',
                                marginLeft: '10px',
                            }}
                                alt="close"
                                onClick={() => handleTagDelete()}
                            />
                        </div>
                        {tagError && <div>{tagError}</div>}
                        {tagIsPending && <div>Loading...</div>}
                        {tags &&
                            <div className="item-content">
                                {tags.sort((a, b) => a.tag > b.tag ? 1 : -1).map((tag, i) => (
                                    <div className="tag" key={i + 55} onClick={() => handleTagClick(tag.tag)}>
                                        <div style={{ width: 'max-content', marginRight: '5px' }}>{tag.tag}</div>
                                        <div>{tag.n_tag}</div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
}


export default Problemset;