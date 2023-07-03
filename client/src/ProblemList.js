import { Link } from "react-router-dom";

const ProblemList = ({ problemset, title, titlePrefixe = false }) => {
    const ch = 'ABDEFGHIJKLMNOPQRSTUVWXYZ';
    return (
        <div className="problem-list">
            <h2>{title}</h2>
            {problemset.sort((a, b) => a.score > b.score ? 1 : -1).map((problem, index) => (
                <Link to={`/problemset/${problem.id}`} key={index}>
                    <div className="problem">
                        <h2>{titlePrefixe && (ch[index] + '.')} {problem.title}</h2>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ProblemList;