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
router.post("/register", registerUser); 
router.get("/by-uid/:uid", getUserByUid);
router.use(protect); 
router.get("/me", getMe); 
router.get("/profile", getMe); 
router.put("/profile", updateMyProfile); 

router.post("/request-stk", requestStkStatus);
router.post("/approve-stk", roleAuth(['admin']), approveStkRequest); 
router.post("/register-fcm-token", registerFCMToken);

module.exports = router;