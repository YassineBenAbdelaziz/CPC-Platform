import useAuth from "./hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./services/user";

const RefrechUser = ({ children }) => {

    const { auth, setAuth } = useAuth();
    const {data  , isPending, isError, error} = useQuery({
        queryKey : ['currentUser'],
        queryFn :  async () => {
            const res = await getCurrentUser();
            if (res.status === 'OK') {
                setAuth(res.data);
            }
            return await res ;
        },
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
        return (                 
        <>
            {children}
        </>)
    }


   
}

export default RefrechUser;