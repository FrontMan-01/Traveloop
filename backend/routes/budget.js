const express = require('express');
const { getBudget, createBudget, deleteBudget } = require('../controllers/budget');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/:tripId', authMiddleware, getBudget);
router.post('/', authMiddleware, createBudget);
router.delete('/:id', authMiddleware, deleteBudget);

module.exports = router;
