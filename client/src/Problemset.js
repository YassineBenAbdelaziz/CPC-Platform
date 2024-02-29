import ProblemList from "./ProblemList";
import { useEffect, useState, useCallback } from "react";
import Pagination from "./Pagination";
import close from "./imgs/close.png";
import ProblemListHeader from "./ProblemListHeader";
import { useQuery } from "@tanstack/react-query";
import { getTagCount } from "./services/tag";
import { getProblems } from "./services/problems";

const Problemset = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [problemsPerPage, setProblemsPerPage] = useState(10);

    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(1);

    const [column, setColumn] = useState("title");
    const [type, setType] = useState("asc");
    const [tagsFilter, setTagsFilter] = useState("");


    const { data: tags, IsLoading : tagIsPending ,  isError : isErrorTags , error : tagError } = useQuery({
        queryKey : ['tagCount'],
        queryFn : getTagCount,
    });

    const { data : problems, isPending, isError, error } = useQuery({
        queryKey : ["problems", currentPage, problemsPerPage, column, type, tagsFilter],
        queryFn : () => {
            const pageRequest = {
                "page": currentPage,
                "limit": problemsPerPage,
                "column": column,
                "type": type,
                "tags": tagsFilter
            }

            return getProblems(pageRequest);
        }
    });



    const handleTagClick = useCallback((tag) => {
        const onChangeVal = tagsFilter === "" ? [tag] : [...tagsFilter, tag];
        let test = true;
        for (let i = 0; i < onChangeVal.length - 1; i++) {
            if (onChangeVal[i] === tag)
                test = false;
        }
        if (test || onChangeVal.length === 1) {
            setTagsFilter(onChangeVal);
        }
        test = true
    }, [tagsFilter])

    const handleTagDelete = useCallback((i) => {
        if (tagsFilter !== "") {
            const deleteVal = [...tagsFilter];
            deleteVal.splice(i, 1);
            setTagsFilter(deleteVal);
            if (!deleteVal.length) {
                setTagsFilter("")
            }
        }
    }, [tagsFilter])

    useEffect(() => {

            setMinPageNumberLimit(Math.ceil(currentPage / pageNumberLimit))
            setMaxPageNumberLimit(minPageNumberLimit + pageNumberLimit)
    }, [ currentPage ])

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

    //Sort problems
    const handleScoreSort = () => {
        setColumn("score")
        type === "asc" ? setType("desc") : setType("asc")
    }

    const handleTitleSort = () => {
        setColumn("title")
        type === "asc" ? setType("desc") : setType("asc")
    }
    // Change  tags color darker to mark them being selected for filtering
    return (
        <div className="problemset-content">
            <div className="problemset">
                <div className="problems">
                    {problems && problems.count === 0 && <ProblemListHeader message={"No Problems Available"}></ProblemListHeader> }
                    {problems && problems.count !== 0 && <ProblemListHeader message={"Problems " + `(${problems.count}) : `}></ProblemListHeader> }

                    {problems && problems.count !== 0 && <ProblemList
                        problemset={problems.rows}
                        title="Problems"
                        handleScoreSort={handleScoreSort}
                        handleTitleSort={handleTitleSort}
                        inProblemset={true}
                    />}

                    {problems && problems.count !== 0 &&
                        < Pagination
                            postsPerPage={problemsPerPage}
                            setPostsPerPage={setProblemsPerPage}
                            totalPosts={problems.count}
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
                        {isErrorTags && <div>{tagError}</div>}
                        {tagIsPending && <div>Loading...</div>}
                        {!tagIsPending && !isErrorTags && tags && tags.length!==0 &&
                        <div className="item-content" >
                            {tagsFilter !== "" && tagsFilter.map((tagName, i) => (
                                <div className="tag"
                                    key={i}
                                    style={{
                                        width: 'max-content',
                                        backgroundColor: "rgb(221 221 221 / 79%)",
                                    }}>
                                    <div>{tagName}</div>
                                    <img src={close} style={{
                                        width: '13px',
                                        height: '13px',
                                        cursor: 'pointer',
                                        marginLeft: '10px',
                                    }}
                                        alt="close"
                                        onClick={() => handleTagDelete(i)}
                                    />
                                </div>
                            ))}
                            
                            <div className="item-content">
                                {tags.sort((a, b) => a.tag > b.tag ? 1 : -1).map((tag, i) => (
                                    <div className="tag" key={i + 55} onClick={() => handleTagClick(tag.tag)}>
                                        <div style={{ width: 'max-content', marginRight: '5px' }}>{tag.tag}</div>
                                        <div>{tag.n_tag}</div>
                                    </div>
                                ))}
                            </div>
                        
                        </div>
                        }
                    </div>      
                </div>
            </div>
        </div >
    );
}


export default Problemset;