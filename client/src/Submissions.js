import React from 'react'
import useFetch from "./useFetch";
import { Link, useParams } from "react-router-dom";

export default function Submissions() {
    const url = 'http://localhost:5000/';

    const { id } = useParams();

    const { data: submissions, isPending, error } = useFetch(url + 'submission/findByProblem/' + id);

    const { data: problem } = useFetch(url + 'problem/' + id);

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

    return (
        <div>
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {submissions && (
                <div className='submission-list'>
                    <div className="titles">
                        <h3 className="problem-title" >Problem</h3>
                        <h3 className="lang">Language</h3>
                        <h3 className="time" >Time</h3>
                        <h3 className="memory" >Memory</h3>
                        <h3 className="created" >Created At</h3>
                        <h3 className="result" >Result</h3>
                    </div>
                    {submissions && submissions.sort((a, b) => created(a.createdAt) < created(b.createdAt) ? 1 : -1).map((sub, i) => (
                        <div className='submission' key={i}>
                            <Link to={`/problemset/${id}`} className="problem-title" >{problem && problem.title}</Link >
                            <div className="lang">{sub.lang}</div>
                            <div className="time" >{sub.time + " ms"}</div>
                            <div className="memory" >{sub.memory + " Kb"}</div>
                            <div className="created" >{created(sub.createdAt)}</div>
                            {result(sub.result)}

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
