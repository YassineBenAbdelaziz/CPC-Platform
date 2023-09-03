import { useParams } from "react-router-dom";
import Submissions from "./Submissions";
import url from './Url';

const UserSubmissions = () => {
    const { id } = useParams();
    const urlMySubmissions = url + 'submission/findByUser/' + id;

    return (
        <div className="content">
            <h2>All Submissions</h2>
            <Submissions url={urlMySubmissions} />
        </div>
    );
}

export default UserSubmissions;