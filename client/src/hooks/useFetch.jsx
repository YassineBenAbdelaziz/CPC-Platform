import { useEffect, useState } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);
    
    useEffect(() => {
        const abortCont = new AbortController();
        const fetchData = async () => {
            try {
                
                const response = await fetch(url, { 
                signal: abortCont.signal,
                credentials: "include", }) ;

                setStatus(response.status);
                if ( response.ok) {
                    const data = await  response.json();
                    setData(data);
                    setIsPending(false);
                    setError(null);
                }

            } catch (err) {
                
                if (err.name !== 'AbortError') {
                    console.log("error ? nah");
                    console.log("Error Incoming ! ");
                    console.log(err);
                    console.log(err.status);
                    setError(err.message);
                    setIsPending(false);
                }
            }
        }
        fetchData();

        return () => abortCont.abort();
    }, [url])

    return { data, isPending, error, status}
}

export default useFetch;