import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminPanel.css";
import { useState } from "react";

function AdminReports() {
  const allCoupons = JSON.parse(localStorage.getItem("coupons") || "[]");
  const reportedCoupons = allCoupons.filter((coupon) => coupon.reported);
  const [coupons, setCoupons] = useState(reportedCoupons);

  const handleApproveCoupon = (couponId) => {
    const updatedAllCoupons = allCoupons.map((coupon) =>
      coupon.id === couponId
        ? { ...coupon, reported: false, status: "approved" }
        : coupon,
    );
    localStorage.setItem("coupons", JSON.stringify(updatedAllCoupons));

    const updatedReportedCoupons = coupons.filter(
      (coupon) => coupon.id !== couponId,
    );
    setCoupons(updatedReportedCoupons);
  };

  const handleRemoveCoupon = (couponId) => {
    const updatedAllCoupons = allCoupons.filter(
      (coupon) => coupon.id !== couponId,
    );
    localStorage.setItem("coupons", JSON.stringify(updatedAllCoupons));

    const updatedReportedCoupons = coupons.filter(
      (coupon) => coupon.id !== couponId,
    );
    setCoupons(updatedReportedCoupons);
  };

  const handleWarnSeller = (couponId) => {
    alert("Seller warned for coupon ID: " + couponId);
    handleApproveCoupon(couponId);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-content">
        <div className="admin-header">
          <h1 className="admin-page-title">Reported Coupons</h1>
          <p className="admin-page-subtitle">
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""} under
            review
          </p>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Coupon Name</th>
                <th>Platform</th>
                <th>Seller</th>
                <th>Discount</th>
                <th>Posted Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="report-row">
                    <td className="bold-text">{coupon.name || "N/A"}</td>
                    <td>{coupon.platform || "N/A"}</td>
                    <td>{coupon.seller || "N/A"}</td>
                    <td>{coupon.discount || "N/A"}</td>
                    <td>
                      {coupon.postedDate
                        ? new Date(coupon.postedDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleApproveCoupon(coupon.id)}
                        >
                          Approve
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
                          className="action-btn warn-btn"
                          onClick={() => handleWarnSeller(coupon.id)}
                        >
                          Warn
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No reported coupons
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

export default AdminReports;
