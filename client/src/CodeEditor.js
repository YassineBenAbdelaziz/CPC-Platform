import React from "react";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { createSubmission } from "./services/submission";
import loading from "./imgs/loading.gif";
import useAuth from "./hooks/useAuth";
import Error from "./Error";

export default function CodeEditor({ handleSubmissions }) {
  const { auth } = useAuth();

  const problemId = useParams();

  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [lang, setLang] = useState("");
  const [script, setScript] = useState("");
  // const [disableButton, setDisableButton] = useState(false);

  const files = {
    "": {
      name: "file.text",
      lang: "",
      value: `Choose your language`,
      id: "",
    },
    java: {
      name: "file.java",
      lang: "Java",
      value: `//Here you put your code`,
      id: 62,
    },
    cpp: {
      name: "file.cpp",
      lang: "C++",
      value: `#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve(){\n    //Here you put your code\n}\nint main(){\n    solve();\n    return 0;\n}`,
      id: 54,
    },
    c: {
      name: "file.c",
      lang: "C",
      value: `#include <iostream>\n#include<conio.h>\n\nvoid solve(){\n    //Here you put your code\n}\n\nvoid main(){\n    solve();\n}`,
      id: 50,
    },
    python: {
      name: "file.py",
      lang: "Python",
      value: `#Here you put your code`,
      id: 71,
    },
  };

  const options = {
    minimap: { enabled: false },
  };

  const file = files[lang];
  const {
    data: res,
    mutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (body) => {
      return await createSubmission(body);
    },
    onSuccess: () => {
      setTimeout(unblock, 2000);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function unblock() {
    // setDisableButton(false);
    handleSubmissions();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!auth?.id) {
      navigate("/login");
    }

    const submission = {
      langId: file.id,
      code: script,
      problemId: problemId.id,
      userId: auth?.id,
    };
    // setDisableButton(true);
    mutate(submission);
  }

  return (
    <form className="submission-form" onSubmit={(e) => handleSubmit(e)}>
      <select
        className="select-lang"
        name="lang"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        required
      >
        <option value={""} disabled>
          Select your language
        </option>
        <option value={"c"}>C</option>
        <option value={"cpp"}>C++</option>
        <option value={"java"}>Java</option>
        <option value={"python"}>Python</option>
      </select>

      <div className="code-editor">
        <Editor
          theme="vs-dark"
          height={"100%"}
          width={"100%"}
          path={lang}
          defaultLanguage={lang}
          defaultValue={file.value}
          value={script}
          onChange={(e) => setScript(e)}
          options={options}
        />
      </div>
      <div className="submit-btn">
        <button className="submit" disabled={isPending}>
          Submit
        </button>
        <img
          src={loading}
          alt=""
          style={{
            width: "30px",
            display: isPending ? "block" : "none",
            marginLeft: "10px",
          }}
        />
        {isError && <Error err={error} />}
      </div>
    </form>
  );
}
