import "../styles/buyCoupons.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMaskedCode, decryptCode } from "../utils/encryption";

function BuyCoupons({ coupons }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Get brand icon SVG
  const getBrandIcon = (brand) => {
    switch (brand) {
      case "Amazon":
        return (
          <svg viewBox="0 0 24 24" className="brand-icon" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5m-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11m3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        );
      case "Flipkart":
        return (
          <svg viewBox="0 0 24 24" className="brand-icon" fill="#FF9900">
            <circle cx="12" cy="12" r="10" />
            <text
              x="12"
              y="15"
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
            >
              F
            </text>
          </svg>
        );
      case "Myntra":
        return (
          <svg viewBox="0 0 24 24" className="brand-icon" fill="#F14B5C">
            <circle cx="12" cy="12" r="10" />
            <text
              x="12"
              y="15"
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
            >
              M
            </text>
          </svg>
        );
      case "PhonePe":
        return (
          <svg viewBox="0 0 24 24" className="brand-icon" fill="#5A4FCF">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3-8h-6v2h6v-2z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className="brand-icon" fill="#7C83FD">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <text
              x="12"
              y="15"
              textAnchor="middle"
              fill="currentColor"
              fontSize="12"
              fontWeight="bold"
            >
              ?
            </text>
          </svg>
        );
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const text = search.toLowerCase();

    const matchesSearch =
      coupon.brand.toLowerCase().includes(text) ||
      coupon.discount.toLowerCase().includes(text);

    const matchesCategory = category === "All" || coupon.brand === category;

    return matchesSearch && matchesCategory;
  });

  const handleBuy = (e, coupon) => {
    e.stopPropagation();
    // Navigate to coupon details page
    navigate(`/coupon/${coupon.id}`);
  };

  const handleCouponCardClick = (couponId) => {
    navigate(`/coupon/${couponId}`);
  };

  return (
    <div className="buy-container">
      <h2 className="page-title">Find a Coupon</h2>

      <input
        className="search-bar"
        type="text"
        placeholder="Search brand or coupon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="category-row">
        <button
          className={`category-btn ${category === "All" ? "active" : ""}`}
          onClick={() => setCategory("All")}
        >
          All
        </button>

        <button
          className={`category-btn ${category === "Amazon" ? "active" : ""}`}
          onClick={() => setCategory("Amazon")}
        >
          Amazon
        </button>

        <button
          className={`category-btn ${category === "Flipkart" ? "active" : ""}`}
          onClick={() => setCategory("Flipkart")}
        >
          Flipkart
        </button>

        <button
          className={`category-btn ${category === "Myntra" ? "active" : ""}`}
          onClick={() => setCategory("Myntra")}
        >
          Myntra
        </button>

        <button
          className={`category-btn ${category === "Others" ? "active" : ""}`}
          onClick={() => setCategory("Others")}
        >
          Others
        </button>
      </div>

      <div className="coupon-grid">
        {filteredCoupons.length === 0 ? (
          <p className="no-results">🔍 No coupons found</p>
        ) : (
          filteredCoupons.map((coupon) => {
            return (
              <div
                className={`coupon-card`}
                key={coupon.id}
                onClick={() => handleCouponCardClick(coupon.id)}
              >
                <div className="brand-icon-container">
                  {getBrandIcon(coupon.brand)}
                </div>

                <div className="brand">{coupon.brand}</div>

                <div className="discount">{coupon.discount}</div>

                <div
                  className={`expiry ${coupon.expiry === "Ending Soon" ? "warning" : ""}`}
                >
                  {coupon.expiry}
                </div>

                <div className="seller">Seller: {coupon.seller}</div>

                <div className="code">
                  Code: {getMaskedCode(decryptCode(coupon.encryptedCode))}
                </div>

                <div className="price">Price: ₹{coupon.price}</div>

                <button
                  className="buy-btn"
                  onClick={(e) => handleBuy(e, coupon)}
                >
                  View Details
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BuyCoupons;
