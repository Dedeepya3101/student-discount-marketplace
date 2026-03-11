import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AdminPanel.css";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/coupons", label: "Coupons", icon: "🎟️" },
    { path: "/admin/reports", label: "Reported Coupons", icon: "⚠️" },
    { path: "/admin/disputes", label: "Disputes", icon: "🔔" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">CouponCatch</h2>
        <p className="sidebar-subtitle">Admin Panel</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <span className="sidebar-icon">🚪</span>
        <span className="sidebar-label">Logout</span>
      </button>
    </div>
  );
}

export default AdminSidebar;
