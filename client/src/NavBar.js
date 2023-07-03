import { Link, NavLink } from "react-router-dom";
import logo from "./imgs/logo-no-bg.png"

const NavBar = () => {
    return (
        <nav className="navbar">
            <img src={logo} alt="Logo" />
            <div className="links">
                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : 'none')}>Home</NavLink>
                <NavLink to="/problemset" className={({ isActive }) => (isActive ? "active" : 'none')}>Problemset</NavLink>
                <NavLink to="/contests" className={({ isActive }) => (isActive ? "active" : 'none')}>Contests</NavLink>
                <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : 'none')}>About Us</NavLink>
            </div>
            <div className="auth">
                <Link to="/login" className="login">Login</Link>
                <Link to="/signup" className="signup">Sign Up</Link>
            </div>
        </nav>
    );
}

export default NavBar;