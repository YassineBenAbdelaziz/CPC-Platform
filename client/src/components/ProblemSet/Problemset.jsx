import { useEffect, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import Pagination from "../utils/Pagination.jsx";
import close from "../../assets/close.png";
import add from "../../assets/add.png";
import loading from "../../assets/loading.gif";
import ProblemListHeader from "./ProblemListHeader.jsx";
import ProblemList from "./ProblemList.jsx";
import { useQuery } from "@tanstack/react-query";
import { getTagCount, deleteTags, updateTags } from "../../services/tag.js";
import { getProblems } from "../../services/problems.js";
import Error from '../Error/Error.jsx'
import editBtn from '../../assets/edit.png'
import WithPermissions from "../auth/WithPermissions.jsx";

const Problemset = () => {

    const { data: deleteRes, mutate: deleteMutattion, isPending: deletionIsPending, isError: deletionIsError, error: deletionError, isSuccess: deletionSuccess } = useMutation({
        mutationFn : async (body) => {
            return await deleteTags(body);
        }
    });
    const { data: updateRes, mutate: updateMutattion, isPending: updateIsPending, isError: updateIsError, error: updateError } = useMutation({
        mutationFn : async (body) => {
            return await updateTags(body);
        },
        onSuccess: (data) => {
            if (deletionSuccess || deletedTags.length == 0) {
                setEditing(false);
                // window.location.reload();
            }
        }        
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [problemsPerPage, setProblemsPerPage] = useState(10);

    const [pageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(1);

    const [column, setColumn] = useState("title");
    const [type, setType] = useState("asc");
    const [tagsFilter, setTagsFilter] = useState("");

    const [editing, setEditing] = useState(false);
    const [deletedTags, setDeletedTags] = useState([]);
    const [updatedTags, setUpdatedTags] = useState([]);
    
    const { data: tags, isPending: tagIsPending, isError: isErrorTags, error: tagsError } = useQuery({
        queryKey : ['tagCount'],
        queryFn : getTagCount,
    });
    const [newTags, setNewTags] = useState([]);

    useEffect(() => {
        if (tags) {
            const newTags = [];
            tags.forEach((tag) => {
                const obj = {
                    id_tag: tag.id_tag,
                    tag: tag.tag
                }
                if (!newTags.some(existingObj => existingObj.id_tag === obj.id_tag))
                    newTags.push(obj);
            });
            setNewTags(newTags);
        }
    }, [tags]);

    const { data: problems, isPending, isError, error } = useQuery({
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

    const handleDeleteTagFilter = useCallback((i) => {
        if (tagsFilter !== "") {
            const deleteVal = [...tagsFilter];
            deleteVal.splice(i, 1);
            setTagsFilter(deleteVal);
            if (!deleteVal.length) {
                setTagsFilter("")
            }
        }
    }, [tagsFilter])


    console.log(deletedTags);
    const handleCreateTag = () => {
        let maxId = 0;
        for (let i = 0; i < newTags.length; i++) {
            maxId = Math.max(maxId, newTags[i].id_tag);
        }
        setNewTags([{ id_tag: maxId + 1, tag: "" }, ...newTags])
    }
    const handleTagDelete = (i) => {
        const newVals = [...newTags];
        const deletedVals = [...deletedTags, newTags[i].id_tag];
        setDeletedTags(deletedVals);
        newVals.splice(i, 1);
        setNewTags(newVals);
    }
    const handleTagUpdate = (e, i) => {
        const onChangeVal = [...newTags];
        onChangeVal[i].tag = e.target.value;
        setNewTags(onChangeVal);
    }
    
    const handleSaveTags = (e) => {
        e.preventDefault();

        if (deletedTags.length)
            deleteMutattion({
                tagIds: deletedTags
            });

        updateMutattion(newTags);
    }

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
                {isError && <Error err={error} />}
                {isPending && <div>Loading...</div>}
                {!isError && !isPending && problems &&
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
                }

                <div className="sidebar">
                    <div className="item">
                        <h3>
                            Tags :
                            <WithPermissions roles={['admin']}>
                                {editing ? 
                                    <img className="save-icon" src={add} alt="save" onClick={handleCreateTag}/>
                                    : <img className="edit-icon" src={editBtn} title="Edit" alt="edit" onClick={() => setEditing(true)}/>
                                }
                            </WithPermissions>
                        </h3>
                        
                        {isErrorTags && <Error err={tagsError} />}
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
                                        onClick={() => handleDeleteTagFilter(i)}
                                    />
                                </div>
                            ))}
                            
                            <div className="item-content">
                                {
                                    editing ?
                                        <form onSubmit={(e) => handleSaveTags(e)}>
                                            {newTags.map((tag, i) => (
                                                <div className="tag" key={i}>
                                                    <input type="text" 
                                                        required 
                                                        value={tag.tag} 
                                                        style={{ width: 'max-content', marginRight: '5px' }}
                                                        onChange={(e) => handleTagUpdate(e,i)} 
                                                    />
                                                    <img src={close} 
                                                        style={{
                                                            width: '13px',
                                                            height: '13px',
                                                            cursor: 'pointer',
                                                        }}
                                                        alt="close"
                                                        onClick={() => handleTagDelete(i)}
                                                    />                                                
                                                </div>
                                            ))}
                                            <div className="submit-btn">
                                                <button className="save-tags" disabled={deletionIsPending}>Save</button>
                                                {/* <button className="submit" disabled={isPending}>Submit</button> */}
                                                <img src={loading} alt="" style={{ width: '30px', display: deletionIsPending || updateIsPending ? 'block' : 'none', marginLeft: '10px' }} />
                                                {(deletionIsError && <Error err={deletionError} />) || (updateIsError && <Error err={updateError} />)}
                                            </div>      
                                        </form>
                                    : 
                                    tags.sort((a, b) => a.tag > b.tag ? 1 : -1).map((tag, i) => (
                                        <div className="tag" key={i + 155} onClick={() => handleTagClick(tag.tag)}>
                                            <div style={{ width: 'max-content', marginRight: '5px' }}> {tag.tag} </div>
                                            <div>{tag.n_tag}</div>                                           
                                        </div>
                                    ))
                                }
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