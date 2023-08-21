import { useState, useEffect } from "react";
import useAuth from "./hooks/useAuth";
import Axios from 'axios'


const RefrechUser = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const { auth, setAuth } = useAuth();

    const url = "http://localhost:5000/";
    Axios.defaults.withCredentials = true;

    useEffect(() => {

        const refreshData = () => {
            Axios.get(url + 'user/current').then(res => {
                if (res.data.status === 'OK') {
                    setAuth(res.data.data);
                    console.log("Refreshing data");
                }
                setIsLoading(false);
            }).catch(err => {
                console.log(err);
                setIsLoading(false);
            });
        };

        !auth?.username ? refreshData() : setIsLoading(false);
    }, [auth?.username, setAuth]);

    return (
        <>
            {isLoading ?
                <p>Loading...</p>
                : <>
                    {children}
                </>
            }
        </>
    )
}

export default RefrechUser;