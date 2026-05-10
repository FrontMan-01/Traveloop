const prisma = require('../prisma/client');

const createStop = async (req, res) => {
  try {
    const { cityName, country, startDate, endDate, orderIndex, tripId } = req.body;
    
    const trip = await prisma.trip.findUnique({ where: { id: tripId, userId: req.user.id } });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found or access denied' });

    const stop = await prisma.stop.create({
      data: {
        cityName,
        country,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        orderIndex: orderIndex || 0,
        tripId
      }
    });
    res.json({ success: true, data: stop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateStop = async (req, res) => {
  try {
    const { cityName, country, startDate, endDate, orderIndex } = req.body;
    
    // Check if user owns the trip this stop belongs to
    const stopCheck = await prisma.stop.findUnique({ where: { id: req.params.id }, include: { trip: true } });
    if (!stopCheck || stopCheck.trip.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const stop = await prisma.stop.update({
      where: { id: req.params.id },
      data: { cityName, country, startDate: startDate ? new Date(startDate) : undefined, endDate: endDate ? new Date(endDate) : undefined, orderIndex }
    });
    res.json({ success: true, data: stop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteStop = async (req, res) => {
  try {
    const stopCheck = await prisma.stop.findUnique({ where: { id: req.params.id }, include: { trip: true } });
    if (!stopCheck || stopCheck.trip.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await prisma.stop.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Stop deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createStop, updateStop, deleteStop };
