import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "./imgs/logo-no-bg.png"
import useAuth from "./hooks/useAuth";
import user from "./imgs/user.png"
import settings from "./imgs/settings.png"
import submissions from "./imgs/submissions.png"
import logout from "./imgs/logout.png"
import help from "./imgs/question.png"
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const NavBar = () => {
    const url = "http://localhost:5000/";

    const { auth, setAuth } = useAuth();
    const [showProfile, setShowProfile] = useState(false)

    const navigate = useNavigate();

    const handleLogout = () => {
        axios.get(url + 'user/logout').then(res => {
            console.log(res.data)
            setAuth({})
        }).catch(err => {
            console.log(err)
        });

        // window.location.reload()
        setShowProfile(false);
        document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        navigate('/login', { replace: true })
    }

    let menuRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (auth?.username && !menuRef.current.contains(e.target)) {
                setShowProfile(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => {
            document.removeEventListener('mousedown', handler)
        }
    })

    return (
        <nav className="navbar">
            <img className="logo" src={logo} alt="Logo" />
            <div className="links">
                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : 'none')}>Home</NavLink>
                <NavLink to="/problemset" className={({ isActive }) => (isActive ? "active" : 'none')}>Problemset</NavLink>
                <NavLink to="/contests" className={({ isActive }) => (isActive ? "active" : 'none')}>Contests</NavLink>
                <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : 'none')}>About Us</NavLink>
            </div>
            {auth?.username ?
                <div className="dropdown" style={{ marginLeft: 'auto' }}>
                    <img
                        className="user-img"
                        src={'http://localhost:5000/' + auth?.img}
                        alt="user-img"

                        onClick={() => setShowProfile(!showProfile)}
                    />
                    <div
                        className="user-info" ref={menuRef}
                        style={showProfile ? { display: 'block' } : { display: 'none' }}
                    >
                        <Link to={`/profile/${auth?.username}`} className="item" onClick={() => setShowProfile(false)}>
                            <img src={user} alt="" />
                            <h4 className="name">Profile</h4>
                        </Link>
                        <div className="item">
                            <img src={settings} alt="" />
                            <h4 className="name">Edit Profile</h4>
                        </div>
                        <Link to={`/profile/${auth?.id}/submissions`} className="item" onClick={() => setShowProfile(false)}>
                            <img src={submissions} alt="" />
                            <h4 className="name">Submissions</h4>
                        </Link>
                        <hr />
                        <div className="item">
                            <img src={help} alt="" />
                            <h4 className="name">Help Center</h4>
                        </div>
                        <hr />
                        <div className="item" onClick={() => handleLogout()}>
                            <img src={logout} alt="" />
                            <h4 className="name">Logout</h4>
                        </div>

                    </div>

                </div> :
                <div className="auth">
                    <Link to="/login" className="login">Login</Link>
                    <Link to="/signup" id="signup">Sign Up</Link>
                </div>}
        </nav>
    );
}


export default NavBar;