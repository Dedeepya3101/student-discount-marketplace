import { useNavigate, useEffect } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(loggedInUser);
      if (user.role !== "admin") {
        navigate("/");
        return;
      }
    } catch (e) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Get data from localStorage
  const coupons = JSON.parse(localStorage.getItem("coupons") || "[]");
  const reportedCoupons = coupons.filter((coupon) => coupon.reported);
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const disputes = JSON.parse(localStorage.getItem("disputes") || "[]");

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>

      <div className="stats-grid">
        {/* Total Coupons Listed */}
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3 className="stat-label">Total Coupons Listed</h3>
            <p className="stat-value">{coupons.length}</p>
          </div>
        </div>

        {/* Reported Coupons */}
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3 className="stat-label">Reported Coupons</h3>
            <p className="stat-value">{reportedCoupons.length}</p>
          </div>
        </div>

        {/* Users */}
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-label">Users</h3>
            <p className="stat-value">{users.length}</p>
          </div>
        </div>

        {/* Dispute Requests */}
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3 className="stat-label">Dispute Requests</h3>
            <p className="stat-value">{disputes.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
