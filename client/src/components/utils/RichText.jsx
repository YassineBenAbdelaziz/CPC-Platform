import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

import katex from "katex";
import "katex/dist/katex.min.css";
window.katex = katex;

const modules = {
  syntax: {
    highlight: text => hljs.highlightAuto(text).value
  },
  toolbar: [
    [{ 'header': [1, 2, false] }],  [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    ['code-block','formula'], 
    ['clean']
  ],
};

const formats = [
  'header', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image',
  'code-block','formula'
];


export default function RichText({value, setRich}) {

  return <div className="text-editor">
    <ReactQuill theme="snow"
      defaultValue={value || ""}
      onChange={setRich} 
      modules={modules}
      formats={formats}>
    </ReactQuill>    
  </div>
}


export function DisplayRichText({content}) {
  return <ReactQuill
  value={content}
  readOnly={true}
  theme={"bubble"}
/>
}