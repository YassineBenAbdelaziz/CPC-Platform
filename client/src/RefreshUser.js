import useAuth from "./hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./services/user";

const RefrechUser = ({ children }) => {

    const { auth, setAuth } = useAuth();
    const {data  , isPending, isError, error} = useQuery({
        queryKey : ['currentUser'],
        queryFn : getCurrentUser,
        retry : 1,
        enabled : !auth?.username,
    });


    if (isPending) {
        return ( <p>Loading...</p> )
    }
    
    if(isError) {
        return (                 
        <>
            {children}
        </>)
    }

    if (!isPending && !isError ) {
        if (data.status === 'OK') {
            setAuth(data.data);
        }
        return (                 
        <>
            {children}
        </>)
    }


   
}

export default RefrechUser;