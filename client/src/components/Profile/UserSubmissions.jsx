import { useParams } from "react-router-dom";
import Submissions from "../Submissions/Submissions.jsx";

const UserSubmissions = () => {
    const { id } = useParams();
    const urlMySubmissions = 'findByUser/' + id;

    return (
        <div className="content">
            <h2>All Submissions</h2>
            <Submissions url={urlMySubmissions} />
        </div>
    );
}

export default UserSubmissions;