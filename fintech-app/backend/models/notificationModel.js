const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    default: 'info'
  },
    category: {
      type: String,
      enum: ['kyc', 'transaction', 'payout', 'payin', 'preference', 'common'],
      default: 'common'
    }
  },
 { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
