import { Link } from "react-router-dom";
import GetProblemStatus from "./GetProblemStatus.jsx";
import useAuth from "../../hooks/useAuth.js"


const ProblemList = ({
    problemset,
    title,
    inContests = false,
    inProblemset = false,
    contestId = 0,
    handleTitleSort = function () { },
    handleScoreSort = function () { }
}) => {
    const ch = 'ABDEFGHIJKLMNOPQRSTUVWXYZ';

    const fn = (x) => {
        return inContests ? `/contests/${contestId}/${x}` : `/problemset/${x}`;
    }

    const { auth } = useAuth();

    const diff = (score) => {
        if (score <= 100) {
            return (
                <div className="problem-diff" style={{ color: '#02b102' }} >Easy</div>
            )
        } else if (score > 100 && score < 130) {
            return (
                <div className="problem-diff" style={{ color: 'orange' }} >Medium</div>
            )
        } else {
            return (
                <div className="problem-diff" style={{ color: 'red' }} >Hard</div>
            )
        }
    }

    return (
        <div className="problem-list">

            <div className="table-titles">
                <h3 className="title" onClick={() => handleTitleSort()}>Title</h3>
                {auth?.id ? <h3 className="status">Status</h3> : <h3 className="status"> </h3>}
                <h3 className="diff" onClick={() => handleScoreSort()}>Difficulty</h3>
                <h3 className="score" onClick={() => handleScoreSort()}>Score</h3>
            </div>
            {problemset.map((problem, index) => (
                < Link to={fn(problem.id_problem)} key={index}>
                    <div className="problem">
                        <h2>{inContests && (ch[index] + '.')} {problem.title}</h2>
                        {auth?.id ? <GetProblemStatus status={problem?.status} /> : <div className="problem-status"></div>}
                        {diff(problem.score)}
                        <div className="problem-score">{problem.score}</div>
                    </div>
                </Link>
            ))
            }
        </div >
    );
}

export default ProblemList;