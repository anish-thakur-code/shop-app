const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin: get all users
router.get("/", protect, admin, getAllUsers);

module.exports = router;
