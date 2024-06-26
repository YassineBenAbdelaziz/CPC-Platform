import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ShowNavBar = ({ children }) => {
    const location = useLocation();

    const [show, setShow] = useState(false);

    useEffect(() => {
        const tab = location.pathname.split('/');
        if ((tab.length === 3 && tab[1] === 'problemset' && !isNaN(tab[2])) || (tab.length === 4 && tab[1] === 'contests' && !isNaN(tab[2]))) {
            setShow(false);
        } else {
            setShow(true);
        }
    }, [location]);

    return (
        <>{show && children}</>
    );
}

export default ShowNavBar;