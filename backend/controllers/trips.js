const prisma = require('../prisma/client');

const getAllTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      include: { stops: true }
    });
    res.json({ success: true, data: trips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPublicTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { isPublic: true },
      include: { user: { select: { firstName: true, lastName: true } }, stops: true }
    });
    res.json({ success: true, data: trips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { id: req.params.id, OR: [{ userId: req.user.id }, { isPublic: true }] },
      include: { stops: { include: { activities: true } }, budgets: true }
    });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createTrip = async (req, res) => {
  try {
    const { name, description, coverPhoto, startDate, endDate, isPublic } = req.body;
    const trip = await prisma.trip.create({
      data: {
        name,
        description,
        coverPhoto,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isPublic: isPublic || false,
        userId: req.user.id
      }
    });
    res.json({ success: true, data: trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateTrip = async (req, res) => {
  try {
    const { name, description, coverPhoto, startDate, endDate, status } = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id, userId: req.user.id },
      data: { name, description, coverPhoto, startDate: startDate ? new Date(startDate) : undefined, endDate: endDate ? new Date(endDate) : undefined, status }
    });
    res.json({ success: true, data: trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteTrip = async (req, res) => {
  try {
    await prisma.trip.delete({
      where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const togglePublic = async (req, res) => {
  try {
    const { isPublic } = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id, userId: req.user.id },
      data: { isPublic }
    });
    res.json({ success: true, data: trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllTrips, getPublicTrips, getTripById, createTrip, updateTrip, deleteTrip, togglePublic };
