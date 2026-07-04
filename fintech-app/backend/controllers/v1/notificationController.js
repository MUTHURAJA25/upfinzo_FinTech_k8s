const notificationModel = require(process.env.VERSION_PATH + '/models/notificationModel');

// Create notification
exports.createNotification = async (req, res) => {
  try {
    if (!req.body.category) {
      req.body.category = 'common';
    }
    const notification = await notificationModel.create(req.body);
    res.status(201).json({
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
     const filter = { userId: req.params.userId };
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const notifications = await notificationModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
        message: 'Notifications fetched successfully',
        data: notifications,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await notificationModel.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
     res.status(200).json({
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
