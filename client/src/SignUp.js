import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from 'axios'

const SignUp = () => {

    const url = "http://localhost:5000/";

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePwd, setRePwd] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [usernameMsg, setUsernameMsg] = useState('');
    const [rePwdMsg, setRePwdMsg] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        let test = true;
        const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/i;
        if (!regExp.test(password)) {
            test = false;
            setPwdMsg('Minimum eight and maximum 10 characters,\nat least one uppercase letter,\none lowercase letter, one number\nand one special character.');
        } else {
            setPwdMsg('');
        }
        if (rePwd !== password) {
            test = false;
            setRePwdMsg('Passwords are not the same.');
        } else {
            setRePwdMsg('');
        }

        const user = {
            "fname": fname,
            "lname": lname,
            "username": username,
            "email": email,
            "password": password
        };

        if (test) {
            Axios.post(url + "user/register", user)
                .then(res => {
                    console.log("User Created");
                    console.log(res.data);
                    navigate('/login');
                }).catch(err => {
                    console.log(err)
                    if (err.response.data.error.errors[0].message === "username must be unique") {
                        setUsernameMsg('Username already exists.')
                        setEmailMsg('');
                    } else if (err.response.data.error.errors[0].message === "email must be unique") {
                        setEmailMsg('Email already exists.');
                        setUsernameMsg('')
                    }
                    console.log("User creation error")
                })
        }

    }

    return (
        <div className="content">
            <div className="form-auth">
                <form onSubmit={handleSubmit} name="signup">
                    <h2>Sign Up</h2>
                    <label htmlFor="fname">First Name : </label>
                    <input type="text" required id="fname" value={fname} onChange={(e) => setFname(e.target.value)} />
                    <label htmlFor="lname">Last Name : </label>
                    <input type="text" required id="lname" value={lname} onChange={(e) => setLname(e.target.value)} />
                    <label htmlFor="username">Username : </label>
                    <input type="text" required id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <p style={{
                        color: 'red',
                        whiteSpace: 'pre-line',
                        fontSize: '15px'
                    }}>{usernameMsg}</p>
                    <label htmlFor="email">Email : </label>
                    <input type="email" required id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <p style={{
                        color: 'red',
                        whiteSpace: 'pre-line',
                        fontSize: '15px'
                    }}>{emailMsg}</p>
                    <label htmlFor="pwd">Password : </label>
                    <input type="password" required id="pwd" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p style={{
                        color: 'red',
                        whiteSpace: 'pre-line',
                        fontSize: '15px'
                    }}>{pwdMsg}</p>
                    <label htmlFor="re-pwd">Repeat Password : </label>
                    <input type="password" required id="re-pwd" value={rePwd} onChange={(e) => setRePwd(e.target.value)} />
                    <p style={{
                        color: 'red',
                        whiteSpace: 'pre-line',
                        fontSize: '15px'
                    }}>{rePwdMsg}</p>
                    <button>Sign Up</button>
                    <p style={{ marginBottom: '15px' }}>
                        You already have an account ?
                        <Link to="/login" style={{ fontWeight: 'bold' }}> Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;