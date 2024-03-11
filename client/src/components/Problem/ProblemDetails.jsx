import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Problem from "./Problem.jsx";
import CodeEditor from "./CodeEditor.jsx";
import Submissions from "../Submissions/Submissions.jsx";
import useAuth from "../../hooks/useAuth.js";
import { DisplayRichText } from "../utils/RichText.jsx";
import { useQuery } from "@tanstack/react-query";
import { getProblem } from "../../services/problems.js";

const ProblDetails = () => {

    const { id } = useParams();
    const { auth } = useAuth()


    const {data: problem, isPending, isError, error } = useQuery({
        queryKey : ['problem', id],
        queryFn :  async () => {
            return getProblem(id);
        }
    })

    const urlAllSubmissions =  'findByProblem/' + id;
    const urlMySubmissions =  'findByProblemAndUser/' + id + "/" + auth?.id;

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
                <div className="prb-code">
                    <div className="prb-details">
                        <div className="prb-navbar" style={{ margin: '-10px 0', padding: '10px', borderBottom: '1px solid #f2f2f2' }}>

                            <button className="prb-link" onClick={() => history(-1)} style={{ marginRight: '10px' }}>&lt;</button>
                            {links.map((link, i) => (
                                <button className={`prb-link${link.active ? '-active' : ''}`} key={i} onClick={link.handle}>{link.name}</button>
                            ))}

                        </div>

                        {showProblem ? <Problem problem={problem} isError={isError} error={error} isPending={isPending} /> : null}

                        {
                            showTutorial ? <div className="tutorial">
                                {
                                    problem.tutorial ?
                                        <DisplayRichText content={problem.tutorial} />
                                        : <div>There Is No Tutorial Available</div>
                                }
                            </div> : null
                        }

                        {
                            showSolution ? <div className="solution">
                                {/*<div className="source_code">
                                    {problem.solution}
                                </div>*/}
                                <DisplayRichText content={problem.solution} />
                            </div> : null
                        }

                        {showMySubmissions && auth?.id ? <Submissions url={urlMySubmissions} /> :
                            showMySubmissions && !auth?.id ? <div>not connected</div> : null}

                        {showAllSubmissions ? <Submissions url={urlAllSubmissions} /> : null}

                    </div>

                    <div className="code">
                        <CodeEditor handleSubmissions={handleMySubmissions} />
                    </div>

                </div>

            </div>

        </div >
    );
}

export default ProblDetails;