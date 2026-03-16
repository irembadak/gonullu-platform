const express = require('express');
const router = express.Router();
const {
  createEmergency,
  getEmergencies,
  updateEmergencyStatus 
} = require('../controllers/emergencyController');
const { protect, roleAuth } = require('../middlewares/auth');

/**
 * @route   /api/emergencies
 */
router.route('/')
  .post(protect, createEmergency)
  .get(protect, roleAuth('admin'), getEmergencies);

/**
 * @route   /api/emergencies/:id
 */
router.route('/:id')
  .patch(protect, roleAuth('admin'), updateEmergencyStatus);

module.exports = router;