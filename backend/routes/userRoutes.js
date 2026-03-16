const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    getUserByUid, 
    registerFCMToken, 
    updateMyProfile,
    getMe,
    requestStkStatus, 
    approveStkRequest  
} = require("../controllers/userController");

const { protect, roleAuth } = require("../middlewares/auth"); 

// Herkese açık rotalar
router.post("/register", registerUser); 
router.get("/by-uid/:uid", getUserByUid);

// Giriş zorunlu rotalar
router.use(protect); 

// Profil işlemleri
router.get("/me", getMe); // /api/users/me (Daha standart bir isim)
router.get("/profile", getMe); // Yedek olarak dursun
router.put("/profile", updateMyProfile); // /api/users/profile

// Yetki işlemleri
router.post("/request-stk", requestStkStatus);
router.post("/approve-stk", roleAuth(['admin']), approveStkRequest); // Sadece admin onaylayabilir

// Bildirim işlemleri
router.post("/register-fcm-token", registerFCMToken);

module.exports = router;