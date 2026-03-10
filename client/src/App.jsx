import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import Navbar from "./components/Navbar";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import Toast from "./components/Toast";

// Pages
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import BuyCoupons from "./pages/BuyCoupons";
import SellCoupons from "./pages/SellCoupons";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CouponDetails from "./pages/CouponDetails";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyCoupons from "./pages/MyCoupons";
import Admin from "./pages/Admin";

// Data
import couponsData from "./data/coupons";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coupons, setCoupons] = useState(couponsData);
  const [walletBalance, setWalletBalance] = useState(1000);
  const [purchasedCoupons, setPurchasedCoupons] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsLoggedIn(true);
    }

    // Initialize wallet balance - default to 1000
    if (!localStorage.getItem("userWallet")) {
      localStorage.setItem("userWallet", "1000");
      setWalletBalance(1000);
    } else {
      const savedWallet = localStorage.getItem("userWallet");
      const parsedBalance = parseFloat(savedWallet);
      setWalletBalance(isNaN(parsedBalance) ? 1000 : parsedBalance);
    }

    // Load purchased coupons from localStorage
    const savedPurchased = localStorage.getItem("purchasedCoupons");
    if (savedPurchased) {
      try {
        setPurchasedCoupons(JSON.parse(savedPurchased));
      } catch (e) {
        setPurchasedCoupons([]);
      }
    }
  }, []);

  // Show toast notification
  const showToast = (message, type = "info") => {
    setToast({ message, type, show: true });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  // Update wallet balance and persist to localStorage
  const updateWallet = (newBalance) => {
    const numBalance = Number(newBalance) || 0;
    setWalletBalance(numBalance);
    localStorage.setItem("userWallet", numBalance.toString());
  };

  // Add purchased coupon and persist to localStorage
  const addPurchasedCoupon = (coupon) => {
    const updated = [...purchasedCoupons, coupon];
    setPurchasedCoupons(updated);
    localStorage.setItem("purchasedCoupons", JSON.stringify(updated));
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {/* Navbar with wallet and authentication */}
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        walletBalance={walletBalance}
        purchasedCoupons={purchasedCoupons}
      />

      {/* Routes */}
      <Routes>
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route path="/register" element={<Register />} />

        <Route path="/" element={isLoggedIn ? <Dashboard /> : <Landing />} />

        <Route
          path="/buy"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <BuyCoupons coupons={coupons} showToast={showToast} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sell"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SellCoupons setCoupons={setCoupons} showToast={showToast} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coupon/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CouponDetails coupons={coupons} walletBalance={walletBalance} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Payment
                coupons={coupons}
                walletBalance={walletBalance}
                updateWallet={updateWallet}
                addPurchasedCoupon={addPurchasedCoupon}
                setCoupons={setCoupons}
                showToast={showToast}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-success"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <PaymentSuccess showToast={showToast} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-coupons"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyCoupons />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin showToast={showToast} />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
