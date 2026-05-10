import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { MapPin, Calendar, Clock, Edit, Share2, DollarSign, Activity, IndianRupee } from 'lucide-react';

const ItineraryView = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!trip) return <div className="text-center py-20 text-xl font-medium text-gray-500">Trip not found.</div>;

  // Budget calculations
  const defaultBudgets = [
    { name: 'Activities', value: 0, color: '#8B5CF6' },
    { name: 'Food', value: 0, color: '#F59E0B' },
    { name: 'Stay', value: 0, color: '#10B981' },
    { name: 'Transport', value: 0, color: '#3B82F6' },
  ];

  let chartData = [...defaultBudgets];
  let totalCost = 0;

  if (trip.budgets && trip.budgets.length > 0) {
    chartData = trip.budgets.map(b => ({
      name: b.category,
      value: Number(b.amount),
      color: b.category === 'activities' ? '#8B5CF6' : b.category === 'food' ? '#F59E0B' : b.category === 'stay' ? '#10B981' : '#3B82F6'
    }));
    totalCost = chartData.reduce((sum, item) => sum + item.value, 0);
  }

  const sortedStops = [...(trip.stops || [])].sort((a,b) => a.order - b.order);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
      
      {/* Header Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary-100 mb-8 relative">
        <div className="h-48 md:h-64 relative">
          <img src={trip.coverPhoto || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'} alt={trip.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex gap-2 mb-3">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 uppercase tracking-wide">
                  {trip.status}
                </span>
                {trip.isPublic && (
                  <span className="bg-primary-500/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">PUBLIC</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{trip.name}</h1>
              <p className="text-gray-200 flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/30 transition">
                <Share2 className="h-5 w-5" />
              </button>
              <Link to={`/trips/${trip.id}/build`} className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm">
                <Edit className="h-4 w-4" /> Edit
              </Link>
            </div>
          </div>
        </div>
        
        {/* Quick actions bar */}
        <div className="bg-white px-6 py-4 border-t border-gray-100 flex gap-6 overflow-x-auto hide-scrollbar">
          <Link to={`/trips/${trip.id}/checklist`} className="text-sm font-semibold text-gray-600 hover:text-primary-600 transition whitespace-nowrap">Packing List</Link>
          <Link to={`/trips/${trip.id}/notes`} className="text-sm font-semibold text-gray-600 hover:text-primary-600 transition whitespace-nowrap">Trip Notes</Link>
          <Link to={`/trips/${trip.id}/invoice`} className="text-sm font-semibold text-gray-600 hover:text-primary-600 transition whitespace-nowrap">Export PDF</Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Timeline */}
        <div className="w-full lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Itinerary</h2>
          </div>

          {sortedStops.length > 0 ? (
            <div className="relative border-l-2 border-primary-200 ml-4 md:ml-6 space-y-10 pb-4">
              {sortedStops.map((stop, idx) => (
                <div key={stop.id} className="relative pl-8 md:pl-10">
                  {/* Timeline Node */}
                  <div className="absolute -left-3.5 md:-left-3.5 top-1 h-7 w-7 rounded-full bg-primary-600 border-4 border-white shadow-sm flex items-center justify-center">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Stop Label */}
                  <div className="mb-4">
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                      Day {idx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary-500" /> {stop.city}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(stop.arrivalDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Activities list */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 overflow-hidden">
                    {stop.activities && stop.activities.length > 0 ? (
                      <div className="divide-y divide-gray-50">
                        {stop.activities.map((act, i) => (
                          <div key={i} className="p-4 hover:bg-gray-50 transition flex items-start gap-4">
                            <div className="bg-primary-50 text-primary-600 p-2 rounded-lg mt-0.5">
                              <Activity className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{act.name}</h4>
                              <div className="flex gap-3 mt-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                <span>{act.type}</span>
                                {act.cost > 0 && <span className="text-amber-600 flex items-center"><IndianRupee className="h-3 w-3" />{act.cost}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-400 text-sm italic">
                        No specific activities logged for this stop.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
              <p className="text-gray-500 mb-4">You haven't added any stops yet.</p>
              <Link to={`/trips/${trip.id}/build`} className="text-primary-600 font-bold hover:underline">Start building itinerary</Link>
            </div>
          )}
        </div>

        {/* Right: Budget Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl border border-primary-100 shadow-sm p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary-500" /> Budget Summary
            </h3>
            
            <div className="h-48 w-full mb-6 relative">
              {totalCost > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <RechartsTooltip formatter={(value) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</span>
                    <span className="text-xl font-bold text-gray-900">₹{totalCost}</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-full border-4 border-dashed border-gray-200">
                  <span className="text-gray-400 text-sm font-medium">No budget data</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600 font-medium capitalize">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-900">Grand Total</span>
              <span className="text-xl font-black text-amber-600">₹{totalCost}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ItineraryView;
