import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import url from '../utils/Url.js';
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/user.js";
import Error from "../Error/Error.jsx";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { auth } = useAuth();

  const { data: users, isError, error, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return (await getAllUsers())?.data;
    },
  });

  const role = (id_role) => {
    switch (id_role) {
        case 1:
            return "user";
        case 2:
            return "mod";
        case 3:
            return "admin";
    }
  }

  return (
    <div className="dashboard">
        <h2>Admin Dashboard</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="profiles">
                {isError && <Error err={error}/>}
                {isPending && <div>Loading...</div>}
                {!isPending && !isError && !users && <div>No users Found</div>}
                {
                    !isPending && !isError && 
                    users && users.sort((a, b) => a.score < b.score ? 1 : -1).map((user, index) => (
                        < div className="profile" key={index} >
                            <div className="item">
                                <div style={{ fontWeight: '600', marginRight: '10px' }}>{index + 1}</div>
                                <Link to={`/profile/${user.username}`}>
                                    <img src={url + user.imagePath} alt="img" />
                                </Link>
                                <Link to={`/profile/${user.username}`}>
                                    <h3 className="username">{user.username}</h3>
                                </Link>
                            </div>
                            <div className="score">
                                {role(user.id_role)}
                            </div>
                        </div >
                    ))
                }
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
