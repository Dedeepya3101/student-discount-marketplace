import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* LEFT SECTION - Hero */}
      <div className="landing-hero">
        <h1 className="hero-slogan">Don't Waste Coupons — Sell Them.</h1>
        <p className="hero-subtitle">
          Student Coupon Exchange helps students buy unused coupons and save
          money.
        </p>
      </div>

      {/* RIGHT SECTION - Auth Card */}
      <div className="landing-auth">
        <div className="auth-card">
          <h2 className="auth-title">Welcome to CouponCatch</h2>
          <p className="auth-subtitle">
            Start buying and selling coupons today
          </p>

          <div className="auth-buttons">
            <button
              className="auth-btn login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="auth-btn register-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>

          <p className="auth-footer">
            Join thousands of students saving money on coupons
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
