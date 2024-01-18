import { Navigate, Outlet} from "react-router-dom";
import useAuth from "./hooks/useAuth";


const PublicRoutes = () => {
    const { auth } = useAuth();
    return auth?.username ?
        <Navigate to='/' /> 
         : <Outlet /> ;
        

}

export default PublicRoutes;