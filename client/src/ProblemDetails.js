import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Problem from "./Problem";
import CodeEditor from "./CodeEditor";
import Submissions from "./Submissions";
import useFetch from "./useFetch";
import useAuth from "./hooks/useAuth";

const ProblDetails = () => {
    const url = 'http://localhost:5000/';

    const { id } = useParams();
    const { auth } = useAuth()

    const { data: problem, isPending, error } = useFetch(url + 'problem/' + id);

    const urlAllSubmissions = url + 'submission/findByProblem/' + id;
    const urlMySubmissions = url + 'submission/findByProblemAndUser/' + id + "/" + auth?.id;

    const [showProblem, setShowProblem] = useState(true);
    const [showSolution, setShowSolution] = useState(false);
    const [showMySubmissions, setShowMySubmissions] = useState(false);
    const [showAllSubmissions, setShowAllSubmissions] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    const handleProblem = () => {
        setShowProblem(true);
        setShowSolution(false);
        setShowMySubmissions(false);
        setShowAllSubmissions(false);
        setShowTutorial(false);
    }
    const handleSolution = () => {
        setShowSolution(true);
        setShowProblem(false);
        setShowAllSubmissions(false);
        setShowMySubmissions(false);
        setShowTutorial(false);
    }
    const handleMySubmissions = () => {
        setShowMySubmissions(true);
        setShowAllSubmissions(false);
        setShowSolution(false);
        setShowProblem(false);
        setShowTutorial(false);
    }
    const handleAllSubmissions = () => {
        setShowAllSubmissions(true);
        setShowMySubmissions(false);
        setShowSolution(false);
        setShowProblem(false);
        setShowTutorial(false);
    }
    const handleTutorial = () => {
        setShowTutorial(true);
        setShowAllSubmissions(false);
        setShowMySubmissions(false);
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
            name: "My Submissions",
            handle: handleMySubmissions,
            active: showMySubmissions
        },
        {
            name: "All Submissions",
            handle: handleAllSubmissions,
            active: showAllSubmissions
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

                        {showProblem ? <Problem problem={problem} error={error} isPending={isPending} /> : null}

                        {
                            showTutorial ? <div className="tutorial">
                                {
                                    problem.tutorial ? <div className="source_code">
                                        {problem.tutorial}
                                    </div> : <div>There Is No Tutorial Available</div>
                                }
                            </div> : null
                        }

                        {
                            showSolution ? <div className="solution">
                                <div className="source_code">
                                    {problem.solution}
                                </div>
                            </div> : null
                        }

                        {showMySubmissions ? <Submissions url={urlMySubmissions} /> : null}

                        {showAllSubmissions ? <Submissions url={urlAllSubmissions} /> : null}

                    </div>

                    <div className="code" style={{ margin: '5px', width: '70%' }}>
                        <CodeEditor handleSubmissions={handleMySubmissions} />
                    </div>

                </div>

            </div>

        </div >
    );
}

export default ProblDetails;