const mongoose = require("mongoose");

const merchantPayoutSettingsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    default_bank_account: {
      account_number: {
        type: String,
        required: function () {
          return this.payout_method === "NEFT";
        },
        trim: true,
      },
      ifsc: {
        type: String,
        required: function () {
          return this.payout_method === "NEFT";
        },
        uppercase: true,
        match: /^[A-Z]{4}0[A-Z0-9]{6}$/ 
      },
      holder_name: {
        type: String,
        required: function () {
          return this.payout_method === "NEFT";
        },
        trim: true,
      },
      bank_name: {
        type: String,
        required: function () {
          return this.payout_method === "NEFT";
        },
        trim: true,
      }
    },
    payout_frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
      required: true,
    },
    payout_method: {
      type: String,
      enum: ["NEFT", "UPI"],
      default: "NEFT",
      required: true,
    },
    upi_id: {
      type: String,
      required: function () {
        return this.payout_method === "UPI";
      },
      trim: true,
    },
    is_default: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("marchantpayoutSettings", merchantPayoutSettingsSchema);

merchantPayoutSettingsSchema.index(
  { user_id: 1, is_default: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { is_default: true } 
  }
);