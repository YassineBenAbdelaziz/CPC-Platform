import { useParams } from "react-router-dom";
import useFetch from "./useFetch";
import { useState } from "react";

const ProblDetails = () => {
    const { id } = useParams();
    const { data: problem, isPending, error } = useFetch('http://localhost:8000/problemset/' + id);
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

        if (problem.examples[0].input.length) {
            return (
                <span>
                    <div className="exp" style={{ fontWeight: "bold" }}>Example :</div>
                    {problem.examples && problem.examples.map((example, ind) => (


                        < div className="exp-text" key={ind}>
                            <div className="input">
                                <div className="title-inp">
                                    Input
                                </div>
                                {example.input.map((i, index) => (
                                    <pre key={index}>{i} <br /></pre>
                                ))}
                            </div>
                            <div className="output">
                                <div className="title-outp">
                                    Output
                                </div>
                                {example.output.map((i, index) => (
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
                            <span>Time Limit : {problem.timeLimit} Second</span><br />
                            <span>Memory Limit : {problem.memoryLimit}</span>
                        </div>
                        <div>{problem.topic}</div>
                        <div className="inp" style={{ fontWeight: "bold" }}>Input :</div>
                        <div className="inp-text">{problem.input}</div>
                        <div className="outp" style={{ fontWeight: "bold" }}>Output :</div>
                        <div className="outp-text">{problem.output}</div>
                        {exp()}
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