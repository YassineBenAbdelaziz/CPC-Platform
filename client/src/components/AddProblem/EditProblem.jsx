/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { editproblem, getProblem, deleteproblem } from '../../services/problems.js';
import { findByProblem } from "../../services/example.js";
import { findByProblem as findTagByProblem } from "../../services/tag.js";
import AddExamples from './AddExamples.jsx';
import AddTags from './AddTags.jsx';
import RichText from '../utils/RichText.jsx';
import Error from '../Error/Error.jsx';

export default function EditProblem() {
    const { id } = useParams();

    const { data: problem, problemIsPending, problemIsError, problemError } = useQuery({
        queryKey: ['problem', id],
        queryFn: () => {
            return getProblem(id);
        }
    })

    const { data: Tags, isPending: tagsArePending, isError: isTagsError, error: tagsError } = useQuery({
        queryKey : ['tags', id],
        queryFn : async () => {
            return findTagByProblem(id);
        }
    })

    const { data: Examples, isPending: examplesArePending, isError: isExamplesError, error: examplesError } = useQuery({
        queryKey : ['examples', id],
        queryFn : async () => {
            return findByProblem(id);
        }
    })

    const [topic, setTopic] = useState("");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [note, setNote] = useState("");
    const [testFile, setTestFile] = useState("");
    const [tutorial, setTutorial] = useState("");
    const [solutionFile, setSolutionFile] = useState("");
    const [checker, setChecker] = useState(problem?.checker);
    const [examples, setExamples] = useState([]);
    const [tags, setTags] = useState([]);

    const [chooseChecker, setChooseChecker] = useState(false);
    const [findError, setFindError] = useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: res, mutate, isPending, isError, error } = useMutation({
        mutationFn : async (body) => {
            return await editproblem(id, body);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["problems"]);
            navigate('/problemset', { replace: true });
        },
        onError: (error) => {
            setFindError(true);
        },
    });

    const { data: deleteRes, mutate: deleteProblemMutation, isPending: deletionIsPending, isError: deletionIsError, error: deletionError } = useMutation({
        mutationFn : async () => {
            return await deleteproblem(id);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["problems"]);
            navigate('/problemset', { replace: true });
        },
        onError: (error) => {
            setFindError(true);
        },
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (chooseChecker) 
            problem.checker = checker ;

        const tagsId = [];
        tags.map(tag => {
            tagsId.push(tag.id)
        })
        
        const updatedProblem = problem;
        updatedProblem.examples = examples;
        updatedProblem.tags = tagsId;
        if (topic !== "") updatedProblem.topic = topic;
        if (input !== "") updatedProblem.input = input;
        if (output !== "") updatedProblem.output = output;
        if (note !== "") updatedProblem.note = note;
        if (tutorial !== "") updatedProblem.tutorial = tutorial;
        if (solutionFile !== "") updatedProblem.solution = solutionFile;
        if (testFile !== "") updatedProblem.test_file = testFile;
        
        mutate(problem);
    }

    const scores = [];
    for (let i = 80; i <= 250; i += 10) {
        scores.push(i);
    }

    const getTests = (data) => {
        let inputs = "";
        let outputs = "";
        data.map(test => {
            inputs += test.input + "\nnext\n";
            outputs += test.output + "\nnext\n";
        })
        setTestFile(inputs + "\nexpected\n" + outputs)
    }

    return (
        <div className='content'>
                <div className='create'>
                    {(problemIsError || isTagsError || isExamplesError) && <Error err={problemError}/>}
                    {(problemIsPending || tagsArePending || examplesArePending) && <div>Loading...</div>}
                    {!problemIsError && !problemIsPending && !isTagsError && !tagsArePending && !isExamplesError && !examplesArePending && problem &&
                        <>
                        <h2>Edit Problem</h2>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className='input-field'>
                                <label htmlFor="title">Title : </label>
                                <input required type="text" id='title' defaultValue={problem.title} onChange={(e) => problem.title = e.target.value} />
                            </div>
                            <div className='input-field'>
                                <label htmlFor="topic">Topic : </label>
                                <RichText value={problem.topic} setRich={setTopic} />

                                {/* <textarea required name="topic" id="topic" cols="100" rows="9" onChange={(e) => setTopic(e.target.value)}></textarea>
                            */}
                            </div>
                            <div className='input-field'>
                                <label htmlFor="input">Input : </label>
                                <RichText value={problem.input} setRich={setInput} />
                                {/*<textarea required name="input" id="input" cols="100" rows="7" onChange={(e) => setInput(e.target.value)}></textarea>*/}
                            </div>
                            <div className='input-field'>
                                <label htmlFor="output">Output : </label>
                                <RichText value={problem.output} setRich={setOutput} />
                                {/*<textarea required name="output" id="output" cols="100" rows="3" onChange={(e) => setOutput(e.target.value)}></textarea>*/}
                            </div>

                            <AddExamples name="Example(s)" value={Examples} getData={setExamples} />

                            <div className='input-field'>
                                <label htmlFor="note">Note : </label>
                                <RichText value={problem.note} setRich={setNote} />
                                {/*<textarea requiredname="note" id="note" cols="100" rows="3" onChange={(e) => setNote(e.target.value)}></textarea>*/}
                            </div>
                            <div className='input-field'>
                                <label htmlFor="score">Score : </label>
                                <select
                                    name="score"
                                    id="score"
                                    defaultValue={problem.score}
                                    onChange={(e) => problem.score = e.target.value}
                                >
                                    {scores.map((item, i) => {
                                        return (
                                            <option value={item} key={i}>{item}</option>
                                        )
                                    })}
                                </select>

                                <label htmlFor="time-limit">Time Limit (Second): </label>
                                <input required type="number" id='time-limit' name='time-limit' min={1} max={20} defaultValue={problem.time_limit} onChange={(e) => problem.time_limit = e.target.value} />

                                <label htmlFor="memory-limit">Memory Limit (Kb): </label>
                                <input required type="text" id='memory-limit' defaultValue={problem.memory_limit} onChange={(e) => problem.memory_limit = e.target.value} />
                            </div>

                            <AddTags value={Tags} getData={setTags} />

                            <div className='input-field'>
                                <label htmlFor="tutorial">Tutorial : </label>
                                <RichText value={problem.tutorial} setRich={setTutorial} />
                                {/*<textarea name="tutorial" id="tutorial" cols="100" rows="7" onChange={(e) => setTutorial(e.target.value)}></textarea>*/}
                            </div>
                            <div className='input-field'>
                                <label htmlFor="solution">Solution : </label>
                                <RichText value={problem.solution} setRich={setSolutionFile} />
                                {/*<textarea required name="solution" id="solution" cols="100" rows="15" onChange={(e) => setSolutionFile(e.target.value)}></textarea>*/}
                            </div>
                            <div className='input-field'>
                                <label id='unused-label'> </label>
                                <div className="radio">
                                    <input type="radio" id='multiple' value='multiple' name='checker' onClick={() => setChooseChecker(true)} />
                                    <label htmlFor="multiple">Multiple Answers </label>
                                </div>
                                <div className="radio">
                                    <input type="radio" defaultChecked id='single' value='single' name='checker' onClick={() => setChooseChecker(false)} />
                                    <label htmlFor="single">Single Answer </label>
                                </div>
                            </div>
                            <div className='input-field' style={chooseChecker ? {} : { display: 'none' }}>
                                <label htmlFor="checker">Checker : </label>
                                <textarea name="checker" id="checker" cols="100" rows="15" onChange={(e) => setChecker(e.target.value)}></textarea>
                            </div>
                            <AddExamples name="Test(s)" value={problem.test_file} getData={getTests} checker={chooseChecker} />

                            <div className='input-field'>
                                <button className='create-btn'>Save</button>
                            </div>
                            {isPending && <div className='loading'>Loading...</div>}
                            {findError && <Error err={error} />}

                        </form>
                        <div className='input-field'>
                            <button className='delete-problem-btn' onClick={deleteProblemMutation}>Delete Problem</button>
                        </div>
                        {deletionIsPending && <div className='loading'>Loading...</div>}
                        {deletionIsError && <Error err={deletionError} />}
                        </>
                    }
                </div>
        </div>
    )
}
