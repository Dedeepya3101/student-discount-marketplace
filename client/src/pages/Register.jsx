import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Strong password validation: 8+ chars, 1 uppercase, 1 number, 1 special char
  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // Validation function
  const validateForm = () => {
    if (!form.name.trim()) {
      return { valid: false, error: "Name is required" };
    }
    if (form.name.trim().length < 2) {
      return { valid: false, error: "Name must be at least 2 characters" };
    }
    if (form.name.trim().length > 50) {
      return { valid: false, error: "Name must be less than 50 characters" };
    }

    if (!form.email.trim()) {
      return { valid: false, error: "Email is required" };
    }
    if (!validateEmail(form.email.trim())) {
      return { valid: false, error: "Please enter a valid email address" };
    }

    if (!form.password) {
      return { valid: false, error: "Password is required" };
    }
    if (!validatePassword(form.password)) {
      return {
        valid: false,
        error:
          "Password must contain 8 characters, one capital letter, one number, and one special symbol",
      };
    }

    if (!form.confirmPassword) {
      return { valid: false, error: "Please confirm your password" };
    }
    if (form.password !== form.confirmPassword) {
      return { valid: false, error: "Passwords do not match" };
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

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = existingUsers.some(
      (user) => user.email === form.email.trim(),
    );

    if (userExists) {
      setMessage({
        text: "An account with this email already exists",
        type: "error",
      });
      return;
    }

    // Store new user in localStorage
    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password, // In production, this should be hashed
      walletBalance: 1000,
      couponsBought: [],
      couponsSold: [],
      isFlagged: false,
      registeredAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    setMessage({
      text: "Account created successfully. Please login.",
      type: "success",
    });

    // Clear form
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Redirect to login after 1.5 seconds
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join the Student Coupon Exchange</p>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Create Account
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
