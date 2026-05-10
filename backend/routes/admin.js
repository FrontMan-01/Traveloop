const express = require('express');
const { getAdminStats } = require('../controllers/admin');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authMiddleware, adminMiddleware, getAdminStats);

module.exports = router;
