import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import eye from "../../assets/eye.png";
import invisible from "../../assets/invisible.png";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../services/user";

const SignUp = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePwd, setRePwd] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [usernameMsg, setUsernameMsg] = useState('');
    const [rePwdMsg, setRePwdMsg] = useState('');
    const [usernameBorder, setUsernameBorder] = useState('1px solid #ddd')
    const [emailBorder, setEmailBorder] = useState('1px solid #ddd')
    const [pwdBorder, setPwdBorder] = useState('1px solid #ddd')
    const [rePwdBorder, setRePwdBorder] = useState('1px solid #ddd')

    const [visible, setVisible] = useState(true)

    const navigate = useNavigate();


    const { data, mutate, isPending } = useMutation({
        mutationFn : async (user) => {
            return await signup(user);
        },
        onSuccess : () => {
            setUsername('');
            setEmail('');
            setPassword('');
            setRePwd('');
            navigate('/login');
        },
        onError : (err) => {
            if (err.response.data.error.errors[0].message === "username must be unique") {
                setUsernameMsg('Username already exists.')
                setUsernameBorder('1px solid red')
                setEmailBorder('1px solid #ddd')
                setEmailMsg('');
            } else if (err.response.data.error.errors[0].message === "email must be unique") {
                setEmailMsg('Email already exists.');
                setEmailBorder('1px solid red')
                setUsernameBorder('1px solid #ddd')
                setUsernameMsg('')
            }
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        let test = true;
        const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i;
        if (!regExp.test(password)) {
            test = false;
            setPwdMsg('Minimum eight and maximum 10 characters,\nat least one uppercase letter,\none lowercase letter, one number\nand one special character.');
            setPwdBorder('1px solid red')
        } else {
            setPwdMsg('');
            setPwdBorder('1px solid #ddd')
        }
        if (username.trim().includes(' ')) {
            test = false;
            setUsernameBorder('1px solid red')
            setUsernameMsg('Username must not contain spaces.');
        } 
        if (rePwd !== password) {
            test = false;
            setRePwdBorder('1px solid red')
            setRePwdMsg('Passwords are not the same.');
        } else {
            setRePwdMsg('');
            setRePwdBorder('1px solid #ddd')
        }

        const user = {
            "username": username.trim(),
            "email": email,
            "password": password
        };

        if (test) {
            mutate(user);
        }
    }

    const handleIconClick = () => {
        visible ? setVisible(false) : setVisible(true)
    }

    return (
        <div className="content">
            <div className="form-auth">
                <form onSubmit={handleSubmit} name="signup">
                    <h2>Sign Up</h2>
                    <label htmlFor="username">Username : </label>
                    <input type="text" required id="username" value={username} style={{ border: usernameBorder }} onChange={(e) => setUsername(e.target.value)} />
                    <p style={{
                        color: 'red',
                        whiteSpace: 'pre-line',
                        fontSize: '15px'
                    }}>{usernameMsg}</p>
                    <label htmlFor="email">Email : </label>
                    <input type="email" required id="email" value={email} style={{ border: emailBorder }} onChange={(e) => setEmail(e.target.value)} />
                    <p style={{
                        color: 'red',
                        whiteSpace: 'pre-line',
                        fontSize: '15px'
                    }}>{emailMsg}</p>
                    <label htmlFor="pwd">Password : </label>
                    <div className="password-field" >
                        <input type={visible ? "password" : "text"} required id="pwd" value={password} style={{ border: pwdBorder }} onChange={(e) => setPassword(e.target.value)} />
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
                    }}>{pwdMsg}</p>
                    <label htmlFor="re-pwd">Repeat Password : </label>
                    <div className="password-field" >
                        <input type={visible ? "password" : "text"} required id="re-pwd" value={rePwd} style={{ border: rePwdBorder }} onChange={(e) => setRePwd(e.target.value)} />
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
                    }}>{rePwdMsg}</p>
                    <button disabled={isPending}>Sign Up</button>
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