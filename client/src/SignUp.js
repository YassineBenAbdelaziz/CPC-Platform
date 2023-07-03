import { useState } from "react";
import useFetch from "./useFetch";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [rePwd, setRePwd] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [rePwdMsg, setRePwdMsg] = useState('');

    const navigate = useNavigate();

    // eslint-disable-next-line
    const { data: users, isPending, error } = useFetch('http://localhost:8000/users');

    const handleSubmit = (e) => {
        let test = true;
        let testMail = true;
        const regExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!regExp.test(pwd)) {
            e.preventDefault();
            test = false;
            setPwdMsg('Password must have minimum of 8 caracters, \n at least one letter and one number.');
        } else {
            setPwdMsg('');
        }
        if (rePwd !== pwd) {
            e.preventDefault();
            test = false;
            setRePwdMsg('Passwords are not the same.');
        } else {
            setRePwdMsg('');
        }
        (users && users.forEach((user) => {
            if (email === user.email) {
                testMail = false;
            }
        }))
        if (!testMail) {
            e.preventDefault();
            setEmailMsg('Email exists already.');
        } else {
            setEmailMsg('');
        }

        const user = { fname, lname, username, email, img: "./imgs/blank-profile-picture-973460_1280.webp", score: 0, pwd };
        if (test && testMail) {
            fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            }).then(() => {
                console.log('new user added');
            })
            navigate('/');
        }
    }

    return (
        <div className="form-auth">
            <form onSubmit={handleSubmit} name="signup">
                <h2>Sign Up</h2>
                <label htmlFor="fname">First Name : </label>
                <input type="text" required id="fname" value={fname} onChange={(e) => setFname(e.target.value)} />
                <label htmlFor="lname">Last Name : </label>
                <input type="text" required id="lname" value={lname} onChange={(e) => setLname(e.target.value)} />
                <label htmlFor="username">Username : </label>
                <input type="text" required id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="email">Email : </label>
                <input type="email" required id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <p style={{
                    color: 'red',
                    whiteSpace: 'pre-line',
                    fontSize: '15px'
                }}>{emailMsg}</p>
                <label htmlFor="pwd">Password : </label>
                <input type="password" required id="pwd" value={pwd} onChange={(e) => setPwd(e.target.value)} />
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
    );
}

export default SignUp;