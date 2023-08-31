import React, { useState } from 'react'
import { Link } from "react-router-dom";
import SubmissionDetails from './SubmissionDetails';

const SubmissionList = ({ submissions }) => {
    const [display, setDisplay] = useState('none')
    const [subId, setSubId] = useState(0)

    const created = (ch) => {
        return ch.replace('T', '\n').substring(0, 19)
    }

    const result = (result) => {
        const color = result === "Accepted" ?
            'rgb(2, 177, 2)' : result.includes("Wrong Answer") ||
                result === "Time Limit Exceeded" || result === "Runtime Error" || result === "Compilation Error" || result === "Memory Limit Exceeded" ?
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
            {!submissions && <div>Loading...</div>}
            {submissions && submissions.length === 0 && <h3>No Submissions Available</h3>}
            {submissions && submissions.length !== 0 && (
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
                    {submissions && submissions.map((sub, i) => (
                        <span key={i}>
                            <div className='submission' onClick={(e) => handleDisplay(e, sub.id_submission)}>
                                <Link to={`/profile/${sub.user}`} className="user" >{sub.user}</Link >
                                <Link to={`/problemset/${sub.problemIdProblem}`} className="problem-title" >{sub.problem}</Link >
                                <div className="lang">{sub.lang}</div>
                                <div className="time" >{sub.time + " ms"}</div>
                                {memory(sub.memory)}
                                <div className="created" >{created(sub.createdAt)}</div>
                                {result(sub.result)}
                            </div>
                            {subId === sub.id_submission && <SubmissionDetails sub={sub} display={display} />}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SubmissionList;