import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import StepProgress from "../components/StepProgress";
import { getMaskedCode } from "../utils/encryption";
import "../styles/PaymentSuccess.css";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [coupon, setCoupon] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    // Get coupon data from location state
    if (location.state?.coupon) {
      setCoupon(location.state.coupon);
    }
  }, [location.state]);

  const handleCopyCode = () => {
    if (coupon?.decryptedCode) {
      navigator.clipboard.writeText(coupon.decryptedCode);
      setCodeCopied(true);
      alert("Coupon code copied to clipboard");
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  if (!coupon) {
    return (
      <div className="payment-success-container">
        {/* Step Progress Indicator */}
        <StepProgress currentStep={3} />

        <div className="success-card">
          <div className="error-icon">⚠</div>
          <h2>Something went wrong</h2>
          <p>Please go back and try again.</p>
          <button className="btn-primary" onClick={() => navigate("/buy")}>
            Back to Coupons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      {/* Step Progress Indicator */}
      <StepProgress currentStep={3} />

      <div className="success-card">
        {/* Success Icon */}
        <div className="success-icon">✓</div>

        {/* Success Message */}
        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-subtitle">
          Your coupon has been purchased and is ready to use.
        </p>

        {/* Coupon Details Card */}
        <div className="coupon-info-card">
          <div className="coupon-info-row">
            <span className="info-label">Brand:</span>
            <span className="info-value">{coupon.brand}</span>
          </div>

          <div className="coupon-info-row">
            <span className="info-label">Discount:</span>
            <span className="info-value">{coupon.discount}</span>
          </div>

          <div className="coupon-info-row">
            <span className="info-label">Price Paid:</span>
            <span className="info-value">
              ₹{Number(coupon.price).toFixed(2)}
            </span>
          </div>

          <div className="coupon-info-row">
            <span className="info-label">Purchased:</span>
            <span className="info-value">
              {new Date(coupon.purchasedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Code Display */}
        <div className="code-section">
          <p className="code-label">Your Coupon Code:</p>
          <div className="code-box">
            <span className="coupon-code">
              {getMaskedCode(coupon.decryptedCode)}
            </span>
            <button
              className={`copy-btn ${codeCopied ? "copied" : ""}`}
              onClick={handleCopyCode}
              aria-label="Copy coupon code"
            >
              {codeCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/my-coupons")}
          >
            Go to My Coupons
          </button>
          <button className="btn-secondary" onClick={() => navigate("/buy")}>
            Buy More Coupons
          </button>
        </div>

        {/* Additional Info */}
        <div className="info-section">
          <p>
            You can view this coupon anytime in your <strong>My Coupons</strong>{" "}
            section.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
