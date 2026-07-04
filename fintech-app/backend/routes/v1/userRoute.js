const express = require('express');
const router = express.Router();
const authenticateToken = require(process.env.VERSION_PATH + 'middleware/authMiddleware');

// Notifications
const { createNotification, getUserNotifications, markAsRead } = require(process.env.VERSION_PATH + 'controllers/' + process.env.CURRENT_VERSION + '/notificationController');

router.post('/notifications', authenticateToken,createNotification);
router.get('/notifications/:userId', authenticateToken,getUserNotifications);
router.put('/notifications/:id/read', authenticateToken, markAsRead);
//Notification settings
const { 
  getUserNotificationSettings, 
  updateUserNotificationSettings 
} = require(process.env.VERSION_PATH + 'controllers/' + process.env.CURRENT_VERSION + '/notificationSettingsController');

router.get('/notification-settings/:userId', authenticateToken, getUserNotificationSettings);
router.put('/notification-settings/:userId', authenticateToken, updateUserNotificationSettings);

module.exports = router;