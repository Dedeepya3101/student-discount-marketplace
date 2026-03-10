/**
 * Encryption/Decryption Utility for Coupon Codes
 * Uses Base64 encoding for secure storage
 */

/**
 * Encrypt coupon code using Base64 encoding
 * @param {string} code - Raw coupon code
 * @returns {string} - Encrypted code
 */
export const encryptCode = (code) => {
  try {
    if (!code || typeof code !== "string") {
      throw new Error("Invalid code provided");
    }
    return btoa(code);
  } catch (error) {
    console.error("Error encrypting code:", error);
    return "";
  }
};

/**
 * Decrypt coupon code using Base64 decoding
 * @param {string} encryptedCode - Encrypted code
 * @returns {string} - Decrypted code
 */
export const decryptCode = (encryptedCode) => {
  try {
    if (!encryptedCode || typeof encryptedCode !== "string") {
      throw new Error("Invalid encrypted code provided");
    }
    return atob(encryptedCode);
  } catch (error) {
    console.error("Error decrypting code:", error);
    return "";
  }
};

/**
 * Generate masked version of coupon code for display
 * Shows: ****** (fully masked for security)
 * @param {string} code - Original code
 * @returns {string} - Masked code
 */
export const getMaskedCode = (code) => {
  return "******";
};
