import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Problem from "./Problem";
import CodeEditor from "./CodeEditor";

const ProblDetails = () => {

    const [showProblem, setShowProblem] = useState(true);
    const [showSolution, setShowSolution] = useState(false);
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    const handleProblem = () => {
        setShowProblem(true);
        setShowSolution(false);
        setShowSubmissions(false);
        setShowTutorial(false);
    }
    const handleSolution = () => {
        setShowSolution(true);
        setShowProblem(false);
        setShowSubmissions(false);
        setShowTutorial(false);
    }
    const handleSubmissions = () => {
        setShowSubmissions(true);
        setShowSolution(false);
        setShowProblem(false);
        setShowTutorial(false);
    }
    const handleTutorial = () => {
        setShowTutorial(true);
        setShowSubmissions(false);
        setShowSolution(false);
        setShowProblem(false);
    }

    const links = [
        {
            name: "Problem",
            handle: handleProblem,
            active: showProblem
        },
        {
            name: "Tutorial",
            handle: handleTutorial,
            active: showTutorial
        },
        {
            name: "Solution",
            handle: handleSolution,
            active: showSolution
        },
        {
            name: "Submissions",
            handle: handleSubmissions,
            active: showSubmissions
        },
    ];

    const history = useNavigate();

    return (
        <div className="problem-details">
            <div className="a">
                <div className="prb-code" style={{ margin: '-20px 0' }} >
                    <div className="prb-details" style={{ margin: '5px', width: '70%' }}>
                        <div className="prb-navbar" style={{ margin: '-10px 0', padding: '10px', borderBottom: '1px solid #f2f2f2' }}>

                            <button className="prb-link" onClick={() => history(-1)} style={{ marginRight: '10px' }}>&lt;</button>
                            {links.map((link, i) => (
                                <button className={`prb-link${link.active ? '-active' : ''}`} key={i} onClick={link.handle}>{link.name}</button>
                            ))}

                        </div>

                        {
                            showProblem ?
                                <Problem /> :
                                null
                        }

                        {
                            showTutorial ?
                                <div className="tutorial">
                                    Tutorial
                                </div> :
                                null
                        }

                        {
                            showSolution ?
                                <div className="solution">
                                    Solution
                                </div> :
                                null
                        }

                        {
                            showSubmissions ?
                                <div className="submissions">
                                    Submissions
                                </div> :
                                null
                        }

                    </div>
                    <div className="code" style={{ margin: '5px', width: '70%' }}>
                        <CodeEditor />
                    </div>
                </div>

            </div>

        </div >
    );
}

export default ProblDetails;