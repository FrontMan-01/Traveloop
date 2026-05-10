import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Globe, Search, Filter, Users, Calendar, MapPin, Heart, Copy } from 'lucide-react';

const Community = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPublicTrips();
  }, []);

  const fetchPublicTrips = async () => {
    try {
      const res = await api.get('/community');
      setTrips(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="text-center mb-12 bg-gradient-to-b from-primary-50 to-white rounded-3xl p-10 border border-primary-100 shadow-sm">
        <div className="inline-flex items-center justify-center p-4 bg-primary-100 text-primary-600 rounded-full mb-4">
          <Globe className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Explore Community Trips</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Get inspired by itineraries crafted by fellow travelers. Discover hidden gems and duplicate routes for your next adventure.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mt-8 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search destination or trip name..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-primary-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTrips.map(trip => (
            <div key={trip.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
              
              <div className="h-56 relative overflow-hidden">
                <img src={trip.coverPhoto || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-red-500 cursor-pointer transition">
                  <Heart className="h-5 w-5" />
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-2xl leading-tight mb-1">{trip.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-200 uppercase tracking-wide">
                    <MapPin className="h-3 w-3" /> {trip.stops?.length || 0} destinations
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold overflow-hidden border-2 border-white shadow-sm">
                    {trip.user?.photo ? (
                      <img src={trip.user?.photo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      trip.user?.firstName?.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{trip.user?.firstName} {trip.user?.lastName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Contributor
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <button className="w-full bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <Copy className="h-4 w-4" /> Duplicate Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">No public trips found. Be the first to share one!</p>
        </div>
      )}
    </div>
  );
};

export default Community;
