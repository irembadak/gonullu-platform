const express = require('express');
const router = express.Router();
const { getRecommendation } = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');

/**
 * @route   POST /api/ai/recommend
 * @desc    Kullanıcı lokasyonuna göre AI tabanlı öneriler getir
 * @access  Private
 */
router.post('/recommend', protect, getRecommendation);

module.exports = router;