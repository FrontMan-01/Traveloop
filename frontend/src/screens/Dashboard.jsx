import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import TripCard from '../components/TripCard';
import { Plane, Compass, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentTrips();
  }, []);

  const fetchRecentTrips = async () => {
    try {
      const res = await api.get('/trips');
      setRecentTrips(res.data.data.slice(0, 3)); // Only show latest 3
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const regions = [
    { name: 'Asia', image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=400&q=80' },
    { name: 'Europe', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80' },
    { name: 'Americas', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80' },
    { name: 'Africa', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=400&q=80' },
    { name: 'Oceania', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-primary-100 text-lg mb-8 max-w-xl leading-relaxed">
            Ready for your next adventure? Traveloop makes it easy to organize, budget, and share your multi-city itineraries.
          </p>
          <Link to="/plan" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 px-8 py-3.5 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-md">
            Plan a New Trip <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        
        {/* Decorative elements */}
        <Plane className="absolute -right-10 -bottom-10 h-64 w-64 text-white opacity-10 transform -rotate-12" />
        <div className="absolute top-10 right-20 h-32 w-32 bg-white opacity-10 rounded-full blur-3xl"></div>
      </section>

      {/* Explore Regions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary-600" /> Explore Regions
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {regions.map((region) => (
            <div key={region.name} className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
              <img src={region.image} alt={region.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-white font-bold text-lg tracking-wide">{region.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Trips */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Trips</h2>
          {recentTrips.length > 0 && (
            <Link to="/trips" className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1 transition">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : recentTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-primary-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="bg-primary-50 p-4 rounded-full mb-4">
              <Plane className="h-10 w-10 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">You haven't planned any trips. Create your first itinerary to get started.</p>
            <Link to="/plan" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-sm inline-flex items-center gap-2">
              Start Planning
            </Link>
          </div>
        )}
      </section>

    </div>
  );
};

export default Dashboard;
