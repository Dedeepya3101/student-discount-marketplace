import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import StepProgress from "../components/StepProgress";
import "../styles/couponDetails.css";

function CouponDetails({ coupons, walletBalance }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddFundsAlert, setShowAddFundsAlert] = useState(false);

  // Find coupon by ID
  const coupon = coupons.find((c) => c.id === parseInt(id));

  // Handle coupon not found
  if (!coupon) {
    return (
      <div className="coupon-details-container">
        <div className="error-message">
          <p>❌ Coupon not found</p>
          <button className="back-btn" onClick={() => navigate("/buy")}>
            Back to Coupons
          </button>
        </div>
      </div>
    );
  }

  const handleProceedToPayment = () => {
    navigate(`/payment/${coupon.id}`);
  };

  return (
    <div className="coupon-details-container">
      {/* Step Progress Indicator */}
      <StepProgress />

      <button className="back-btn" onClick={() => navigate("/buy")}>
        ← Back
      </button>

      <div className="details-card">
        {/* Seller Reputation Warning */}
        {coupon.flagged && (
          <div className="warning-banner">
            <span className="warning-icon">⚠️</span>
            <span className="warning-text">
              Seller has received complaints. Proceed carefully.
            </span>
          </div>
        )}

        <div className="details-header">
          <div className="header-top">
            <h1 className="details-brand">{coupon.brand}</h1>
            {coupon.sellerReputation && (
              <div className="reputation-badge">
                <span className="star">★</span>
                <span className="rating">
                  {coupon.sellerReputation.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <p className="details-coupon-name">{coupon.couponName}</p>
          <p className="details-platform">{coupon.platform}</p>
        </div>

        <div className="details-content">
          <div className="detail-row">
            <span className="detail-label">Seller Name:</span>
            <span className="detail-value">{coupon.seller}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Platform:</span>
            <span className="detail-value">{coupon.platform}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Discount:</span>
            <span className="detail-value discount-value">
              {coupon.discount}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Expiry:</span>
            <span
              className={`detail-value ${coupon.expiry === "Ending Soon" ? "expiry-warning" : ""}`}
            >
              {coupon.expiry}
            </span>
          </div>

          <div className="detail-row price-row">
            <span className="detail-label">Price:</span>
            <span className="detail-price">₹{coupon.price.toFixed(2)}</span>
          </div>

          <div className="detail-separator"></div>

          <p className="code-notice">
            ✓ Coupon code will be revealed after successful payment
          </p>
        </div>

        {/* Insufficient Balance Card */}
        {walletBalance < coupon.price && (
          <div className="insufficient-balance-card">
            <div className="card-header-warn">
              <span className="warn-icon">⚠</span>
              <span className="warn-title">Insufficient Wallet Balance</span>
            </div>
            <div className="card-body-warn">
              <div className="balance-row">
                <span className="label">Your Wallet:</span>
                <span className="amount wallet-amount">
                  ₹{Number(walletBalance || 0).toFixed(2)}
                </span>
              </div>
              <div className="balance-row">
                <span className="label">Coupon Price:</span>
                <span className="amount price-amount">
                  ₹{Number(coupon.price).toFixed(2)}
                </span>
              </div>
              <div className="balance-row shortage">
                <span className="label">Need:</span>
                <span className="amount shortage-amount">
                  ₹
                  {(Number(coupon.price) - Number(walletBalance || 0)).toFixed(
                    2,
                  )}
                </span>
              </div>
            </div>
            <div className="card-actions">
              <button
                className="btn-add-funds"
                onClick={() => setShowAddFundsAlert(true)}
              >
                + Add Funds
              </button>
              <button className="btn-cancel" onClick={() => navigate("/buy")}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {showAddFundsAlert && (
          <div
            className="alert-overlay"
            onClick={() => setShowAddFundsAlert(false)}
          >
            <div className="alert-box" onClick={(e) => e.stopPropagation()}>
              <p>Real payment integration coming soon!</p>
              <button
                className="alert-close-btn"
                onClick={() => setShowAddFundsAlert(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}

        <button
          className={`proceed-btn ${coupon.flagged || walletBalance < coupon.price ? "disabled" : ""}`}
          onClick={handleProceedToPayment}
          disabled={coupon.flagged || walletBalance < coupon.price}
        >
          {coupon.flagged
            ? "Cannot Purchase - Flagged Seller"
            : walletBalance < coupon.price
              ? "Insufficient Balance"
              : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}

export default CouponDetails;
