# Wallet System Testing Guide

## Overview

This guide walks you through testing all the wallet fixes implemented to resolve the NaN display bug and payment confirmation issue.

## What Was Fixed

1. **Centralized Wallet State** - All wallet balance and transaction data now managed in App.jsx
2. **Numeric Type Coercion** - All price/balance comparisons use Number() to prevent NaN
3. **Defensive Display Formatting** - All wallet displays use (value || 0) to prevent undefined errors
4. **Enhanced Parsing** - Initial wallet load validates data with isNaN() checks and fallback to 500

## Test Environment Setup

1. **Clear localStorage** before starting:
   - F12 → Developer Tools
   - Application tab → Local Storage → student-coupon-exchange domain
   - Delete: `userWallet`, `purchasedCoupons`, `loggedInUser`
   - Close Dev Tools

2. **Start fresh:**
   - Navigate to http://localhost:5173 (or your dev server URL)
   - You should see initial wallet display: **₹500.00**

---

## Test 1: Wallet Initialization & Display ✓

**Goal:** Verify wallet starts at ₹500 and displays correctly without NaN

### Steps:

1. Load the app fresh (with cleared localStorage)
2. Look at Navbar wallet button
3. **VERIFY:** Should display **₹500.00** (not ₹NaN, not ₹undefined)

### What to Check:

- [ ] Wallet button shows ₹500.00
- [ ] No console errors
- [ ] localStorage shows `userWallet: "500"` (F12 → Application → Local Storage)

**Expected Result:** ✅ Wallet displays ₹500.00 with proper formatting

---

## Test 2: Wallet Panel Display

**Goal:** Verify wallet panel dropdown shows correct balance and purchase history

### Steps:

1. Click the wallet button (💰₹500.00) in Navbar
2. Panel should open showing:
   - Wallet Balance: **₹500.00**
   - Total Purchases: **0**
   - Recent Purchases: (empty)

### What to Check:

- [ ] Balance displays as ₹500.00
- [ ] Purchase count shows 0
- [ ] Recent purchases list is empty
- [ ] No NaN values anywhere in panel

**Expected Result:** ✅ Wallet panel displays cleanly without NaN

---

## Test 3: Purchase Flow - Balance Sufficient ✓

**Goal:** Verify payment confirmation deducts balance correctly

### Steps:

1. Click "Buy Coupons" in Navbar
2. Click any coupon card (e.g., Amazon ₹299 coupon)
3. On coupon details page, click "Proceed to Payment"
4. **Verification Step:** Verify wallet amount displays:
   - Your Wallet: **₹500.00** ✓
   - Coupon Cost: **₹299.00** ✓
   - Remaining Balance (if purchased): **₹201.00** ✓
   - Status: "✓ Sufficient balance"

### Payment Confirmation:

5. Click the "Copy Coupon Code" button
6. Timer will start (5:00 countdown)
7. **Option A - Manual:** Wait for timer to reach 3:00, then click "Confirm Payment"
8. **Option B - Auto:** Wait for timer to reach 0:00 (auto-confirms)

### Verify Balance Update:

9. After payment confirmed, you should see:
   - Payment Status: "Your payment has been confirmed"
   - "Success! Your coupon code is: AMZN\*\*\*\*"
   - "Remaining Balance: **₹201.00**"

10. Click "Close" and return to home
11. Check Navbar wallet: Should now display **₹201.00**

### What to Check:

- [ ] Wallet shows ₹500.00 before payment
- [ ] Cost displays as ₹299.00
- [ ] Remaining balance shows ₹201.00
- [ ] Status says "✓ Sufficient balance"
- [ ] Click Copy Code to start timer
- [ ] After confirmation: "Remaining Balance: ₹201.00"
- [ ] Navbar wallet updates to ₹201.00
- [ ] No NaN in any calculations
- [ ] localStorage `userWallet: "201"` after purchase

**Expected Result:** ✅ Balance deducted correctly: ₹500 → ₹201

---

## Test 4: Wallet Panel After Purchase

**Goal:** Verify wallet panel updates with purchase history

### Steps:

1. Click wallet button (💰₹201.00)
2. Panel should show:
   - Wallet Balance: **₹201.00**
   - Total Purchases: **1**
   - Recent Purchases:
     - Amazon (₹299) - Purchased a few seconds ago

### What to Check:

- [ ] Balance shows ₹201.00
- [ ] Purchase count shows 1
- [ ] Recent purchases lists the coupon you bought
- [ ] Seller reputation displays correctly
- [ ] No NaN values

**Expected Result:** ✅ Wallet panel reflects purchase and updated balance

---

## Test 5: Multiple Sequential Purchases ✓

**Goal:** Verify wallet correctly deducts multiple times

### Steps:

1. From ₹201.00 balance, buy another coupon
2. Select a coupon that costs ≤ ₹201 (e.g., Flipkart ₹199)
3. Verify wallet displays:
   - Your Wallet: **₹201.00**
   - Cost: **₹199.00**
   - Remaining: **₹2.00**
4. Confirm payment
5. Navbar should update to **₹2.00**
6. Click wallet panel: Total Purchases should show **2**

### What to Check:

- [ ] Second purchase deducts from already-reduced balance
- [ ] Balance calculation is: ₹201 - ₹199 = ₹2.00
- [ ] Panel shows 2 total purchases
- [ ] Both coupons listed in recent purchases
- [ ] No NaN values in any calculation

**Expected Result:** ✅ Multiple deductions work correctly: ₹201 → ₹2

---

## Test 6: Insufficient Balance Scenario ✓

**Goal:** Verify payment button disables when balance is insufficient

### Steps:

1. Now you have ₹2.00 in wallet
2. Try to buy any coupon > ₹2 (all remaining coupons cost more)
3. On coupon details page, observe:
   - Your Wallet: **₹2.00**
   - Cost: **₹XXX.00** (some amount > 2)
   - Status should be: **"❌ Need ₹XXX.00 more"** (showing missing amount)

4. Look for "Proceed to Payment" button - should be **DISABLED**

### What to Check:

- [ ] Wallet displays ₹2.00
- [ ] Cost displays correctly
- [ ] Insufficient balance message shown
- [ ] Amount needed calculated: ₹XXX - ₹2
- [ ] "Proceed to Payment" button is grayed out/disabled
- [ ] Clicking disabled button does nothing
- [ ] No NaN values in calculations

**Expected Result:** ✅ Purchase blocked when insufficient balance

---

## Test 7: localStorage Persistence ✓

**Goal:** Verify wallet persists across page refreshes and browser sessions

### Prerequisites:

- You have just completed Test 6, so wallet is at ₹2.00
- You've purchased 2 coupons

### Steps:

1. **Current State Check:**
   - Navbar shows: **₹2.00**
   - Wallet panel shows: **2 purchases**

2. **Refresh Page (F5):**
   - Page reloads
   - Navbar should STILL show: **₹2.00**
   - Wallet panel should STILL show: **2 purchases**

3. **Check localStorage:**
   - F12 → Application tab → Local Storage
   - Find `userWallet` entry
   - Value should be: **"2"** or **"2.0"** ✓
   - Find `purchasedCoupons` entry
   - Should be JSON array with 2 coupon objects ✓

4. **Close Browser and Reopen:**
   - Completely close the browser tab/window
   - Reopen the app URL
   - Navbar should show: **₹2.00**
   - Wallet panel should show: **2 purchases**

### What to Check:

- [ ] Wallet persists after F5 refresh
- [ ] localStorage userWallet contains "2"
- [ ] localStorage purchasedCoupons contains array with 2 items
- [ ] Wallet still shows ₹2.00 after closing/reopening browser
- [ ] Purchase history preserved across sessions
- [ ] No NaN appears on page reload
- [ ] Console has no errors on reload

**Expected Result:** ✅ Wallet state persists correctly

---

## Test 8: Auto-Payment (Timer Expire)

**Goal:** Verify auto-confirmation when timer reaches 0:00

### Prerequisites:

- Wallet has > ₹99 (so you can afford a ≤₹99 coupon if available, or use a ≤₹2 coupon scenario)
- Or reset wallet by clearing localStorage and restarting with ₹500

### Steps:

1. Clear localStorage and reload (restart with ₹500)
2. Buy a coupon (e.g., ₹99 coupon to have enough for this test)
3. Click "Copy Coupon Code" to start timer
4. **Wait for timer to reach 0:00** (5 minutes = 300 seconds)
   - **OR:** Open Dev Tools Console and run:
     ```javascript
     // Advanced: Skip timer by setting state directly (for testing only)
     // Instead, just wait or manually confirm at 3:00
     ```
5. When timer hits 0:00, auto-confirmation should trigger:
   - Modal appears: "Your payment has been confirmed"
   - Balance decrements automatically
   - No manual button click required

### What to Check:

- [ ] Timer counts down from 5:00 to 0:00
- [ ] At 0:00, auto-confirm triggers automatically
- [ ] Payment confirmation modal appears
- [ ] Balance deducted without manual confirmation
- [ ] Remaining balance calculated correctly
- [ ] Navbar updates balance after auto-confirm
- [ ] No NaN in any values

**Expected Result:** ✅ Timer auto-confirms at 0:00 and deducts balance

---

## Test 9: Manual Confirmation Before Timer Expires

**Goal:** Verify manual "Confirm Payment" button also deducts balance correctly

### Prerequisites:

- Another fresh wallet with ₹500

### Steps:

1. Clear localStorage, restart with ₹500
2. Buy a coupon, click "Copy Coupon Code"
3. Wait ~3 seconds (let timer show 4:57), then click "Confirm Payment" button
4. Modal appears confirming payment
5. Balance should show correctly: ₹500 - cost = ₹XXX

### What to Check:

- [ ] Manual confirm button works
- [ ] Balance deducts immediately (not waiting for timer)
- [ ] Remaining balance calculated correctly
- [ ] No NaN values
- [ ] Navbar updates to new balance
- [ ] Coupon appears in purchase history

**Expected Result:** ✅ Manual confirm deducts balance correctly

---

## Test 10: Console & Network Check

**Goal:** Verify no errors in console during entire flow

### Steps:

1. F12 → Open Developer Tools
2. Go to Console tab
3. Clear any old messages
4. Perform tests 1-9
5. Check console for errors

### What to Check:

- [ ] No red error messages in console
- [ ] No warning about setState in effects (these are lint suggestions)
- [ ] No messages about undefined localStorage items
- [ ] No NaN errors in calculations

**Expected Result:** ✅ Console is clean (no critical errors)

---

## Troubleshooting

### Issue: Wallet still shows ₹NaN

**Solution:**

1. Check F12 Console for errors
2. Clear localStorage: localStorage.clear()
3. Reload page
4. Verify App.jsx has: `const [walletBalance, setWalletBalance] = useState(500);`
5. Check Payment.jsx has: `const price = Number(coupon.price);`

### Issue: Balance not updating after payment

**Solution:**

1. Check F12 Application tab → Local Storage
2. Verify `userWallet` key exists and has updated value
3. In Payment.jsx, verify `handleConfirmPayment` calls `updateWallet(newBalance)`
4. In App.jsx, verify `updateWallet` calls `localStorage.setItem("userWallet", ...)`

### Issue: Wallet panel shows old balance

**Solution:**

1. Verify Navbar receives `walletBalance` prop from App.jsx
2. Check that Navbar renders `{(walletBalance || 0).toFixed(2)}`
3. Make sure `purchasedCoupons` is also passed as prop to Navbar

### Issue: Timer doesn't auto-confirm

**Solution:**

1. Check Payment.jsx useEffect dependency array
2. Verify `handleAutoConfirmPaymentHelper` is properly defined
3. Check that timer effect has `timerStarted && timeRemaining === 0` condition

---

## Summary Checklist

After completing all tests, you should have:

- [ ] ✅ Wallet initialization: ₹500.00 displayed
- [ ] ✅ Balance sufficient: Shows remaining balance calculations
- [ ] ✅ Payment deduction: Balance updates after purchase
- [ ] ✅ Multiple purchases: Deductions compound correctly
- [ ] ✅ Insufficient balance: Button disables when needed
- [ ] ✅ localStorage: Balance persists across refreshes
- [ ] ✅ Auto-pay: Timer triggers at 0:00
- [ ] ✅ Manual confirm: Button works before timer expires
- [ ] ✅ No NaN: All displays show proper numeric formatting
- [ ] ✅ Console clean: No errors during tests

**Final Verdict:**
If all checkboxes pass, the wallet system is working correctly! ✅

---

## Code References

### Key Files Modified:

- **src/App.jsx** - Wallet state centralization and updateWallet() function
- **src/components/Navbar.jsx** - Receives walletBalance prop, defensive formatting
- **src/pages/Payment.jsx** - Numeric coercion in price/balance comparisons
- **src/data/coupons.js** - Sample data with numeric prices

### Critical Code Sections:

**App.jsx - State initialization:**

```javascript
const [walletBalance, setWalletBalance] = useState(500);
const updateWallet = (newBalance) => {
  const numBalance = Number(newBalance) || 0;
  setWalletBalance(numBalance);
  localStorage.setItem("userWallet", numBalance.toString());
};
```

**Navbar.jsx - Display:**

```javascript
<span className="wallet-text">₹{(walletBalance || 0).toFixed(2)}</span>
```

**Payment.jsx - Deduction:**

```javascript
const price = Number(coupon.price);
const balance = Number(walletBalance);
if (balance >= price) {
  updateWallet(balance - price);
}
```
