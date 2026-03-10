import "../styles/dashboard.css";

import buyImage from "../images/buy.png";
import sellImage from "../images/sell.png";

import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      <h1 className="title">Student Coupon Exchange</h1>

      <p className="tagline">
        Don't let coupons expire. Sell them.
      </p>

      <div className="card-container">

        <div className="card">

          <img src={buyImage} alt="buy coupon" />

          <button
            className="card-btn"
            onClick={() => navigate("/buy")}
          >
            Buy a Coupon
          </button>

        </div>

        <div className="card">

          <img src={sellImage} alt="sell coupon" />

          <button
            className="card-btn"
            onClick={() => navigate("/sell")}
          >
            Sell a Coupon
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;