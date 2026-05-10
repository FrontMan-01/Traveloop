const prisma = require('../prisma/client');

const getChecklist = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const checklist = await prisma.checklistItem.findMany({ where: { tripId, userId: req.user.id } });
    res.json({ success: true, data: checklist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createChecklistItem = async (req, res) => {
  try {
    const { name, category, tripId } = req.body;
    
    const item = await prisma.checklistItem.create({
      data: { name, category, tripId, userId: req.user.id }
    });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const toggleChecklistItem = async (req, res) => {
  try {
    const itemCheck = await prisma.checklistItem.findUnique({ where: { id: req.params.id } });
    if (!itemCheck || itemCheck.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const item = await prisma.checklistItem.update({
      where: { id: req.params.id },
      data: { isPacked: !itemCheck.isPacked }
    });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteChecklistItem = async (req, res) => {
  try {
    const itemCheck = await prisma.checklistItem.findUnique({ where: { id: req.params.id } });
    if (!itemCheck || itemCheck.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await prisma.checklistItem.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getChecklist, createChecklistItem, toggleChecklistItem, deleteChecklistItem };
