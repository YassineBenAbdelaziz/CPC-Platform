import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {

    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');


    return (
        <div className="form-auth">
            <form >
                <h2>Login</h2>
                {/* <label htmlFor="username">Username : </label> */}
                <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                {/* <label htmlFor="pwd">Password : </label> */} <br />
                <input type="password" id="pwd" placeholder="Password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                <button className="login-button">Login</button>
                <p style={{ marginBottom: '15px' }}>
                    You don't have an account ?
                    <Link to="/signup" style={{ fontWeight: 'bold' }}> Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;