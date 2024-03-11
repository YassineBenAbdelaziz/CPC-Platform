import useAuth from "../../hooks/useAuth";

const AdminDashboard = () => {
    const { auth } = useAuth();
    return (
        <div className="content">
            <div className="dashboard">
                <h2>Admin Dashboard</h2>
                {/* <h3>Anouncements</h3> */}
            </div>
        </div>
    );
}

export default AdminDashboard;