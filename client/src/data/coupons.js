const coupons = [
  {
    id: 1,
    brand: "Amazon",
    couponName: "Summer Sale Discount",
    platform: "Amazon",
    discount: "20% OFF",
    discountPercentage: 20,
    expiry: "Ending Soon",
    seller: "John Seller",
    price: 299,
    encryptedCode: "U0FWRTIw", // SAVE20
    flagged: false,
    sellerReputation: 4.8,
  },

  {
    id: 2,
    brand: "Flipkart",
    couponName: "Fashion Mega Sale",
    platform: "Flipkart",
    discount: "10% OFF",
    discountPercentage: 10,
    expiry: "5 days left",
    seller: "Fashion Hub",
    price: 149,
    encryptedCode: "RkxJUDEw", // FLIP10
    flagged: false,
    sellerReputation: 4.5,
  },

  {
    id: 3,
    brand: "Myntra",
    couponName: "Clothing Clearance",
    platform: "Myntra",
    discount: "30% OFF",
    discountPercentage: 30,
    expiry: "2 days left",
    seller: "Dhruv Clothing Co",
    price: 199,
    encryptedCode: "TllUUjMw", // YTPR30
    flagged: true,
    sellerReputation: 2.1,
  },

  {
    id: 4,
    brand: "PhonePe",
    couponName: "UPI Cashback Offer",
    platform: "PhonePe",
    discount: "₹50 Cashback",
    discountPercentage: 5,
    expiry: "Ending Soon",
    seller: "Mobile Payments Ltd",
    price: 99,
    encryptedCode: "UEgtQ0JTSDM=", // PH-CBS3
    flagged: false,
    sellerReputation: 4.9,
  },
];

export default coupons;
