const express = require('express');
const router = express.Router();
const { getAllUsers, insertUser, updateUser, deleteUser } = require(process.env.VERSION_PATH + 'controllers/' + process.env.CURRENT_VERSION + '/adminController');
const upload = require(process.env.VERSION_PATH +"middleware/upload");
const authenticateToken = require(process.env.VERSION_PATH +'middleware/authMiddleware');

// Routes
router.get('/users', authenticateToken, getAllUsers);
router.get('/users/:id', authenticateToken, getAllUsers);
router.post('/users', authenticateToken, insertUser);
router.put('/users/:id', upload.single("avatar"), authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

module.exports = router;