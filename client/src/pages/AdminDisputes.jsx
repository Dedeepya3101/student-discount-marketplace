import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminPanel.css";
import { useState } from "react";

function AdminDisputes() {
  const [disputes, setDisputes] = useState(
    JSON.parse(localStorage.getItem("disputes") || "[]"),
  );

  const handleResolveDispute = (disputeId) => {
    const updatedDisputes = disputes.map((dispute) =>
      dispute.id === disputeId
        ? { ...dispute, status: "resolved", resolvedDate: new Date() }
        : dispute,
    );
    setDisputes(updatedDisputes);
    localStorage.setItem("disputes", JSON.stringify(updatedDisputes));
  };

  const handleRefundBuyer = (disputeId) => {
    const updatedDisputes = disputes.map((dispute) =>
      dispute.id === disputeId
        ? { ...dispute, status: "refunded", refundedAmount: dispute.amount }
        : dispute,
    );
    setDisputes(updatedDisputes);
    localStorage.setItem("disputes", JSON.stringify(updatedDisputes));
    alert("Refund processed!");
  };

  const handleReleasePayment = (disputeId) => {
    const updatedDisputes = disputes.map((dispute) =>
      dispute.id === disputeId
        ? { ...dispute, status: "released", releasedAmount: dispute.amount }
        : dispute,
    );
    setDisputes(updatedDisputes);
    localStorage.setItem("disputes", JSON.stringify(updatedDisputes));
    alert("Payment released!");
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-content">
        <div className="admin-header">
          <h1 className="admin-page-title">Disputes Management</h1>
          <p className="admin-page-subtitle">
            Total Disputes: {disputes.length}
          </p>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {disputes.length > 0 ? (
                disputes.map((dispute) => (
                  <tr key={dispute.id}>
                    <td>{dispute.buyerName || "N/A"}</td>
                    <td>{dispute.sellerName || "N/A"}</td>
                    <td>₹{(dispute.amount || 0).toFixed(2)}</td>
                    <td>
                      {dispute.dateCreated
                        ? new Date(dispute.dateCreated).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${dispute.status || "open"}`}
                      >
                        {dispute.status || "Open"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleResolveDispute(dispute.id)}
                          disabled={dispute.status === "resolved"}
                        >
                          Resolve
                        </button>
                        <button
                          className="action-btn refund-btn"
                          onClick={() => handleRefundBuyer(dispute.id)}
                          disabled={dispute.status === "refunded"}
                        >
                          Refund
                        </button>
                        <button
                          className="action-btn release-btn"
                          onClick={() => handleReleasePayment(dispute.id)}
                          disabled={dispute.status === "released"}
                        >
                          Release
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No disputes found
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

export default AdminDisputes;
