import { Link } from "react-router-dom";

const ProblemList = ({ problemset, title, titlePrefixe = false, contestId = 0 }) => {
    const ch = 'ABDEFGHIJKLMNOPQRSTUVWXYZ';

    const fn = (x) => {
        return titlePrefixe ? `/contests/${contestId}/${x}` : `/problemset/${x}`;
    }

    const diff = (score) => {
        if (score <= 100) {
            return "easy"
        } else if (score > 100 && score < 120) {
            return "meduim"
        } else {
            return "hard"
        }
    }

    return (
        <div className="problem-list">
            <h2>{title}</h2>
            <div className="table-titles">
                <h3 className="title">Title</h3>
                <h3 className="diff">Difficulty</h3>
                <h3 className="score">Score</h3>
            </div>
            {problemset.map((problem, index) => (
                < Link to={fn(problem.id_problem)} key={index}>
                    <div className="problem">
                        <h2>{titlePrefixe && (ch[index] + '.')} {problem.title}</h2>
                        <div className="problem-diff" style={{ color: 'black' }}>{diff(problem.score)}</div>
                        <div className="problem-score">{problem.score}</div>
                    </div>
                </Link>
            ))
            }
        </div >
    );
}

export default ProblemList;