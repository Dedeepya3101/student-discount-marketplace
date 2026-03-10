import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import StepProgress from "../components/StepProgress";
import { decryptCode, getMaskedCode } from "../utils/encryption";
import "../styles/payment.css";

function Payment({
  coupons,
  walletBalance,
  updateWallet,
  addPurchasedCoupon,
  setCoupons,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [decryptedCode, setDecryptedCode] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Get coupon and decrypt code
  useEffect(() => {
    const foundCoupon = coupons.find((c) => c.id === parseInt(id));
    if (foundCoupon) {
      setCoupon(foundCoupon);
      const code = decryptCode(foundCoupon.encryptedCode);
      setDecryptedCode(code);
    }
  }, [id, coupons]);

  // Handle confirmation payment
  const handleAutoConfirmPaymentHelper = useCallback(() => {
    if (coupon && decryptedCode) {
      const price = Number(coupon.price);
      const balance = Number(walletBalance);

      if (balance >= price) {
        const newBalance = balance - price;
        updateWallet(newBalance);
        addPurchasedCoupon({
          ...coupon,
          purchasedAt: new Date().toISOString(),
          decryptedCode: decryptedCode,
        });
        setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
        setPaymentStatus("completed");
      }
    }
  }, [
    coupon,
    walletBalance,
    decryptedCode,
    updateWallet,
    addPurchasedCoupon,
    setCoupons,
  ]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timerStarted && timeRemaining === 0) {
      handleAutoConfirmPaymentHelper();
    }
    return () => clearInterval(interval);
  }, [timerStarted, timeRemaining, handleAutoConfirmPaymentHelper]);

  const handleCopyCode = () => {
    if (decryptedCode) {
      navigator.clipboard.writeText(decryptedCode);
      setCodeCopied(true);
      setTimerStarted(true);
      alert("Coupon code copied to clipboard");
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleConfirmPayment = () => {
    if (coupon && decryptedCode) {
      const price = Number(coupon.price);
      const balance = Number(walletBalance);

      if (balance >= price) {
        const newBalance = balance - price;
        updateWallet(newBalance);
        addPurchasedCoupon({
          ...coupon,
          purchasedAt: new Date().toISOString(),
          decryptedCode: decryptedCode,
        });
        setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
        setPaymentStatus("completed");
      }
    }
  };

  const handleReportIssue = () => {
    setShowReportIssue(true);
  };

  const handleScreenshotUpload = (e) => {
    if (e.target.files.length > 0) {
      setScreenshotUploaded(true);
      setPaymentStatus("disputed");
      setTimerStarted(false);
    }
  };

  const handleDone = () => {
    navigate("/buy");
  };

  const handleBackToCoupon = () => {
    if (!timerStarted) {
      navigate(`/coupon/${coupon.id}`);
    }
  };

  if (!coupon) {
    return (
      <div className="payment-container">
        <div className="error-message">
          <p>❌ Coupon not found</p>
          <button className="back-btn" onClick={() => navigate("/buy")}>
            Back to Coupons
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "completed") {
    return (
      <div className="payment-container">
        <div className="success-modal">
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Payment Completed Successfully!</h2>
            <div className="success-details">
              <div className="success-row">
                <span className="success-label">Coupon Code:</span>
                <p className="success-code">{decryptedCode}</p>
              </div>
              <div className="success-row">
                <span className="success-label">Brand:</span>
                <span className="success-value">{coupon.brand}</span>
              </div>
              <div className="success-row">
                <span className="success-label">Discount:</span>
                <span className="success-value">{coupon.discount}</span>
              </div>
              <div className="success-row">
                <span className="success-label">Amount Paid:</span>
                <span className="success-value">
                  ₹{Number(coupon.price).toFixed(2)}
                </span>
              </div>
              <div className="success-row">
                <span className="success-label">Remaining Balance:</span>
                <span className="success-value">
                  ₹
                  {(Number(walletBalance || 0) - Number(coupon.price)).toFixed(
                    2,
                  )}
                </span>
              </div>
            </div>
            <button className="done-btn" onClick={handleDone}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "disputed") {
    return (
      <div className="payment-container">
        <div className="disputed-modal">
          <div className="disputed-content">
            <div className="disputed-icon">⚠️</div>
            <h2 className="disputed-title">
              Payment Cancelled & Marked Disputed
            </h2>
            <p className="disputed-message">
              Your issue report has been received. We will investigate this
              matter and contact you shortly.
            </p>
            <div className="disputed-details">
              <p>
                <span className="disputed-label">Coupon:</span>
                <span className="disputed-value">{coupon.brand}</span>
              </p>
              <p>
                <span className="disputed-label">Status:</span>
                <span className="disputed-value">Under Review</span>
              </p>
            </div>
            <button className="disputed-btn" onClick={handleDone}>
              Back to Coupons
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      {/* Step Progress Indicator */}
      <StepProgress currentStep={2} />

      {!timerStarted && (
        <button className="back-btn" onClick={handleBackToCoupon}>
          ← Back
        </button>
      )}

      <div className="payment-card">
        <h1 className="payment-title">Coupon Verification</h1>

        <div className="payment-section code-section">
          <h3 className="section-title">Your Coupon Code</h3>
          <div className="code-display-box">
            <span className="coupon-code">{getMaskedCode(decryptedCode)}</span>
            <button
              className={`copy-btn ${codeCopied ? "copied" : ""}`}
              onClick={handleCopyCode}
            >
              {codeCopied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

        {timerStarted && (
          <>
            <div className="payment-section timer-section">
              <h3 className="section-title">Verification Timer</h3>
              <div className="timer-display">
                <span className="timer-value">{formatTime(timeRemaining)}</span>
              </div>
              <p className="timer-message">
                You have {formatTime(timeRemaining)} to verify the coupon before
                payment is finalized.
              </p>
              {timeRemaining <= 60 && (
                <p className="timer-warning">
                  ⚠️ Time running out! Payment will be auto-confirmed soon.
                </p>
              )}
            </div>

            <div className="payment-section action-section">
              <h3 className="section-title">Confirm Payment</h3>
              <div className="wallet-info">
                <p className="wallet-label">Coupon Price:</p>
                <p className="wallet-amount">
                  ₹{Number(coupon.price).toFixed(2)}
                </p>
              </div>
              <div className="wallet-info">
                <p className="wallet-label">Wallet Balance:</p>
                <p className="wallet-amount">
                  ₹{(Number(walletBalance) || 0).toFixed(2)}
                </p>
              </div>
              {Number(walletBalance) >= Number(coupon.price) ? (
                <p className="balance-ok">✓ Sufficient balance</p>
              ) : (
                <p className="balance-insufficient">
                  ✗ Insufficient balance. Need ₹
                  {(Number(coupon.price) - Number(walletBalance || 0)).toFixed(
                    2,
                  )}{" "}
                  more
                </p>
              )}
              <div className="action-buttons">
                <button
                  className={`confirm-btn ${Number(walletBalance) < Number(coupon.price) ? "disabled" : ""}`}
                  onClick={handleConfirmPayment}
                  disabled={walletBalance < coupon.price}
                >
                  Confirm Payment
                </button>
                <button className="report-btn" onClick={handleReportIssue}>
                  Report Issue
                </button>
              </div>
            </div>
          </>
        )}

        {!timerStarted && (
          <div className="info-box">
            <p className="info-text">
              👉 Click the "Copy" button to reveal and copy the coupon code.
            </p>
            <p className="info-text secondary">
              This will start a 5-minute timer for payment verification.
            </p>
          </div>
        )}
      </div>

      {showReportIssue && (
        <div className="modal-overlay">
          <div className="report-modal">
            <button
              className="modal-close"
              onClick={() => setShowReportIssue(false)}
            >
              ✕
            </button>
            <h2 className="report-title">Report Issue</h2>
            <p className="report-text">
              Please upload a screenshot of the issue to help us resolve your
              complaint.
            </p>
            <div className="file-upload-box">
              <input
                type="file"
                id="screenshot"
                accept="image/*"
                onChange={handleScreenshotUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="screenshot" className="file-label">
                📸{" "}
                {screenshotUploaded
                  ? "Screenshot Uploaded ✓"
                  : "Choose Screenshot"}
              </label>
            </div>
            <p className="report-warning">
              ⚠️ Uploading a screenshot will cancel this payment and mark it as
              disputed.
            </p>
            <button
              className="report-confirm-btn"
              onClick={() => {
                document.getElementById("screenshot").click();
              }}
              disabled={screenshotUploaded}
            >
              {screenshotUploaded ? "Screenshot Added" : "Upload Screenshot"}
            </button>
            {!screenshotUploaded && (
              <button
                className="modal-btn cancel-btn"
                onClick={() => setShowReportIssue(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
