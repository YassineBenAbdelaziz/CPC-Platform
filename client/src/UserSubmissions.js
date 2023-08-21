import { useParams } from "react-router-dom";
import Submissions from "./Submissions";

const UserSubmissions = () => {
    const { id } = useParams();
    const url = "http://localhost:5000/";
    const urlMySubmissions = url + 'submission/findByUser/' + id;

    return (
        <div className="content">
            <h2>All Submissions</h2>
            <Submissions url={urlMySubmissions} />
        </div>
    );
}

export default UserSubmissions;