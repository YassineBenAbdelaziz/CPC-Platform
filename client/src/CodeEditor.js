import React from 'react'
import Editor from "@monaco-editor/react"
import { useState } from "react";


export default function CodeEditor() {

    const [lang, setLang] = useState("");
    const [script, setScript] = useState("");
    const type = {
        java: ".java",
        c: ".c",
        "c++": ".cpp",
        python: ".py",
    }

    return (
        <div>

            <select
                className="select-lang"
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

            <div className="submission">
                {/* <input type="file" accept={type[lang]} /><br /> */}
                <div className="code-editor" >
                    <Editor
                        // theme='vs-dark'
                        height={'550px'}
                        width={'100%'}
                        path={'file' + type[lang]}
                        defaultLanguage={lang}
                        value={script}
                        onChange={(e) => setScript(e)}
                    />
                </div>

                <div className="btn">
                    <button className="submit">Submit</button>
                </div>
            </div>

        </div>
    );
}

