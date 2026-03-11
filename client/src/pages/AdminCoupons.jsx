import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminPanel.css";
import { useState } from "react";

function AdminCoupons() {
  const [coupons, setCoupons] = useState(
    JSON.parse(localStorage.getItem("coupons") || "[]"),
  );

  const handleRemoveCoupon = (couponId) => {
    const updatedCoupons = coupons.filter((coupon) => coupon.id !== couponId);
    setCoupons(updatedCoupons);
    localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
  };

  const handleFlagCoupon = (couponId) => {
    const updatedCoupons = coupons.map((coupon) =>
      coupon.id === couponId
        ? { ...coupon, reported: !coupon.reported }
        : coupon,
    );
    setCoupons(updatedCoupons);
    localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-content">
        <div className="admin-header">
          <h1 className="admin-page-title">Coupons Management</h1>
          <p className="admin-page-subtitle">Total Coupons: {coupons.length}</p>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Coupon Name</th>
                <th>Platform</th>
                <th>Discount</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td>{coupon.name || "N/A"}</td>
                    <td>{coupon.platform || "N/A"}</td>
                    <td>{coupon.discount || "N/A"}</td>
                    <td>{coupon.seller || "N/A"}</td>
                    <td>₹{(coupon.price || 0).toFixed(2)}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          coupon.reported ? "flagged" : "active"
                        }`}
                      >
                        {coupon.reported ? "Flagged" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => alert("View coupon: " + coupon.name)}
                        >
                          View
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to remove this coupon?",
                              )
                            ) {
                              handleRemoveCoupon(coupon.id);
                            }
                          }}
                        >
                          Remove
                        </button>
                        <button
                          className={`action-btn ${
                            coupon.reported ? "unflag-btn" : "flag-btn"
                          }`}
                          onClick={() => handleFlagCoupon(coupon.id)}
                        >
                          {coupon.reported ? "Unflag" : "Flag"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCoupons;
