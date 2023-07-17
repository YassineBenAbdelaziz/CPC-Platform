import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ShowNavBar = ({ children }) => {
    const location = useLocation();

    const [show, setShow] = useState(false);

    useEffect(() => {
        const tab = location.pathname.split('/');
        // console.log(tab);
        if ((tab.length === 3 && tab[1] === 'problemset') || (tab.length === 4 && tab[1] === 'contests')) {
            setShow(false);
        } else {
            setShow(true);
        }
    }, [location]);

    return (
        <div>{show && children}</div>
    );
}

export default ShowNavBar;