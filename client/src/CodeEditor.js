import React from 'react'
import Editor from "@monaco-editor/react"
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import loading from "./imgs/loading.gif";
import useAuth from './hooks/useAuth';
import { useMutation } from "@tanstack/react-query";
import { createSubmission } from './services/submission';

export default function CodeEditor({ handleSubmissions }) {


    const { auth } = useAuth();

    const problemId = useParams();

    const navigate = useNavigate();

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
    const {data : res, mutate , isPending, isError, } = useMutation({
        mutationFn : async (body) => {
            return await createSubmission(body);
        },

        onSettled : () => {
            unblock()
        }
    })

    function unblock() {
        setSubmittedDisplay('none');
        
        setDisableButton(false);
        //handleSubmissions();
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (!auth?.id) {
            navigate('/login')
        } 

        const submission = {
            "langId": file.id,
            "code": script,
            "problemId": problemId.id,
            "userId": auth?.id
        }
        setSubmittedDisplay('block');
        setDisableButton(true);
        mutate(submission);


            //setTimeout(handleSubmittion, 2000)
        
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

