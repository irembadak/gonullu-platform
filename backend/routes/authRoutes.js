const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { login, firebaseLogin, getAllUsersAdmin, syncManual } = require("../controllers/authController");
const { protect, roleAuth } = require("../middlewares/auth");
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 20, // IP başına 20 deneme
  message: { success: false, message: "Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyiniz." }
});
router.post("/login", authLimiter, login);
router.post("/firebase-login", authLimiter, firebaseLogin);
router.get('/users', protect, roleAuth('admin'), getAllUsersAdmin);
router.post('/sync', protect, roleAuth('admin'), syncManual);

module.exports = router;