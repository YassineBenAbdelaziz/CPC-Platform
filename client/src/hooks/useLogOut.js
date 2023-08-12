import Axios from 'axios' ;
import useAuth from './useAuth';

const logout = () => {

    const url = "http://localhost:5000/";
    Axios.defaults.withCredentials = true;

    const {setAuth} = useAuth();

    Axios.get(url + "user/logout")
    .then( (res) => {
        console.log("Logout successful");
        setAuth({});
        
    })
    .catch( err => {
        console.log("There was an error logging out ", err);
    })
}

export default  logout ;