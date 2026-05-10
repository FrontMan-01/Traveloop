const prisma = require('../prisma/client');

const getBudget = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.id } });
    if (!trip) return res.status(403).json({ success: false, message: 'Access denied or trip not found' });

    const budgets = await prisma.budget.findMany({ where: { tripId } });
    res.json({ success: true, data: budgets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createBudget = async (req, res) => {
  try {
    const { category, amount, description, tripId } = req.body;
    
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.id } });
    if (!trip) return res.status(403).json({ success: false, message: 'Access denied or trip not found' });

    const budget = await prisma.budget.create({
      data: { category, amount: parseFloat(amount), description, tripId }
    });
    res.json({ success: true, data: budget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budgetCheck = await prisma.budget.findUnique({ where: { id: req.params.id }, include: { trip: true } });
    if (!budgetCheck || budgetCheck.trip.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await prisma.budget.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Budget item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getBudget, createBudget, deleteBudget };
