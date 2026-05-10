const express = require('express');
const { getActivities, createActivity, updateActivity, deleteActivity } = require('../controllers/activities');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, getActivities);
router.post('/', authMiddleware, createActivity);
router.put('/:id', authMiddleware, updateActivity);
router.delete('/:id', authMiddleware, deleteActivity);

module.exports = router;
