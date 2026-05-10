import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { ChevronRight, GripVertical, MapPin, Calendar, Plus, Trash2, Save, IndianRupee, Activity as ActivityIcon } from 'lucide-react';

const ItineraryBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data.data);
      
      if (res.data.data.stops && res.data.data.stops.length > 0) {
        // Map backend data to local state
        const loadedStops = res.data.data.stops.map(s => ({
          ...s,
          activities: s.activities || [],
          // Convert first activity to text for simple UI, or keep as array
          activityText: s.activities.map(a => a.name).join('\n') || '',
          activityType: s.activities[0]?.type || 'sightseeing',
          budget: res.data.data.budgets?.find(b => b.category === 'activities')?.amount || 0 // simplification
        }));
        setStops(loadedStops.sort((a,b) => a.order - b.order));
      } else {
        // Init empty
        handleAddStop();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStop = () => {
    setStops([...stops, { 
      id: `temp-${Date.now()}`, 
      city: '', 
      arrivalDate: trip?.startDate ? trip.startDate.split('T')[0] : '', 
      departureDate: trip?.endDate ? trip.endDate.split('T')[0] : '', 
      order: stops.length,
      activityText: '',
      activityType: 'sightseeing',
      budget: 0
    }]);
  };

  const handleStopChange = (index, field, value) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    setStops(newStops);
  };

  const handleDeleteStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Very basic implementation: Delete all existing stops/activities/budgets and recreate
      // In production, you'd use PATCH and proper diffing
      const stopPromises = stops.map(async (stop, idx) => {
        // 1. Create stop
        const stopRes = await api.post(`/stops`, {
          cityName: stop.city,
          country: '',
          startDate: stop.arrivalDate || new Date(),
          endDate: stop.departureDate || new Date(),
          orderIndex: idx,
          tripId: id
        });
        const stopId = stopRes.data.data.id;

        // 2. Create activities
        if (stop.activityText) {
          const acts = stop.activityText.split('\n').filter(a => a.trim());
          for (let a of acts) {
            await api.post(`/activities`, {
              stopId,
              name: a,
              type: stop.activityType,
              cost: 0,
              duration: null
            });
          }
        }

        // 3. Add to budget
        if (stop.budget > 0) {
          await api.post(`/budget`, {
            tripId: id,
            category: 'activities',
            amount: Number(stop.budget),
            notes: `Budget for ${stop.city}`
          });
        }
      });

      await Promise.all(stopPromises);
      navigate(`/trips/${id}/view`);
    } catch (err) {
      console.error(err);
      alert('Failed to save itinerary');
    } finally {
      setSaving(false);
    }
  };

  const totalBudget = stops.reduce((acc, stop) => acc + Number(stop.budget || 0), 0);
  const types = ['sightseeing', 'food', 'transport', 'stay', 'adventure'];

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="pb-32 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
          <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/trips" className="hover:text-primary-600">My Trips</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-900">Build Itinerary</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{trip?.name}</h1>
      </div>

      {/* Builder Flow */}
      <div className="relative space-y-6">
        {/* Dashed background line */}
        <div className="absolute left-6 top-10 bottom-10 w-px border-l-2 border-dashed border-primary-200 z-0 hidden md:block"></div>

        {stops.map((stop, index) => (
          <div key={stop.id} className="relative z-10 flex gap-4 md:gap-6 group">
            
            {/* Number Indicator */}
            <div className="hidden md:flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-white border-2 border-primary-400 flex items-center justify-center text-primary-700 font-bold text-lg shadow-sm group-hover:bg-primary-50 transition-colors">
                {index + 1}
              </div>
            </div>

            {/* Card */}
            <div className="flex-1 bg-white rounded-2xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-l-primary-500">
              
              {/* Row 1: Location & Dates */}
              <div className="flex flex-col sm:flex-row gap-4 mb-5 items-start sm:items-center">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-400" /></div>
                    <input 
                      type="text" 
                      placeholder="City or location name" 
                      className="pl-10 w-full px-3 py-2 border-b-2 border-gray-100 focus:border-primary-500 outline-none transition font-semibold text-lg text-gray-900 bg-transparent"
                      value={stop.city}
                      onChange={(e) => handleStopChange(index, 'city', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none"><Calendar className="h-3 w-3 text-gray-400" /></div>
                    <input type="date" className="pl-7 w-full sm:w-36 px-2 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400" value={stop.arrivalDate} onChange={(e) => handleStopChange(index, 'arrivalDate', e.target.value)} />
                  </div>
                  <span className="text-gray-400">—</span>
                  <div className="relative flex-1 sm:flex-none">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none"><Calendar className="h-3 w-3 text-gray-400" /></div>
                    <input type="date" className="pl-7 w-full sm:w-36 px-2 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400" value={stop.departureDate} onChange={(e) => handleStopChange(index, 'departureDate', e.target.value)} />
                  </div>
                </div>

                <div className="hidden sm:block cursor-grab text-gray-300 hover:text-gray-500 px-2"><GripVertical className="h-5 w-5" /></div>
              </div>

              {/* Row 2: Activities Textarea */}
              <div className="mb-5 bg-gray-50 rounded-xl p-1 border border-gray-100 relative">
                <textarea 
                  rows="3"
                  className="w-full bg-transparent px-4 py-3 outline-none resize-none text-gray-700 text-sm"
                  placeholder="What will you do here? (E.g. Visit museum, dinner at Plaza...)"
                  value={stop.activityText}
                  onChange={(e) => handleStopChange(index, 'activityText', e.target.value)}
                ></textarea>
                <div className="absolute top-3 right-3 text-gray-300"><ActivityIcon className="h-5 w-5" /></div>
              </div>

              {/* Row 3: Budget & Tags */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {types.map(t => (
                    <button 
                      key={t}
                      onClick={() => handleStopChange(index, 'activityType', t)}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${stop.activityType === t ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-32">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IndianRupee className="h-4 w-4 text-gray-400" /></div>
                    <input 
                      type="number" 
                      placeholder="Budget" 
                      className="pl-8 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-medium"
                      value={stop.budget}
                      onChange={(e) => handleStopChange(index, 'budget', e.target.value)}
                    />
                  </div>
                  
                  <button onClick={() => handleDeleteStop(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete Stop">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* Add Button */}
        <div className="relative z-10 flex gap-6 md:pl-16 mt-2">
          <button 
            onClick={handleAddStop}
            className="w-full border-2 border-dashed border-primary-200 text-primary-600 bg-primary-50/30 hover:bg-primary-50 hover:border-primary-400 rounded-2xl py-4 flex items-center justify-center gap-2 font-semibold transition-all duration-200 group"
          >
            <div className="bg-primary-100 p-1 rounded-full group-hover:bg-primary-200 transition-colors">
              <Plus className="h-5 w-5" />
            </div>
            Add Another Stop
          </button>
        </div>
      </div>

      {/* Sticky Save Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom-full duration-500">
        <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center max-w-5xl">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Stops</p>
              <p className="text-lg font-bold text-gray-900">{stops.length}</p>
            </div>
            <div className="h-10 w-px bg-gray-200"></div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Est. Budget</p>
              <p className="text-lg font-bold text-amber-600 flex items-center"><IndianRupee className="h-4 w-4 mr-0.5" />{totalBudget}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSave} 
            disabled={saving || stops.length === 0}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-md disabled:opacity-50 flex items-center gap-2 active:scale-95"
          >
            {saving ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Save className="h-5 w-5" /> Save Itinerary</>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ItineraryBuilder;
