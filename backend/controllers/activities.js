const prisma = require('../prisma/client');

const getActivities = async (req, res) => {
  try {
    const { stopId } = req.query;
    if (!stopId) return res.status(400).json({ success: false, message: 'stopId query param is required' });

    const activities = await prisma.activity.findMany({
      where: { stopId }
    });
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createActivity = async (req, res) => {
  try {
    const { name, description, type, cost, duration, timeSlot, stopId } = req.body;
    
    // Check if user owns the trip
    const stop = await prisma.stop.findUnique({ where: { id: stopId }, include: { trip: true } });
    if (!stop || stop.trip.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const activity = await prisma.activity.create({
      data: { name, description, type, cost: cost || 0, duration, timeSlot, stopId }
    });
    res.json({ success: true, data: activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { name, description, type, cost, duration, timeSlot } = req.body;
    
    const activityCheck = await prisma.activity.findUnique({ where: { id: req.params.id }, include: { stop: { include: { trip: true } } } });
    if (!activityCheck || activityCheck.stop.trip.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const activity = await prisma.activity.update({
      where: { id: req.params.id },
      data: { name, description, type, cost, duration, timeSlot }
    });
    res.json({ success: true, data: activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activityCheck = await prisma.activity.findUnique({ where: { id: req.params.id }, include: { stop: { include: { trip: true } } } });
    if (!activityCheck || activityCheck.stop.trip.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await prisma.activity.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Activity deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getActivities, createActivity, updateActivity, deleteActivity };
