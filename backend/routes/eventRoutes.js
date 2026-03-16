const express = require('express');
const router = express.Router();
const { protect, roleAuth } = require('../middlewares/auth'); 
const { createEvent, getEvents, getEventById,joinEvent, approveEvent, rejectEvent, getPendingEvents } = require('../controllers/eventController');

router.use(protect);

router.route('/')
  .get(getEvents) 
  .post(roleAuth(['stk', 'admin']), createEvent); 
  router.get('/:id', getEventById);

router.post('/:id/join', roleAuth('volunteer'), joinEvent); 
router.get('/admin/pending', roleAuth('admin'), getPendingEvents);
router.patch('/:id/approve', roleAuth('admin'), approveEvent);
router.patch('/:id/reject', roleAuth('admin'), rejectEvent);

module.exports = router;