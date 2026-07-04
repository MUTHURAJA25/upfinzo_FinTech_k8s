const mongoose = require("mongoose");

const PaymentLinkSchema = new mongoose.Schema({
  merchant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
    required: true
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"    // staff/admin (optional)
  },

  amount: {
    type: Number,
    required: true
  },

  customer_name: { type: String },
  customer_email: { type: String },
  customer_phone: { type: String },

  description: { type: String },

  expiry_date: { type: Date },

  // YOUR APP WILL CREATE URL LIKE: https://yourdomain.com/pay/:token
  token: { 
    type: String, 
    unique: true,
    required: true 
  },

  status: {
    type: String,
    enum: ["created", "sent", "opened", "paid", "expired", "failed"],
    default: "created"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PaymentLink", PaymentLinkSchema);
