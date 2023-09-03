import { useState } from "react";
import { Link } from "react-router-dom";
import Axios from 'axios'
import useAuth from "./hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import eye from "./imgs/eye.png";
import invisible from "./imgs/invisible.png";
import url from './Url';

const Login = () => {

    Axios.defaults.withCredentials = true;

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const { setAuth } = useAuth();
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [checked, setChecked] = useState(false);
    const [msg, setMsg] = useState("");

    const [visible, setVisible] = useState(true)

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            "email": email,
            "password": pwd,
            "remember": checked
        };


        Axios.post(url + "user/login", user,)
            .then((res) => {
                console.log(res.data.data);
                setAuth(res.data.data);
                setEmail('');
                setPwd('');
                setMsg('')
                navigate(from, { replace: true });

            })
            .catch(err => {
                setMsg('Incorrect email or password')
                if (err.response) {
                    console.log(err.response.data)
                }

                if (err.request) {
                    console.log(err.request)
                }
            })

    }

    const handleIconClick = () => {
        visible ? setVisible(false) : setVisible(true)
    }


    return (
        <div className="content">
            <div className="form-auth">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    {/* <label htmlFor="username">Username : </label> */}
                    <input type="text" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {/* <label htmlFor="pwd">Password : </label> */} <br />
                    <div className="password-field" >
                        <input type={visible ? "password" : "text"} id="pwd" placeholder="Password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                        <img
                            className="password-icon"
                            src={visible ? eye : invisible}
                            alt=""
                            onClick={handleIconClick}
                        />
                    </div>
                    <p style={{
                        color: 'red',
                        whiteSpace: 'pre-line',
                        fontSize: '15px'
                    }}>{msg}</p>
                    <div className="form-checkbox-container">
                        <input type="checkbox" name="remember" id="remember" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                        <label htmlFor="remember">Keep me logged in</label>
                    </div>
                    <button className="login-button" type="submit" >Login</button>
                    <p style={{ marginBottom: '15px' }}>
                        You don't have an account ?
                        <Link to="/signup" style={{ fontWeight: 'bold' }}> Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;