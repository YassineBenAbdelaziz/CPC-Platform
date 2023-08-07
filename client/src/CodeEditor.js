import React from 'react'
import Editor from "@monaco-editor/react"
import { useState } from "react";
import Axios from 'axios';
import { useParams } from "react-router-dom";
import loading from "./imgs/loading.gif";

export default function CodeEditor({ handleSubmissions }) {

    const url = "http://localhost:5000/";

    const urlAddSubmission = url + "submission/";

    const problemId = useParams();

    const [lang, setLang] = useState("");
    const [script, setScript] = useState("");
    const [submittedDisplay, setSubmittedDisplay] = useState("none");
    const [disableButton, setDisableButton] = useState(false);

    const files = {
        "": {
            name: "file.text",
            lang: "",
            value: `Choose your language`,
            id: ""
        },
        "java": {
            name: "file.java",
            lang: "Java",
            value: `//Here you put your code`,
            id: 62
        },
        "cpp": {
            name: "file.cpp",
            lang: "C++",
            value: `#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve(){\n    //Here you put your code\n}\nint main(){\n    solve();\n    return 0;\n}`,
            id: 54
        },
        "c": {
            name: "file.c",
            lang: "C",
            value: `#include <iostream>\n#include<conio.h>\n\nvoid solve(){\n    //Here you put your code\n}\n\nvoid main(){\n    solve();\n}`,
            id: 50
        },
        "python": {
            name: "file.py",
            lang: "Python",
            value: `#Here you put your code`,
            id: 71
        }
    }

    const file = files[lang];

    function handleSubmittion() {
        setSubmittedDisplay('none')
        handleSubmissions()
        setDisableButton(false)
    }

    function handleSubmit(e) {
        e.preventDefault()
        const submission = {
            "langId": file.id,
            "code": script,
            "problemId": problemId.id,
            "userId": 23
        }
        Axios.post(urlAddSubmission, submission).then(res => {
            console.log("Submission Created");
            console.log(res.data);
        }).catch(err => {
            console.log("Submission Post Error")
            console.log(err)
        })

        setSubmittedDisplay('block')
        setDisableButton(true)
        setTimeout(handleSubmittion, 2000)
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <select
                className="select-lang"
                name="lang"
                value={lang}
                onChange={(e) => { setLang(e.target.value); setSubmittedDisplay('none') }}
                required
            >
                <option value={""} disabled>Select your language</option>
                <option value={"c"}>C</option>
                <option value={"cpp"}>C++</option>
                <option value={"java"}>Java</option>
                <option value={"python"}>Python</option>
            </select>

            <div className="submission">
                <div className="code-editor" >
                    <Editor
                        // theme='vs-dark'
                        height={'550px'}
                        width={'100%'}
                        path={lang}
                        defaultLanguage={lang}
                        defaultValue={file.value}
                        value={script}
                        onChange={(e) => setScript(e)}
                    />
                </div>
                <div className="btn">
                    <button className="submit" disabled={disableButton}>Submit</button>
                    <img src={loading} alt="" style={{ width: '30px', display: submittedDisplay, marginLeft: '10px' }} />
                </div>
            </div>
        </form>
    );
}

