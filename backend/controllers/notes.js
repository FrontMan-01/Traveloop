const prisma = require('../prisma/client');

const getNotes = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.id } });
    if (!trip) return res.status(403).json({ success: false, message: 'Access denied or trip not found' });

    const notes = await prisma.note.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' },
      include: { stop: true }
    });
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createNote = async (req, res) => {
  try {
    const { content, tripId, stopId } = req.body;
    
    if (tripId) {
      const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.id } });
      if (!trip) return res.status(403).json({ success: false, message: 'Access denied or trip not found' });
    }

    const note = await prisma.note.create({
      data: { content, tripId, stopId }
    });
    res.json({ success: true, data: note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteCheck = await prisma.note.findUnique({ where: { id: req.params.id }, include: { trip: true } });
    if (!noteCheck || noteCheck.trip.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await prisma.note.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getNotes, createNote, deleteNote };
