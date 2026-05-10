const express = require('express');
const { getAllTrips, getPublicTrips, getTripById, createTrip, updateTrip, deleteTrip, togglePublic } = require('../controllers/trips');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/public', getPublicTrips);
router.get('/', authMiddleware, getAllTrips);
router.get('/:id', authMiddleware, getTripById);
router.post('/', authMiddleware, createTrip);
router.put('/:id', authMiddleware, updateTrip);
router.delete('/:id', authMiddleware, deleteTrip);
router.patch('/:id/share', authMiddleware, togglePublic);

module.exports = router;
