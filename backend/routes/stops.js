const express = require('express');
const { createStop, updateStop, deleteStop } = require('../controllers/stops');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createStop);
router.put('/:id', authMiddleware, updateStop);
router.delete('/:id', authMiddleware, deleteStop);

module.exports = router;
