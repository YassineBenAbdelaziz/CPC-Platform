/* eslint-disable array-callback-return */
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addproblem } from '../../services/problems.js';
import AddExamples from './AddExamples.jsx';
import AddTags from './AddTags.jsx';
import RichText from '../utils/RichText.jsx';
import Error from '../Error/Error.jsx';

export default function AddProblem() {


    const [title, setTitle] = useState("");
    const [topic, setTopic] = useState("");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [note, setNote] = useState("");
    const [score, setScore] = useState(80);
    const [timeLimit, setTimeLimit] = useState(1);
    const [memoryLimit, setMemoryLimit] = useState(512000);
    const [testFile, setTestFile] = useState("");
    const [tutorial, setTutorial] = useState("");
    const [solutionFile, setSolutionFile] = useState("");
    const [checker, setChecker] = useState("");
    const [status] = useState("");
    const [examples, setExamples] = useState([]);
    const [tags, setTags] = useState([]);
    const [tests, setTests] = useState([]);

    const [chooseChecker, setChooseChecker] = useState(false);
    const [findError, setFindError] = useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const tagsId = [];
    tags.map(tag => {
        tagsId.push(tag.id)
    })

    const problem = {
        "title": title,
        "topic": topic,
        "input": input,
        "output": output,
        "note": note,
        "score": score,
        "time_limit": timeLimit,
        "memory_limit": memoryLimit,
        "test_file": testFile,
        "solution": solutionFile,
        "tutorial": tutorial,
        "status": status,
        "id_contest": 0,
        "examples": examples,
        "tags": tagsId
    }

    const {data: res, mutate, isPending, isError, error } = useMutation({
        mutationFn : async (body) => {
            return await addproblem(body);
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
        mutate(problem);

    }

    const scores = [];
    for (let i = 80; i <= 250; i += 10) {
        scores.push(i);
    }

    const getExemples = (data) => {
        setExamples(data);
    }

    const getTags = (data) => {
        setTags(data);
    }

    const getTests = (data) => {
        setTests(data);

        let inputs = "";
        let outputs = "";
        tests.map(test => {
            inputs += test.input + "\nnext\n";
            outputs += test.output + "\nnext\n";
        })
        setTestFile(inputs + "\nexpected\n" + outputs)
    }

    return (
        <div className='content'>
                <div className='create'>
                    <h2>Create Problem</h2>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className='input-field'>
                            <label htmlFor="title">Title : </label>
                            <input required type="text" id='title' onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className='input-field'>
                            <label htmlFor="topic">Topic : </label>
                            <RichText setRich={setTopic} />

                            {/* <textarea required name="topic" id="topic" cols="100" rows="9" onChange={(e) => setTopic(e.target.value)}></textarea>
                        */}
                        </div>
                        <div className='input-field'>
                            <label htmlFor="input">Input : </label>
                            <RichText setRich={setInput} />
                            {/*<textarea required name="input" id="input" cols="100" rows="7" onChange={(e) => setInput(e.target.value)}></textarea>*/}
                        </div>
                        <div className='input-field'>
                            <label htmlFor="output">Output : </label>
                            <RichText setRich={setOutput} />
                            {/*<textarea required name="output" id="output" cols="100" rows="3" onChange={(e) => setOutput(e.target.value)}></textarea>*/}
                        </div>

                        <AddExamples name="Example(s)" getData={getExemples} />

                        <div className='input-field'>
                            <label htmlFor="note">Note : </label>
                            <RichText setRich={setNote} />
                            {/*<textarea requiredname="note" id="note" cols="100" rows="3" onChange={(e) => setNote(e.target.value)}></textarea>*/}
                        </div>
                        <div className='input-field'>
                            <label htmlFor="score">Score : </label>
                            <select
                                name="score"
                                id="score"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                            >
                                {scores.map((item, i) => {
                                    return (
                                        <option value={item} key={i}>{item}</option>
                                    )
                                })}
                            </select>

                            <label htmlFor="time-limit">Time Limit (Second): </label>
                            <input required type="number" id='time-limit' name='time-limit' min={1} max={20} value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />

                            <label htmlFor="memory-limit">Memory Limit (Kb): </label>
                            <input required type="text" id='memory-limit' value={memoryLimit} onChange={(e) => setMemoryLimit(e.target.value)} />
                        </div>

                        <AddTags getData={getTags} />

                        <div className='input-field'>
                            <label htmlFor="tutorial">Tutorial : </label>
                            <RichText setRich={setTutorial} />
                            {/*<textarea name="tutorial" id="tutorial" cols="100" rows="7" onChange={(e) => setTutorial(e.target.value)}></textarea>*/}
                        </div>
                        <div className='input-field'>
                            <label htmlFor="solution">Solution : </label>
                            <RichText setRich={setSolutionFile} />
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
                        <AddExamples name="Test(s)" getData={getTests} checker={chooseChecker} />

                        <div className='input-field'>
                            <button className='create-btn'>Create</button>
                        </div>
                        {isPending && <div className='loading'>Loading...</div>}
                        {findError && <Error err={error} />}
                    </form>
                </div>
        </div>
    )
}
