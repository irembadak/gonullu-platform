const express = require('express');
const { createOrganization } = require('../controllers/organizationController');
const router = express.Router();

router.post('/', createOrganization);

module.exports = router;