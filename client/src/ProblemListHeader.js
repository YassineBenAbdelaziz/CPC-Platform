import { Link } from "react-router-dom";
import WithPermissions from "./WithPermissions";

const ProblemListHeader  = ({message}) => {
    return <div className="problemlist-header">
                <h2>{message}</h2>
                {
                <WithPermissions roles={['mod','admin']}>
                    <Link to="/problemset/add-problem" className="add-problem">Add Problem</Link>
                </WithPermissions>
                }
            </div>
};


export default ProblemListHeader ;