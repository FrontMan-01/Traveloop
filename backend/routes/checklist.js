const express = require('express');
const { getChecklist, createChecklistItem, toggleChecklistItem, deleteChecklistItem } = require('../controllers/checklist');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/:tripId', authMiddleware, getChecklist);
router.post('/', authMiddleware, createChecklistItem);
router.patch('/:id/toggle', authMiddleware, toggleChecklistItem);
router.delete('/:id', authMiddleware, deleteChecklistItem);

module.exports = router;
