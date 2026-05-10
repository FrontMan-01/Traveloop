const prisma = require('../prisma/client');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    
    // Top 5 cities logic
    const stops = await prisma.stop.groupBy({
      by: ['cityName'],
      _count: { cityName: true },
      orderBy: { _count: { cityName: 'desc' } },
      take: 10
    });

    const topCities = stops.map(stop => ({
      city: stop.cityName,
      visits: stop._count.cityName
    }));

    // Trips per month logic
    // Using a raw query or fetching all and grouping in JS since Prisma groupBy on Dates needs workarounds
    const trips = await prisma.trip.findMany({
      select: { createdAt: true }
    });
    
    const tripsPerMonthRaw = trips.reduce((acc, trip) => {
      const month = trip.createdAt.toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const tripsPerMonth = Object.keys(tripsPerMonthRaw).map(month => ({
      month,
      count: tripsPerMonthRaw[month]
    }));

    // Budgets breakdown overall
    const budgets = await prisma.budget.groupBy({
      by: ['category'],
      _sum: { amount: true }
    });

    const budgetBreakdown = budgets.map(b => ({
      category: b.category,
      total: b._sum.amount
    }));

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTrips,
        topCities,
        tripsPerMonth,
        budgetBreakdown
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAdminStats };
