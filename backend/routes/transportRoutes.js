const express = require('express');
const router = express.Router();
const { 
    createTransport, 
    getTransportList, 
    getTransport, 
    updateTransport, 
    deleteTransport 
} = require('../controllers/transportController');

const { protect } = require('../middlewares/auth');
router.get('/offers', (req, res, next) => { req.query.type = 'offer'; next(); }, getTransportList);
router.get('/requests', (req, res, next) => { req.query.type = 'request'; next(); }, getTransportList);

/**
 * @route   /api/transport
 */
router.route('/')
    .post(protect, createTransport)
    .get(getTransportList);

/**
 * @route   /api/transport/:id
 */
router.route('/:id')
    .get(getTransport)
    .patch(protect, updateTransport)
    .delete(protect, deleteTransport);

module.exports = router;