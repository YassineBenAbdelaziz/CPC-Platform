/* eslint-disable array-callback-return */
import React from 'react'
import Axios from 'axios'
import { useState } from 'react'
import AddExamples from './AddExamples';
import AddTags from './AddTags';

export default function AddProblem() {

    const url = "http://localhost:5000/";

    const urlAddProblem = url + "problem/create";

    const [title, setTitle] = useState("");
    const [topic, setTopic] = useState("");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [note, setNote] = useState("");
    const [score, setScore] = useState(80);
    const [timeLimit, setTimeLimit] = useState(1);
    const [memoryLimit, setMemoryLimit] = useState("512 Mb");
    const [testFile, setTestFile] = useState("");
    const [tutorial, setTutorial] = useState("");
    const [solutionFile, setSolutionFile] = useState("");
    // eslint-disable-next-line
    const [status, setStatus] = useState("");
    const [examples, setExamples] = useState([]);
    const [tags, setTags] = useState([]);

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
        "solution_file": solutionFile,
        "status": status,
        "id_contest": 0,
        "examples": examples,
        "tags": tagsId
    }

    function handleSubmit(e) {
        // e.preventDefault();
        if (tutorial) setSolutionFile(tutorial + "\n========\n" + solutionFile);
        Axios.post(urlAddProblem, problem).then(res => {
            console.log("Problem Created");
            console.log(res.data);
        }).catch(err => {
            console.log("Problem post error")
            console.log(err)
        })
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
                        <textarea required name="topic" id="topic" cols="100" rows="9" onChange={(e) => setTopic(e.target.value)}></textarea>
                    </div>
                    <div className='input-field'>
                        <label htmlFor="input">Input : </label>
                        <textarea required name="input" id="input" cols="100" rows="7" onChange={(e) => setInput(e.target.value)}></textarea>
                    </div>
                    <div className='input-field'>
                        <label htmlFor="output">Output : </label>
                        <textarea required name="output" id="output" cols="100" rows="3" onChange={(e) => setOutput(e.target.value)}></textarea>
                    </div>

                    <div className='input-field'>
                        <AddExamples getData={getExemples} />
                    </div>

                    <div className='input-field'>
                        <label htmlFor="note">Note : </label>
                        <textarea requiredname="note" id="note" cols="100" rows="3" onChange={(e) => setNote(e.target.value)}></textarea>
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

                        <label htmlFor="time-limit">Time Limit : </label>
                        <input required type="number" id='time-limit' name='time-limit' min={1} max={20} value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />

                        <label htmlFor="memory-limit">Memory Limit : </label>
                        <input required type="text" id='memory-limit' value={memoryLimit} onChange={(e) => setMemoryLimit(e.target.value)} />
                    </div>

                    <AddTags getData={getTags} />

                    <div className='input-field'>
                        <label htmlFor="tutorial">Tutorial : </label>
                        <textarea name="tutorial" id="tutorial" cols="100" rows="7" onChange={(e) => setTutorial(e.target.value)}></textarea>
                    </div>
                    <div className='input-field'>
                        <label htmlFor="solution">Solution : </label>
                        <textarea required name="solution" id="solution" cols="100" rows="20" onChange={(e) => setSolutionFile(e.target.value)}></textarea>
                    </div>
                    <div className='input-field'>
                        <label htmlFor="test">Tests : </label>
                        <textarea required name="test" id="test" cols="100" rows="10" onChange={(e) => setTestFile(e.target.value)}></textarea>
                    </div>

                    <div className='input-field'>
                        <button className='create-btn'>Create</button>
                    </div>

                </form>
            </div>
        </div>
    )
}
