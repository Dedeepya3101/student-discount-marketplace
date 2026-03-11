import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminPanel.css";
import { useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users") || "[]"),
  );

  const handleSuspendUser = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, suspended: !user.suspended } : user,
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-content">
        <div className="admin-header">
          <h1 className="admin-page-title">Users Management</h1>
          <p className="admin-page-subtitle">Total Users: {users.length}</p>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Wallet Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>₹{(user.walletBalance || 0).toFixed(2)}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          user.suspended ? "suspended" : "active"
                        }`}
                      >
                        {user.suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() =>
                            alert("View profile for: " + user.email)
                          }
                        >
                          View
                        </button>
                        <button
                          className={`action-btn ${
                            user.suspended ? "unsuspend-btn" : "suspend-btn"
                          }`}
                          onClick={() => handleSuspendUser(user.id)}
                        >
                          {user.suspended ? "Unsuspend" : "Suspend"}
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this user?",
                              )
                            ) {
                              handleDeleteUser(user.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No users found
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

export default AdminUsers;
