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

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation function
  const validateForm = () => {
    if (!form.email.trim()) {
      return { valid: false, error: "Email is required" };
    }
    if (!validateEmail(form.email.trim())) {
      return { valid: false, error: "Please enter a valid email address" };
    }
    if (!form.password) {
      return { valid: false, error: "Password is required" };
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

    // Check for admin credentials
    const email = form.email.trim();
    const password = form.password;

    if (email === "admin@couponcatch.com" && password === "admin123") {
      // Admin login
      const adminInfo = {
        id: "admin-1",
        name: "Administrator",
        email: "admin@couponcatch.com",
        role: "admin",
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("loggedInUser", JSON.stringify(adminInfo));

      setMessage({
        text: "Admin login successful. Redirecting...",
        type: "success",
      });

      // Update parent state and redirect to admin dashboard
      setIsLoggedIn(true);
      setTimeout(() => {
        navigate("/admin");
      }, 800);
      return;
    }

    // Check if user exists in registered users
    const registeredUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const user = registeredUsers.find((u) => u.email === email);

    if (!user) {
      setMessage({
        text: "Account not found. Please register first.",
        type: "error",
      });
      return;
    }

    // Validate password
    if (user.password !== password) {
      setMessage({
        text: "Incorrect password.",
        type: "error",
      });
      return;
    }

    // Successful login - store logged-in user info
    const loggedInUserInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "user",
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUserInfo));

    // Initialize wallet and purchased coupons from user data
    localStorage.setItem("userWallet", user.walletBalance.toString());
    localStorage.setItem(
      "purchasedCoupons",
      JSON.stringify(user.couponsBought || []),
    );

    setMessage({ text: "Login successful. Redirecting...", type: "success" });

    // Update parent state and redirect
    setIsLoggedIn(true);
    setTimeout(() => {
      navigate("/");
    }, 800);
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
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
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
