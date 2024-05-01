import React from 'react'
import { useState } from "react";
import Editor from "@monaco-editor/react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { createSubmission } from '../../services/submission.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import loading from "../../assets/loading.gif";
import useAuth from '../../hooks/useAuth.js';
import Error from '../Error/Error.jsx'
import styles from './codeEditor.module.css';

export default function CodeEditor({ handleSubmissions }) {

    const { auth } = useAuth();
    const queryClient = useQueryClient();

    const problemId = useParams();

    const navigate = useNavigate();

    const [lang, setLang] = useState("");
    const [script, setScript] = useState("");
    // const [disableButton, setDisableButton] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const options = {
        minimap: { enabled: false }
    }

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
    const { data: res, mutate, isPending, isError, error } = useMutation({
        mutationFn: async (body) => {
            return await createSubmission(body);
        },
        onSuccess: () => {
            setTimeout(unblock, 2000);
            queryClient.invalidateQueries(["submissionsPage"]);
        },
        onError: (error) => {
            //console.log(error);
        },

    });

    function unblock() {
        // setDisableButton(false);
        handleSubmissions();
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
        // setDisableButton(true);
        mutate(submission);
    }


    return (
        <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
            <div className={styles.formHeader} >
                <select
                    className="select-lang"
                    name="lang"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    required
                >
                    <option value={""} disabled>Select your language</option>
                    <option value={"c"}>C</option>
                    <option value={"cpp"}>C++</option>
                    <option value={"java"}>Java</option>
                    <option value={"python"}>Python</option>
                </select>
                <div>
                    <div className={styles.toggleThemeContainer}>
                        <label htmlFor="theme-toggle">
                            <input
                                type="checkbox"
                                id="theme-toggle"
                                checked={isDarkMode}
                                onChange={toggleTheme}
                            />
                            <span className={`${styles.slider} ${styles.round}`}>
                                <div className={styles.iconContainer}>
                                    <FontAwesomeIcon icon={faSun} className={` ${styles.icon} ${styles.faSun} ${!isDarkMode ? styles.dVisible : styles.dNone}`} />
                                    <FontAwesomeIcon icon={faMoon} className={` ${styles.icon} ${styles.faMoon} ${isDarkMode ? styles.dVisible : styles.dNone}`} />
                                </div>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
                <div className="code-editor" >
                    <Editor
                        theme={isDarkMode ? 'vs-dark' : 'vs'}
                        width={'100%'}
                        path={lang}
                        defaultLanguage={lang}
                        defaultValue={file.value}
                        value={script}
                        options={options}
                        onChange={(e) => setScript(e)}
                    />
            </div>
            <div className="submit-btn">
                <button className="submit" disabled={isPending}>Submit</button>
                <img src={loading} alt="" style={{ width: '30px', display: isPending ? 'block' : 'none', marginLeft: '10px' }} />
                {isError && <Error err={error} />}
            </div>
        </form>
    );
}
