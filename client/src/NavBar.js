import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "./imgs/logo-no-bg.png"
import useAuth from "./hooks/useAuth";
import user from "./imgs/user.png"
import settings from "./imgs/settings.png"
import submissions from "./imgs/submissions.png"
import logoutImg  from "./imgs/logoutImg.png";
import help from "./imgs/question.png"
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { logout } from "./services/user";
import url from "./Url";

const NavBar = () => {

    const { auth, setAuth } = useAuth();
    const [showProfile, setShowProfile] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [ isLogout, setIsLogout ] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {

        // window.location.reload()
        setIsLogout(true);
        document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        
    }

    const {data, isPending, isError, error} = useQuery({
        queryKey : ['logout'],
        queryFn : async () => {
            logout();
            setAuth({});
            setShowProfile(false);
            setIsLogout(false);
            navigate('/login', { replace: true })  ;
            return await  true ;
        },
        enabled : isLogout
    });




    let userInfoRef = useRef();
    let menuRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (auth?.username && !userInfoRef.current.contains(e.target)) {
                setShowProfile(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => {
            document.removeEventListener('mousedown', handler)
        }
    })

    useEffect(() => {
        let handler = (e) => {
            if (menuRef.current && e.target.id !== 'close-icon' && e.target.className !== 'user-img') {
                setOpenMenu(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => {
            document.removeEventListener('mousedown', handler)
        }
    })

    return (
        <nav className="navbar">
            <Link to="/"><img className="logo" src={logo} alt="Logo" /></Link>

            <input type="checkbox" id="check" checked={openMenu} onChange={() => openMenu ? setOpenMenu(false) : setOpenMenu(true)} />
            <label htmlFor="check" className="icons">
                <i className='bx bx-menu' id="menu-icon" ></i>
                <i className='bx bx-x' id="close-icon" ></i>
            </label>

            <div className="routes" ref={menuRef}
                style={openMenu && showProfile ? { height: '32rem' } :
                    openMenu && auth?.username ? { height: '17rem' } : openMenu && !auth?.username ? { height: '21rem' } : {}}
            >
                <div className="links">
                    <div className="link-container"><NavLink to="/" className={({ isActive }) => (isActive ? "active" : 'none')}>Home</NavLink></div>
                    <div className="link-container"><NavLink to="/problemset" className={({ isActive }) => (isActive ? "active" : 'none')}>Problemset</NavLink></div>
                    <div className="link-container"><NavLink to="/contests" className={({ isActive }) => (isActive ? "active" : 'none')}>Contests</NavLink></div>
                    <div className="link-container"><NavLink to="/about" className={({ isActive }) => (isActive ? "active" : 'none')}>About Us</NavLink></div>
                </div>
                {auth?.username ?
                    <div className="dropdown">
                        <img
                            className="user-img"
                            src={url + auth?.img}
                            alt="user-img"
                            onClick={() => setShowProfile(!showProfile)}
                        />
                        <div
                            className="user-info" ref={userInfoRef}
                            style={showProfile ? { display: 'block' } : { display: 'none' }}
                        >
                            <Link to={`/profile/${auth?.username}`} className="item" onClick={() => setShowProfile(false)}>
                                <img src={user} alt="" />
                                <h4 className="name">Profile</h4>
                            </Link>
                            <Link to={`/profile/${auth?.username}/edit`} className="item" onClick={() => setShowProfile(false)}>
                                <img src={settings} alt="" />
                                <h4 className="name">Edit Profile</h4>
                            </Link>
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
                                <img src={logoutImg} alt="" />
                                <h4 className="name">Logout</h4>
                            </div>

                        </div>

                    </div> :
                    <div className="auth">
                        <div className="link-container"><Link to="/login" className="login">Login</Link></div>
                        <div className="link-container"><Link to="/signup" id="signup">Sign Up</Link></div>
                    </div>}
            </div>
        </nav>
    );
}


export default NavBar;