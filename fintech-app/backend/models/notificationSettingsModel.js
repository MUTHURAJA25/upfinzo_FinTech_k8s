const mongoose = require("mongoose");

const notificationSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  channels: {
    app: {
      common: { type: Boolean, default: true },
      transaction: { type: Boolean, default: true },
      kyc: { type: Boolean, default: true },
      payin: { type: Boolean, default: true },
      payout: { type: Boolean, default: true },
      preference: { type: Boolean, default: true },
    },
    email: {
      common: { type: Boolean, default: true },
      transaction: { type: Boolean, default: true },
      kyc: { type: Boolean, default: true },
      payin: { type: Boolean, default: true },
      payout: { type: Boolean, default: true },
      preference: { type: Boolean, default: true },
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("NotificationSettings", notificationSettingsSchema);
