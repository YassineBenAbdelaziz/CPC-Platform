import Axios from 'axios' ;
import useAuth from './useAuth';

const logout = () => {

    const url = "http://localhost:5000/";
    Axios.defaults.withCredentials = true;

    const {setAuth} = useAuth();

    Axios.get(url + "user/logout")
    .then( (res) => {
        setAuth({});
        
    })
    .catch( err => {
        console.log("There was an error logging out ");
    })
}

export default  logout ;