import React from 'react'
import Editor from "@monaco-editor/react"
import { useState } from "react";


export default function CodeEditor() {

    const [lang, setLang] = useState("");
    const [script, setScript] = useState("");
    const files = {
        "": {
            name: "file.text",
            lang: lang,
            value: `Choose your language`
        },
        "java": {
            name: "file.java",
            lang: lang,
            value: `//Here you put your code`
        },
        "cpp": {
            name: "file.cpp",
            lang: lang,
            value: `#include <bits/stdc++.h>
using namespace std;

void solve(){
    //Here you put your code
}

int main(){
    solve();
    return 0;
}`
        },
        "c": {
            name: "file.c",
            lang: lang,
            value: `#include <iostream>
#include<conio.h>

void solve(){
    //Here you put your code
}

void main(){
    solve();
}`
        },
        "python": {
            name: "file.py",
            lang: lang,
            value: `#Here you put your code`
        }
    }

    const file = files[lang];

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
                <option value={"cpp"}>C++</option>
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
                        path={lang}
                        defaultLanguage={lang}
                        value={file.value}
                        onChange={(e) => setScript(e)}
                    />
                    {console.log(script)}
                </div>
                <div className="btn">
                    <button className="submit">Submit</button>
                </div>
            </div>

        </div>
    );
}

