import useFetch from "./useFetch";

const SubmissionDetails = ({ submissionId, display }) => {
    const url = 'http://localhost:5000/';

    const { data: submission, isPending, error } = useFetch(url + 'submission/' + submissionId);

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

    const subDetailsStyles = {
        padding: "20px",
        border: "2px solid #b3b3b3",
        borderRadius: "10px",
        margin: "10px 0",
        display: display
    }

    return (
        <div className={`submission-details`} style={subDetailsStyles}>
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {submission && (
                <>
                    <h5>Number of test cases : {submission.count}</h5><br />
                    {submission.testCases && submission.testCases.map((sub, i) => (
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
                    ))}
                </>
            )}
        </div>
    )
}

export default SubmissionDetails;