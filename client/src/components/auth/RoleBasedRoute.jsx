import { Navigate, Outlet} from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import NotFound from "../NotFound/NotFound.jsx";


const RoleBasedRoute = ({ roles }) => {
    const { auth } = useAuth();
    return roles.includes(auth?.role?.description)  ?
        <Outlet />
        : <NotFound/>;

}

export default RoleBasedRoute;