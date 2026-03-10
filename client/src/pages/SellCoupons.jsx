import { useState } from "react";
import { encryptCode } from "../utils/encryption";
import "../styles/sellCoupons.css";

function SellCoupons({ setCoupons }) {
  const [form, setForm] = useState({
    brand: "",
    discount: "",
    expiry: "",
    price: "",
    seller: "",
    couponCode: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  // Sanitization function - remove potentially dangerous characters
  const sanitizeInput = (input) => {
    return input.trim().replace(/[<>"'&]/g, "");
  };

  // Validation function
  const validateForm = () => {
    const brand = form.brand.trim();
    const discount = form.discount.trim();
    const expiry = form.expiry.trim();
    const seller = form.seller.trim();
    const price = form.price;
    const couponCode = form.couponCode.trim();

    if (!brand) {
      return { valid: false, error: "Brand is required" };
    }
    if (brand.length < 2) {
      return { valid: false, error: "Brand must be at least 2 characters" };
    }
    if (brand.length > 50) {
      return { valid: false, error: "Brand must be less than 50 characters" };
    }

    if (!discount) {
      return { valid: false, error: "Discount is required" };
    }
    if (discount.length < 3) {
      return {
        valid: false,
        error: "Discount must be at least 3 characters (e.g., 20% OFF)",
      };
    }
    if (discount.length > 50) {
      return {
        valid: false,
        error: "Discount must be less than 50 characters",
      };
    }

    if (!expiry) {
      return { valid: false, error: "Expiry is required" };
    }
    if (expiry.length < 3) {
      return {
        valid: false,
        error: "Expiry must be at least 3 characters (e.g., 5 days left)",
      };
    }
    if (expiry.length > 50) {
      return { valid: false, error: "Expiry must be less than 50 characters" };
    }
    // Validate expiry has reasonable content (should contain numbers or common words)
    if (!/\d|day|week|month|hour|left|ends|expir/i.test(expiry)) {
      return {
        valid: false,
        error:
          "Expiry format should include time reference (e.g., '5 days left')",
      };
    }

    if (!seller) {
      return { valid: false, error: "Seller name is required" };
    }
    if (seller.length < 2) {
      return {
        valid: false,
        error: "Seller name must be at least 2 characters",
      };
    }
    if (seller.length > 50) {
      return {
        valid: false,
        error: "Seller name must be less than 50 characters",
      };
    }

    if (!couponCode) {
      return { valid: false, error: "Coupon code is required" };
    }
    if (couponCode.length < 3) {
      return {
        valid: false,
        error: "Coupon code must be at least 3 characters",
      };
    }
    if (couponCode.length > 50) {
      return {
        valid: false,
        error: "Coupon code must be less than 50 characters",
      };
    }

    if (!price || isNaN(price)) {
      return { valid: false, error: "Price must be a valid number" };
    }
    const priceNum = parseFloat(price);
    if (priceNum <= 0) {
      return { valid: false, error: "Price must be greater than 0" };
    }
    if (priceNum > 100000) {
      return { valid: false, error: "Price seems too high (max ₹100,000)" };
    }

    return { valid: true };
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setMessage({ text: "", type: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.valid) {
      setMessage({ text: validation.error, type: "error" });
      return;
    }

    const newCoupon = {
      id: Date.now(),
      brand: sanitizeInput(form.brand),
      discount: sanitizeInput(form.discount),
      expiry: sanitizeInput(form.expiry),
      price: parseFloat(form.price),
      seller: sanitizeInput(form.seller),
      encryptedCode: encryptCode(form.couponCode),
    };

    setCoupons((prev) => [...prev, newCoupon]);

    setMessage({ text: "Coupon listed successfully!", type: "success" });

    setForm({
      brand: "",
      discount: "",
      expiry: "",
      price: "",
      seller: "",
      couponCode: "",
    });
  };

  return (
    <div className="sell-container">
      <h2 className="sell-title">Sell Your Coupon</h2>

      {message.text && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

      <form className="sell-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="discount"
          placeholder="Discount (20% OFF)"
          value={form.discount}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="expiry"
          placeholder="Expiry (3 days left)"
          value={form.expiry}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="seller"
          placeholder="Your Name (Seller)"
          value={form.seller}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="couponCode"
          placeholder="Coupon Code (e.g., SAVE20)"
          value={form.couponCode}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price ₹"
          value={form.price}
          onChange={handleChange}
          step="0.01"
          required
        />

        <button type="submit">List Coupon</button>
      </form>
    </div>
  );
}

export default SellCoupons;
