import React, { useState } from 'react'
import useFetch from "./useFetch";
import { Link, useParams } from "react-router-dom";
import SubmissionDetails from './SubmissionDetails';

export default function Submissions() {
    const url = 'http://localhost:5000/';

    const { id } = useParams();

    const { data: submissions, isPending, error } = useFetch(url + 'submission/findByProblemAndUser/' + id + "/23");

    const { data: problem } = useFetch(url + 'problem/' + id);

    const [display, setDisplay] = useState('none')
    const [subId, setSubId] = useState(0)

    const created = (ch) => {
        return ch.replace('T', '\n').substring(0, 19)
    }

    const result = (result) => {
        const color = result === "Accepted" ?
            'rgb(2, 177, 2)' : result.includes("Wrong Answer") ||
                result.includes("Time Limit Exceeded") || result.includes("Runtime Error") || result.includes("Compilation Error") ?
                'red' : ""
        return (
            <div className="result" style={{ color: color, fontWeight: 'bold' }}>{result}</div>
        )
    }

    const memory = (memory) => {
        if (!(memory % 1000)) {
            return (<div className="memory" >{(memory / 1000) + " Mb"}</div>)
        } else {
            return (<div className="memory" >{memory + " Kb"}</div>)
        }
    }

    const handleDisplay = (e, i) => {
        if (i === subId && display === 'block') setDisplay('none')
        else if (i === subId && display === 'none') setDisplay('block')
        else if (i !== subId) {
            setSubId(i)
            setDisplay('block')
        }
    }

    return (
        <div>
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {submissions && (
                <div className='submission-list'>
                    <div className="titles">
                        <h3 className="user">Username</h3>
                        <h3 className="problem-title" >Problem</h3>
                        <h3 className="lang">Lang</h3>
                        <h3 className="time" >Time</h3>
                        <h3 className="memory" >Memory</h3>
                        <h3 className="created" >Created At</h3>
                        <h3 className="result" >Result</h3>
                    </div>
                    {submissions && submissions.sort((a, b) => created(a.createdAt) < created(b.createdAt) ? 1 : -1).map((sub, i) => (
                        <span key={i}>
                            <div className='submission' onClick={(e) => handleDisplay(e, sub.id_submission)}>
                                <Link to={`/profile/`} className="user" >{sub.user}</Link >
                                <Link to={`/problemset/${id}`} className="problem-title" >{problem && problem.title}</Link >
                                <div className="lang">{sub.lang}</div>
                                <div className="time" >{sub.time + " ms"}</div>
                                {memory(sub.memory)}
                                <div className="created" >{created(sub.createdAt)}</div>
                                {result(sub.result)}
                            </div>
                            {subId === sub.id_submission && <SubmissionDetails submissionId={sub.id_submission} display={display} />}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}
