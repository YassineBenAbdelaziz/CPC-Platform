import { useQuery } from "@tanstack/react-query";
import {  getSubmission } from "../../services/submission";
import Error from "../Error/Error";

const SubmissionDetails = ({ sub, display }) => {

    
    const { data: submission, isPending, isError, error } = useQuery({
        queryKey : ["submissionsDetails",sub.id_submission],
        queryFn : async () => {
            return getSubmission(sub.id_submission);
        }
    })

    const result = (result) => {
        const color = result === "Accepted" ?
            'rgb(2, 177, 2)' : result.includes("Wrong Answer") ||
                result.includes("Time Limit Exceeded") || result.includes("Runtime Error") || result.includes("Compilation Error") ?
                'red' : ""
        return (
            <h5 style={{ color: color }}> {result}</h5>
        )
    }

    const memory = (memory) => {
        if (!(memory % 1000)) {
            return (<div style={{ marginLeft: '20px' }}>Memory : {memory / 1000} Mb</div>)
        } else {
            return (<div style={{ marginLeft: '20px' }}>Memory : {memory} Kb</div>)
        }
    }

    const created = (ch) => {
        return ch.replace('T', '\n').substring(0, 19)
    }

    const subDetailsStyles = {
        padding: "20px",
        border: "2px solid #b3b3b3",
        borderRadius: "10px",
        margin: "10px 0",
        display: display
    }

    return (
        <div className={`submission-details`} style={subDetailsStyles}>
            {isError && <Error err={error} />}
            {isPending && <div>Loading...</div>}
            {!isError && !isPending && submission && (
                <>
                    <div className="mobile">
                        <div> <span style={{ fontWeight: '700', fontSize: '15px' }}>Language :</span> {sub.lang}</div>
                        <div> <span style={{ fontWeight: '700', fontSize: '15px' }}>Time :</span> {sub.time} ms</div>
                        <div> <span style={{ fontWeight: '700', fontSize: '15px' }}>Memory :</span> {!sub.memory % 1000 ? (sub.memory / 1000) + ' Mb' : sub.memory + ' Kb'}</div>
                        <div> <span style={{ fontWeight: '700', fontSize: '15px' }}>Created At :</span> {created(sub.createdAt)}</div>
                    </div>
                    <h5>Code :</h5>
                    <div className='source_code' style={{ margin: '10px 0', justifyContent: 'unset' }}>
                        <code style={{ fontFamily: "courier, monospace" }} >{submission.code}</code>
                    </div><br />
                    <h5>Number of test cases : {submission.count}</h5><br />
                    {
                        submission.testCases && submission.testCases.map((sub, i) => (
                            <div key={i} className="testcase" style={{ marginBottom: '20px', textAlign: 'initial' }}>
                                <h5>Test Case : {i + 1}</h5>
                                {result(sub.result)}
                                <div style={{ display: 'flex', justifyContent: 'initial', padding: '0' }}>
                                    <div >Time : {sub.time} ms</div>
                                    {memory(sub.memory)}
                                </div>
                                <div style={{ padding: '0' }}>
                                    <div >Input :</div>
                                    <div className="input">{sub.stdin}</div>
                                    <div >Output :</div>
                                    <div className="output">{sub.stdout}</div>
                                    <div>Expected Output :</div>
                                    <div className="expected">{sub.expected_output}</div>

                                </div>

                            </div>
                        ))
                    }
                </>
            )}
        </div >
    )
}

export default SubmissionDetails;