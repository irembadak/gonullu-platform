const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { sendNotification } = require('../controllers/notificationController');
const { protect, roleAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate'); // Senin kendi validate middleware'in

/**
 * @route   POST /api/notifications/send
 * @desc    Belirli bir kullanıcıya veya tüm platforma bildirim gönder
 * @access  Private (Sadece STK ve Admin)
 */
router.post('/send', 
  protect, 
  roleAuth(['stk', 'admin']), 
  validate([
    body('userId').if(body('isBroadcast').equals('false')).isMongoId().withMessage('Geçerli bir kullanıcı ID gereklidir'),
    body('title').notEmpty().withMessage('Bildirim başlığı boş olamaz'),
    body('body').notEmpty().withMessage('Bildirim içeriği boş olamaz'),
    body('isBroadcast').optional().isBoolean(),
    body('data').optional().isObject()
  ]),
  sendNotification
);

module.exports = router;