const express = require('express');
const { getNotes, createNote, deleteNote } = require('../controllers/notes');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/:tripId', authMiddleware, getNotes);
router.post('/', authMiddleware, createNote);
router.delete('/:id', authMiddleware, deleteNote);

module.exports = router;
