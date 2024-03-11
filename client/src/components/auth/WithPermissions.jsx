
import useAuth from "../../hooks/useAuth";


const WithPermissions = ({roles, children}) => {
    const { auth } = useAuth();
    return <>
        {
        roles.includes(auth?.role?.description) ? children : <></>
        }
    </>

}

export default WithPermissions;