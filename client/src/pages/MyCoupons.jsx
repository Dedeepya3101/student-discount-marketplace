import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/MyCoupons.css";

function MyCoupons() {
  const navigate = useNavigate();
  const [purchasedCoupons, setPurchasedCoupons] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);

    // Load purchased coupons
    const saved = localStorage.getItem("purchasedCoupons");
    if (saved) {
      try {
        setPurchasedCoupons(JSON.parse(saved));
      } catch (e) {
        setPurchasedCoupons([]);
      }
    }
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Coupon code copied to clipboard");
  };

  const handleGoBack = () => {
    navigate("/buy");
  };

  if (!isLoggedIn) {
    return (
      <div className="my-coupons-container">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h2>Login Required</h2>
          <p>Please login to view your purchased coupons.</p>
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-coupons-container">
      <div className="my-coupons-header">
        <h1>My Coupons</h1>
        <p className="coupons-count">
          {purchasedCoupons.length}
          {purchasedCoupons.length === 1 ? " coupon" : " coupons"} purchased
        </p>
      </div>

      {purchasedCoupons.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <h2>No Coupons Yet</h2>
          <p>You haven't purchased any coupons. Start shopping now!</p>
          <button className="btn-primary" onClick={handleGoBack}>
            Browse Coupons
          </button>
        </div>
      ) : (
        <div className="coupons-grid">
          {purchasedCoupons.map((coupon, index) => (
            <div key={index} className="coupon-card-my">
              {/* Card Header */}
              <div className="card-header">
                <h3 className="brand-name">{coupon.brand}</h3>
                <span className="discount-badge">{coupon.discount}</span>
              </div>

              {/* Card Body */}
              <div className="card-body">
                <div className="info-row">
                  <span className="label">Platform:</span>
                  <span className="value">{coupon.platform}</span>
                </div>

                <div className="info-row">
                  <span className="label">Price:</span>
                  <span className="value">
                    ₹{Number(coupon.price).toFixed(2)}
                  </span>
                </div>

                <div className="info-row">
                  <span className="label">Purchased:</span>
                  <span className="value">
                    {new Date(coupon.purchasedAt).toLocaleDateString()}
                  </span>
                </div>

                {coupon.sellerReputation && (
                  <div className="info-row">
                    <span className="label">Seller Rating:</span>
                    <span className="rating">
                      ⭐ {coupon.sellerReputation.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Code Section */}
              <div className="code-section-my">
                <p className="code-label">Coupon Code:</p>
                <div className="code-display">
                  <span className="code-text">{coupon.decryptedCode}</span>
                  <button
                    className="copy-icon-btn"
                    onClick={() => handleCopyCode(coupon.decryptedCode)}
                    title="Copy code"
                    aria-label="Copy coupon code"
                  >
                    📋
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="status-badge">✓ Active</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCoupons;
