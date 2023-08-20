import CopyToClipboard from "react-copy-to-clipboard";
import cpyBtn from './imgs/copy-icon.jpg'
import useFetch from "./useFetch";
import { useParams } from "react-router-dom";
import { DisplayRichText } from "./RichText";

const Problem = ({ problem, isPending, error }) => {

    const url = 'http://localhost:5000/';

    const { id } = useParams();

    const { data: examples, examplesArePending, examplesError } = useFetch(url + 'example/findByProblem/' + id);

    const { data: Tags, tagsArePending, tagsError } = useFetch(url + 'tag/findByProblem/' + id);

    const tags = [];
    Tags && Tags.tags.map((tag) => tags.push(tag.tag));

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
        if (examplesError) return (<div>{examplesError}</div>)
        if (examplesArePending) return (<div>Loading...</div>)
        if (examples && examples.length) {
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

    const tag = () => {
        if (tagsError) return (<div>{tagsError}</div>)
        if (tagsArePending) return (<div>Loading...</div>)
        if (tags && tags.length) {
            return (
                <div className="problem-tags">
                    <div className="tagss" style={{ fontWeight: "bold", marginBottom: '-5px' }}>Tags :</div>
                    <div className="tags">
                        {tags && tags.map((tag, ind) => (
                            <div className="tag" key={ind}>{tag}</div>
                        ))
                        }
                    </div>
                </div >
            )
        }
    }

    const memory = (memory) => {
        if (!(memory % 1000)) {
            return (<span>Memory Limit : {memory / 1000} Mb</span>)
        } else {
            return (<span>Memory Limit : {memory} Kb</span>)
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
                            {memory(problem.memory_limit)}
                        </div>
                    </article>
                    <DisplayRichText content={problem.topic}  />
                    {/*<div>{problem.topic}</div>*/}
                    <div className="inp" style={{ fontWeight: "bold" }}>Input :</div>
                    <div className="inp-text">{problem.input}</div>
                    <div className="outp" style={{ fontWeight: "bold" }}>Output :</div>
                    <div className="outp-text">{problem.output}</div>
                    {exp()}
                    {note()}
                    {tag()}
                </div>
            )}
        </div>
    );
}

export default Problem;