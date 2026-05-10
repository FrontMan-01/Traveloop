import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Plane, Calendar, MapPin, AlignLeft, Sparkles } from 'lucide-react';

const PlanTrip = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    isPublic: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Auto-assign a random nice cover photo based on name if possible
    const photoQuery = formData.name.split(' ')[0] || 'travel';
    const coverPhoto = `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80`;

    try {
      const res = await api.post('/trips', { ...formData, coverPhoto });
      navigate(`/trips/${res.data.data.id}/build`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { city: 'Tokyo', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80' },
    { city: 'Paris', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
    { city: 'New York', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80' },
    { city: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
    { city: 'Rome', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80' },
    { city: 'London', img: 'https://images.unsplash.com/photo-1513635269975-59693e2d8ce2?auto=format&fit=crop&w=400&q=80' },
  ];

  const fillSuggestion = (city) => {
    setFormData({ ...formData, name: `Trip to ${city}` });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left: Form */}
      <div className="w-full lg:w-5/12">
        <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-8 sticky top-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary-100 p-3 rounded-xl text-primary-600">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Plan a New Trip</h1>
              <p className="text-gray-500 text-sm">Let's set up the basics.</p>
            </div>
          </div>

          {error && <div className="text-red-500 bg-red-50 p-3 rounded-xl text-sm mb-6 border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Trip Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-400" /></div>
                <input type="text" name="name" required placeholder="e.g. Summer in Europe" className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition" value={formData.name} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="h-4 w-4 text-gray-400" /></div>
                  <input type="date" name="startDate" required className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition text-sm" value={formData.startDate} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar className="h-4 w-4 text-gray-400" /></div>
                  <input type="date" name="endDate" required className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition text-sm" value={formData.endDate} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (Optional)</label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 pointer-events-none"><AlignLeft className="h-5 w-5 text-gray-400" /></div>
                <textarea name="description" rows="3" placeholder="What's the goal of this trip?" className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition resize-none" value={formData.description} onChange={handleChange}></textarea>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-primary-50 p-4 rounded-xl border border-primary-100">
              <input type="checkbox" id="isPublic" name="isPublic" className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300" checked={formData.isPublic} onChange={handleChange} />
              <label htmlFor="isPublic" className="text-sm font-medium text-gray-800 cursor-pointer">
                Make this trip public to the community
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition shadow-sm mt-4 active:scale-95 flex items-center justify-center gap-2">
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Create Trip & Start Building'}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Inspiration */}
      <div className="w-full lg:w-7/12">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-gray-900">Need Inspiration?</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {suggestions.map((s, idx) => (
            <div 
              key={idx} 
              onClick={() => fillSuggestion(s.city)}
              className={`relative h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${formData.name.includes(s.city) ? 'ring-4 ring-primary-400 ring-offset-2' : ''}`}
            >
              <img src={s.img} alt={s.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex flex-col">
                <span className="text-white font-bold text-xl tracking-wide group-hover:text-primary-200 transition-colors">{s.city}</span>
                <span className="text-white/70 text-xs font-medium uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">Click to autofill</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 flex items-start gap-4">
          <div className="bg-amber-100 p-2 rounded-full mt-1">
            <Sparkles className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Pro Tip</h4>
            <p className="text-sm opacity-90 leading-relaxed">
              Once you create the trip, you'll be taken to the <strong>Itinerary Builder</strong> where you can add multiple cities, flights, hotels, and daily activities with automated budget tracking!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PlanTrip;
