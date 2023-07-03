import { NavLink } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="not-found">
            <h2>Sorry</h2>
            <p>This page cannot be found</p>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : 'none')} style={{ textDecorationLine: "underline" }}>Back To Home Page</NavLink>
        </div>
    );
}

export default NotFound;