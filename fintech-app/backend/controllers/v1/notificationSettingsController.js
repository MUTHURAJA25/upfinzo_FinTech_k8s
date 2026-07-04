const notificationSettingsModel = require(process.env.VERSION_PATH + '/models/notificationSettingsModel');
const notificationModel = require(process.env.VERSION_PATH + '/models/notificationModel');
const { sendEmail } = require(process.env.VERSION_PATH + '/utils/mailer');
const User = require(process.env.VERSION_PATH + '/models/userModel');
const ejs = require('ejs');
const path = require('path');
const viewsPath = (fileName) => {
  return path.resolve(__dirname, process.env.VERSION_PATH, "views", "emails", fileName);
};
// Get settings for a user
exports.getUserNotificationSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = await notificationSettingsModel.findOne({ userId });

    if (!settings) {
      return res.status(404).json({ message: "Notification settings not found" });
    }

    res.status(200).json({
      message: "Notification settings fetched successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update settings for a user
exports.updateUserNotificationSettings = async (req, res) => {
  try {
     
    const { userId } = req.params;
    const updates = req.body;
    if (!updates || typeof updates !== "object" || Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Update payload cannot be empty",
      });
    }
       const mongoUpdates = {};
       if (updates.app) {
          Object.keys(updates.app).forEach(key => {
            mongoUpdates[`channels.app.${key}`] = updates.app[key];
          });
        }

        if (updates.email) {
          Object.keys(updates.email).forEach(key => {
            mongoUpdates[`channels.email.${key}`] = updates.email[key];
          });
        }

    const settings = await notificationSettingsModel.findOneAndUpdate(
      { userId },
      { $set: mongoUpdates },
      { new: true, upsert: true }
    );
     // Create a system notification about settings change
    await notificationModel.create({
      userId,
      title: "Notification Preferences Updated",
      message: "Your notification settings have been successfully updated.",
      category: "preference",
      type: "info"
    });
    
    const user = await User.findById(userId);
  
    if (user && user.email) {
      const emailContent = await ejs.renderFile(
        viewsPath('notificationSettingsUpdated.ejs'),
        { name: user.name || 'User' }
      );
       
      // Send email
      await sendEmail(
        user.email,
        "Notification Preferences Updated",
        emailContent
      );
    }
    res.status(200).json({
      message: "Notification settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
