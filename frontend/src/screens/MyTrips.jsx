import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import TripCard from '../components/TripCard';
import { Compass, Calendar, Map, Activity } from 'lucide-react';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTrips = trips.filter(t => t.status === activeTab);

  const tabs = [
    { id: 'ongoing', label: 'Ongoing', icon: <Activity className="h-4 w-4" /> },
    { id: 'upcoming', label: 'Upcoming', icon: <Calendar className="h-4 w-4" /> },
    { id: 'completed', label: 'Completed', icon: <Map className="h-4 w-4" /> }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Trips</h1>
          <p className="text-gray-500 mt-1">Manage and organize all your travel plans.</p>
        </div>
        <Link to="/plan" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-sm whitespace-nowrap">
          + Plan New Trip
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent'
            }`}
          >
            {tab.icon} {tab.label}
            <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {trips.filter(t => t.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center flex flex-col items-center justify-center max-w-2xl mx-auto shadow-sm">
          <div className="bg-primary-50 p-5 rounded-full mb-5">
            <Compass className="h-12 w-12 text-primary-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No {activeTab} trips</h3>
          <p className="text-gray-500 mb-8 max-w-md">You don't have any {activeTab} itineraries at the moment. Time to start planning your next adventure!</p>
          <Link to="/plan" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium transition shadow-sm">
            Create an Itinerary
          </Link>
        </div>
      )}

    </div>
  );
};

export default MyTrips;
