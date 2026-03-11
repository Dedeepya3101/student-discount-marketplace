import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminPanel.css";

function AdminDashboard() {
  // Get data from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const coupons = JSON.parse(localStorage.getItem("coupons") || "[]");
  const purchasedCoupons = JSON.parse(
    localStorage.getItem("purchasedCoupons") || "[]",
  );
  const disputes = JSON.parse(localStorage.getItem("disputes") || "[]");

  // Calculate stats
  const reportedCoupons = coupons.filter((coupon) => coupon.reported);
  const couponsSold = purchasedCoupons.length;
  const couponsPurchased = purchasedCoupons.length;
  const activeDisputes = disputes.filter((d) => d.status !== "resolved").length;

  const analytics = [
    { label: "Total Users", value: users.length, icon: "👥", color: "#7c83fd" },
    {
      label: "Total Coupons",
      value: coupons.length,
      icon: "🎟️",
      color: "#74b9ff",
    },
    { label: "Coupons Sold", value: couponsSold, icon: "📤", color: "#55efc4" },
    {
      label: "Coupons Purchased",
      value: couponsPurchased,
      icon: "📥",
      color: "#ffeaa7",
    },
    {
      label: "Reported Coupons",
      value: reportedCoupons.length,
      icon: "⚠️",
      color: "#fab1a0",
    },
    {
      label: "Active Disputes",
      value: activeDisputes,
      icon: "🔔",
      color: "#ff9a76",
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-content">
        <div className="admin-header">
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome to your admin dashboard</p>
        </div>

        <div className="analytics-grid">
          {analytics.map((item, index) => (
            <div
              key={index}
              className="analytics-card"
              style={{ borderLeftColor: item.color }}
            >
              <div className="card-header">
                <span className="card-icon">{item.icon}</span>
                <span className="card-value" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
              <p className="card-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
