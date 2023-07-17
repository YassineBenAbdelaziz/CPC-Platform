import CopyToClipboard from "react-copy-to-clipboard";
import cpyBtn from './imgs/copy-icon.jpg'
import useFetch from "./useFetch";
import { useParams } from "react-router-dom";

const Problem = () => {

    const { id } = useParams();

    // eslint-disable-next-line
    const { data: problem, isPending, error } = useFetch('http://localhost:5000/problem/' + id);

    // eslint-disable-next-line
    const { data: examples, isPending1, error1 } = useFetch('http://localhost:5000/example/findByProblem/' + id);

    const note = () => {
        if (problem.note !== '') {
            return (
                <span>
                    <div className="note" style={{ fontWeight: "bold" }}>Note :</div>
                    <div className="note-text">{problem.note}</div>
                </span>
            )
        }
    }

    const exp = () => {
        if (examples.length) {
            return (
                <span>
                    <div className="exp" style={{ fontWeight: "bold" }}>Example :</div>
                    {examples && examples.map((example, ind) => (
                        < div className="exp-text" key={ind}>
                            <div className="input">
                                <CopyToClipboard text={example.input}>
                                    <div className="title-inp">
                                        Input
                                        <img className="copy-btn" src={cpyBtn} alt="copy" />
                                    </div>
                                </CopyToClipboard>
                                {example.input.split('\n').map((i, index) => (
                                    <pre key={index}>{i} <br /></pre>
                                ))}
                            </div>
                            <div className="output">
                                <div className="title-outp">
                                    Output
                                </div>
                                {example.output.split('\n').map((i, index) => (
                                    <pre key={index}>{i} <br /></pre>
                                ))}
                            </div>
                        </div>
                    ))
                    }
                </span >
            )
        }
    }

    return (
        <div>
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {problem && (
                <div className="prb">
                    <article>
                        <div className="problem-head" style={{ textAlign: 'center', margin: '30px 0' }} >
                            <h2>{problem.title}</h2>
                            <span>Time Limit : {problem.time_limit} Second{(problem.time_limit !== 1) ? ("s") : ("")}</span><br />
                            <span>Memory Limit : {problem.memory_limit}</span>
                        </div>
                    </article>
                    <div>{problem.topic}</div>
                    <div className="inp" style={{ fontWeight: "bold" }}>Input :</div>
                    <div className="inp-text">{problem.input}</div>
                    <div className="outp" style={{ fontWeight: "bold" }}>Output :</div>
                    <div className="outp-text">{problem.output}</div>
                    {examples && exp()}
                    {note()}
                </div>
            )}
        </div>
    );
}

export default Problem;