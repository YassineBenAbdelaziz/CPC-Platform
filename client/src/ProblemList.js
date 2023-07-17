import { Link } from "react-router-dom";

const ProblemList = ({ problemset, title, titlePrefixe = false, contestId = 0 }) => {
    const ch = 'ABDEFGHIJKLMNOPQRSTUVWXYZ';

    const fn = (x) => {
        return titlePrefixe ? `/contests/${contestId}/${x}` : `/problemset/${x}`;
    }

    const diff = (score) => {
        if (score <= 100) {
            return (
                <div className="problem-diff" style={{ color: '#02b102' }} >easy</div>
            )
        } else if (score > 100 && score < 130) {
            return (
                <div className="problem-diff" style={{ color: 'orange' }} >miduim</div>
            )
        } else {
            return (
                <div className="problem-diff" style={{ color: 'red' }} >hard</div>
            )
        }
    }


    return (
        <div className="problem-list">
            <h2>{title}</h2>
            <div className="table-titles">
                <h3 className="title">Title</h3>
                <h3 className="status">Status</h3>
                <h3 className="diff">Difficulty</h3>
                <h3 className="score">Score</h3>
            </div>
            {problemset.map((problem, index) => (
                < Link to={fn(problem.id_problem)} key={index}>
                    <div className="problem">
                        <h2>{titlePrefixe && (ch[index] + '.')} {problem.title}</h2>
                        <div className="problem-status">{ }</div>
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