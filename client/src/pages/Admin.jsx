import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Admin.css";

function Admin({ showToast }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [disputes, setDisputes] = useState([]);

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

    // Load all users
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(allUsers);

    // Load coupons
    const couponsData = JSON.parse(localStorage.getItem("coupons") || "[]");
    setCoupons(couponsData);

    // Load disputes
    const disputesData = JSON.parse(localStorage.getItem("disputes") || "[]");
    setDisputes(disputesData);
  }, [navigate]);

  const handleFlagSeller = (userId) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, isFlagged: !u.isFlagged } : u,
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const user = users.find((u) => u.id === userId);
    const user_is_now_flagged = !user?.isFlagged;
    if (showToast) {
      showToast(
        user_is_now_flagged ? "Seller flagged" : "Seller unflagged",
        "info",
      );
    }
  };

  const handleBanUser = (userId) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, isBanned: !u.isBanned } : u,
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const user = users.find((u) => u.id === userId);
    const user_is_now_banned = !user?.isBanned;
    if (showToast) {
      showToast(
        user_is_now_banned ? "User banned" : "User unbanned",
        "warning",
      );
    }
  };

  const handleApproveCoupon = (couponId) => {
    const updatedCoupons = coupons.map((c) =>
      c.id === couponId
        ? { ...c, status: c.status === "approved" ? "pending" : "approved" }
        : c,
    );
    setCoupons(updatedCoupons);
    localStorage.setItem("coupons", JSON.stringify(updatedCoupons));

    const coupon = coupons.find((c) => c.id === couponId);
    const is_now_approved = coupon?.status !== "approved";
    if (showToast) {
      showToast(
        is_now_approved ? "Coupon approved" : "Coupon approval revoked",
        "success",
      );
    }
  };

  const handleResolveDispute = (disputeId) => {
    const updatedDisputes = disputes.map((d) =>
      d.id === disputeId
        ? { ...d, status: d.status === "resolved" ? "open" : "resolved" }
        : d,
    );
    setDisputes(updatedDisputes);
    localStorage.setItem("disputes", JSON.stringify(updatedDisputes));

    const dispute = disputes.find((d) => d.id === disputeId);
    const is_now_resolved = dispute?.status !== "resolved";
    if (showToast) {
      showToast(
        is_now_resolved ? "Dispute resolved" : "Dispute reopened",
        "success",
      );
    }
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h3 className="admin-title">Admin Panel</h3>

        <button
          className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Users
        </button>

        <button
          className={`admin-tab-btn ${activeTab === "coupons" ? "active" : ""}`}
          onClick={() => setActiveTab("coupons")}
        >
          🎫 Coupons
        </button>

        <button
          className={`admin-tab-btn ${activeTab === "disputes" ? "active" : ""}`}
          onClick={() => setActiveTab("disputes")}
        >
          ⚠️ Disputes
        </button>

        <button
          className="admin-logout-btn"
          onClick={() => {
            localStorage.removeItem("loggedInUser");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN PANEL */}
      <div className="admin-main">
        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="admin-section">
            <h2>Manage Users</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User Email</th>
                    <th>Name</th>
                    <th>Coupons Bought</th>
                    <th>Coupons Sold</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.name}</td>
                      <td>{(user.couponsBought || []).length}</td>
                      <td>{(user.couponsSold || []).length}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.isBanned
                              ? "badge-banned"
                              : user.isFlagged
                                ? "badge-flagged"
                                : "badge-active"
                          }`}
                        >
                          {user.isBanned
                            ? "Banned"
                            : user.isFlagged
                              ? "Flagged"
                              : "Active"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`action-btn ${user.isFlagged ? "flagged" : ""}`}
                          onClick={() => handleFlagSeller(user.id)}
                          title="Flag Seller"
                        >
                          🚩
                        </button>
                        <button
                          className={`action-btn ${user.isBanned ? "banned" : ""}`}
                          onClick={() => handleBanUser(user.id)}
                          title="Ban User"
                        >
                          🚫
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COUPONS TAB */}
        {activeTab === "coupons" && (
          <div className="admin-section">
            <h2>Manage Coupons</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Brand</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th>Seller</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>{coupon.brand}</td>
                      <td>{coupon.discount}</td>
                      <td>
                        <span
                          className={`badge ${
                            coupon.status === "flagged"
                              ? "badge-flagged"
                              : coupon.status === "approved"
                                ? "badge-approved"
                                : "badge-pending"
                          }`}
                        >
                          {coupon.status || "pending"}
                        </span>
                      </td>
                      <td>{coupon.seller}</td>
                      <td>₹{coupon.price}</td>
                      <td>
                        <button
                          className={`action-btn ${
                            coupon.status === "approved" ? "approved" : ""
                          }`}
                          onClick={() => handleApproveCoupon(coupon.id)}
                          title="Approve Coupon"
                        >
                          ✓
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DISPUTES TAB */}
        {activeTab === "disputes" && (
          <div className="admin-section">
            <h2>Manage Disputes</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Dispute ID</th>
                    <th>Reported By</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {disputes.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No disputes reported
                      </td>
                    </tr>
                  ) : (
                    disputes.map((dispute) => (
                      <tr key={dispute.id}>
                        <td>#{dispute.id}</td>
                        <td>{dispute.reportedBy}</td>
                        <td>{dispute.reason}</td>
                        <td>
                          <span
                            className={`badge ${
                              dispute.status === "resolved"
                                ? "badge-resolved"
                                : "badge-open"
                            }`}
                          >
                            {dispute.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`action-btn ${
                              dispute.status === "resolved" ? "resolved" : ""
                            }`}
                            onClick={() => handleResolveDispute(dispute.id)}
                            title="Resolve Dispute"
                          >
                            ✓
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
