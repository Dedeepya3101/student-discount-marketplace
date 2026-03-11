import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    const email = form.email.trim();
    const password = form.password;

    // Basic validation
    if (!email || !password) {
      setMessage({ text: "Email and password required", type: "error" });
      return;
    }

    if (!validateEmail(email)) {
      setMessage({ text: "Invalid email format", type: "error" });
      return;
    }

    /*
    ============================================
    ADMIN LOGIN
    ============================================
    */

    if (email === "admin@couponcatch.com" && password === "admin123") {
      const adminUser = {
        id: "admin-1",
        name: "Administrator",
        email: "admin@couponcatch.com",
        role: "admin",
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("loggedInUser", JSON.stringify(adminUser));

      setIsLoggedIn(true);

      setMessage({
        text: "Admin login successful",
        type: "success",
      });

      setTimeout(() => {
        navigate("/admin");
      }, 500);

      return;
    }

    /*
    ============================================
    NORMAL USER LOGIN
    ============================================
    */

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find((u) => u.email === email);

    if (!user) {
      setMessage({
        text: "Account not found. Please register first.",
        type: "error",
      });
      return;
    }

    if (user.password !== password) {
      setMessage({
        text: "Incorrect password",
        type: "error",
      });
      return;
    }

    const loggedInUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "user",
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    localStorage.setItem("userWallet", user.walletBalance?.toString() || "500");

    localStorage.setItem(
      "purchasedCoupons",
      JSON.stringify(user.couponsBought || []),
    );

    setIsLoggedIn(true);

    setMessage({
      text: "Login successful",
      type: "success",
    });

    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Student Coupon Exchange</p>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/register")}>
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
