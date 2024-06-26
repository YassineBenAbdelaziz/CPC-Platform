import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import eye from "../../assets/eye.png";
import invisible from "../../assets/invisible.png";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../services/user";

const Login = () => {


    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const { setAuth } = useAuth();
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [checked, setChecked] = useState(false);
    const [msg, setMsg] = useState("");

    const [visible, setVisible] = useState(true)

    const {data: res, mutate , isPending } = useMutation({
        mutationFn : async (user) => {
            return await login(user)  ;
        },
        onSuccess : (data) => {
            setAuth(data.data);
            setEmail('');
            setPwd('');
            setMsg('')
            navigate(from, { replace: true });
        },
        onError : (err) => {
            //console.log(err);
            setMsg('Incorrect email or password');
        }
    })


    const handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            "email": email,
            "password": pwd,
            "remember": checked
        };

        mutate(user);

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
                            src={!visible ? eye : invisible}
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
                    <button className="login-button" type="submit" disabled={isPending}>Login</button>
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