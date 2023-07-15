import { useParams } from "react-router-dom";
import useFetch from "./useFetch";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import cpyBtn from './imgs/copy-icon.jpg'

const ProblDetails = () => {
    const { id } = useParams();
    const { data: problem, isPending, error } = useFetch('http://localhost:5000/problem/' + id);

    // eslint-disable-next-line
    const { data: examples, isPending1, error1 } = useFetch('http://localhost:5000/example/findByProblem/' + id);

    const [lang, setLang] = useState("");
    const type = {
        java: ".java",
        c: ".c",
        "c++": ".cpp",
        python: ".py",
    }

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
        <div className="problem-details">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {problem && (
                <div className="a">
                    <article style={{ marginTop: '-20px' }}>
                        <div className="problem-head" style={{ textAlign: 'center', marginBottom: '30px' }} >
                            <h2>{problem.title}</h2>
                            <span>Time Limit : {problem.time_limit} Second{(problem.time_limit !== 1) ? ("s") : ("")}</span><br />
                            <span>Memory Limit : {problem.memory_limit}</span>
                        </div>
                        <div>{problem.topic}</div>
                        <div className="inp" style={{ fontWeight: "bold" }}>Input :</div>
                        <div className="inp-text">{problem.input}</div>
                        <div className="outp" style={{ fontWeight: "bold" }}>Output :</div>
                        <div className="outp-text">{problem.output}</div>
                        {examples && exp()}
                        {note()}
                    </article>

                    <div className="sub" style={{ fontWeight: "bold" }}>Submission :</div>
                    <div className="submission">
                        <div className="select-lang">
                            {/* Language:  */}
                            <select
                                name="lang"
                                id="lang"
                                value={lang}
                                onChange={(e) => setLang(e.target.value)}
                            >
                                <option value={""} disabled>Select your language</option>
                                <option value={"c"}>C</option>
                                <option value={"c++"}>C++</option>
                                <option value={"java"}>Java</option>
                                <option value={"python"}>Python</option>
                            </select>
                        </div>
                        <input type="file" accept={type[lang]} />
                        {/* <textarea name="" id="" cols="50" rows="30" style={{ fontFamily: '-moz-initial' }}></textarea> */}
                        <div className="btn">
                            <button>Submit</button>
                        </div>
                    </div>



                </div>
            )}
        </div>
    );
}

export default ProblDetails;