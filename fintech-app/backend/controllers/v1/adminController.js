const userModel = require(process.env.VERSION_PATH + '/models/userModel');
const path = require("path");
const fileSystem = require("fs");

// Helper function for base64 file upload
const saveBase64Image = (base64String) => {
  const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 file format");
  }

  const mimeType = matches[1];
  const ext = mimeType.split("/")[1].toLowerCase();
  const base64Data = matches[2];
  const allowedTypes = ["jpg", "jpeg", "png"];

  if (!allowedTypes.includes(ext)) {
    throw new Error("Only image files (jpg, jpeg, png) are allowed");
  }

  const fileName = `${Date.now()}.${ext}`;
  const uploadDir = path.join(__dirname, "..", "public", "uploads");

  if (!fileSystem.existsSync(uploadDir)) {
    fileSystem.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  fileSystem.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

  return `/uploads/${fileName}`;
};

// Get all users or by ID/email
const getAllUsers = async (req, res) => {
  try {
    const { id, email } = req.params;
    let users;

    if (email) {
      users = await userModel.findOne({ email }).select('-password');
    } else if (id) {
      users = await userModel.findById(id).select('-password');
    } else {
      users = await userModel.find({}).select('-password');
    }

    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User(s) fetched successfully',
      data: users,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insert user
const insertUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    //TODO Need to add validation

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let attachment = null;
    if (avatar) {
      attachment = saveBase64Image(avatar);
    }

    const user = await userModel.create({
      first_name: name,
      email,
      password,
      avatar: attachment,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.first_name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
     const id = req.params.id;
    const { address, first_name, last_name } = req.body;
    const user = await userModel.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.address = address;
    user.first_name = first_name;
    user.last_name = last_name;

    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      message: 'User deleted successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  insertUser,
  updateUser,
  deleteUser,
};
