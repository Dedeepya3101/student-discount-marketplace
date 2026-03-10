import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css";

function Navbar({
  isLoggedIn,
  setIsLoggedIn,
  walletBalance,
  purchasedCoupons,
}) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [showWalletPanel, setShowWalletPanel] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user?.email) {
        const name = user.email.split("@")[0];
        setUserName(name);
      }
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleWalletPanel = () => {
    setShowWalletPanel(!showWalletPanel);
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showWalletPanel && !e.target.closest(".wallet-section")) {
        setShowWalletPanel(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showWalletPanel]);

  return (
    <div className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          CouponCatch
        </div>

        <div className="nav-buttons">
          {!isLoggedIn ? (
            <div className="navbar-brand-only">
              <span className="navbar-subtitle">Student Coupon Exchange</span>
            </div>
          ) : (
            <>
              <div className="user-info">
                <span className="user-name">Welcome, {userName}</span>
              </div>

              <div className="wallet-section">
                <button className="wallet-btn" onClick={toggleWalletPanel}>
                  <span className="wallet-icon">💰</span>
                  <span className="wallet-text">
                    ₹{(walletBalance || 0).toFixed(2)}
                  </span>
                </button>

                {showWalletPanel && (
                  <div className="wallet-panel">
                    <div className="panel-header">
                      <h3 className="panel-title">Wallet & History</h3>
                      <button
                        className="panel-close"
                        onClick={() => setShowWalletPanel(false)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="panel-content">
                      {/* Wallet Balance */}
                      <div className="panel-section">
                        <h4 className="section-label">Wallet Balance</h4>
                        <div className="balance-display">
                          <span className="balance-value">
                            ₹{(walletBalance || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Total Coupons Purchased */}
                      <div className="panel-section">
                        <h4 className="section-label">Total Purchases</h4>
                        <div className="purchase-display">
                          <span className="purchase-count">
                            {purchasedCoupons.length}
                          </span>
                          <span className="purchase-label">
                            coupon{purchasedCoupons.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Recent Purchases */}
                      <div className="panel-section">
                        <h4 className="section-label">Recent Purchases</h4>

                        {purchasedCoupons.length > 0 ? (
                          <div className="recent-purchases">
                            {purchasedCoupons
                              .slice(-3)
                              .reverse()
                              .map((coupon, index) => (
                                <div key={index} className="purchase-item">
                                  <div className="purchase-left">
                                    <span className="purchase-brand">
                                      {coupon.brand}
                                    </span>
                                    <span className="purchase-discount">
                                      {coupon.discount}
                                    </span>
                                  </div>
                                  <span className="purchase-price">
                                    ₹{coupon.price.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="no-purchases">
                            <p>No purchases yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className="nav-btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
