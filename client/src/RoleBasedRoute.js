import { Navigate, Outlet} from "react-router-dom";
import useAuth from "./hooks/useAuth";
import NotFound from "./NotFound";


const RoleBasedRoute = ({ roles }) => {
    const { auth } = useAuth();
    return roles.includes(auth?.role?.description)  ?
        <Outlet />
        : <NotFound/>;

}

export default RoleBasedRoute;