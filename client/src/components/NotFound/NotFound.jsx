import { NavLink, useNavigate } from "react-router-dom";

const NotFound = () => {
    const history = useNavigate();

    return (
        <div className="content">
            <div className="not-found">
                <h2>Sorry</h2>
                <p>This page cannot be found</p>
                <p onClick={() => history(-1)} style={{ textDecorationLine: "underline", cursor: 'pointer' }}> Back To Previous Page</p>
                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : 'none')} style={{ textDecorationLine: "underline" }}>Back To Home Page</NavLink>
            </div>
        </div >
    );
}

export default NotFound;