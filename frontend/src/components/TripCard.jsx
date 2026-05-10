import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Edit, Trash2, Eye } from 'lucide-react';

const TripCard = ({ trip, onDelete }) => {
  // Status badge config
  const statusConfig = {
    ongoing: { bg: 'bg-green-100', text: 'text-green-700' },
    upcoming: { bg: 'bg-amber-100', text: 'text-amber-700' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-600' }
  };
  const badgeStyle = statusConfig[trip.status] || statusConfig.upcoming;

  return (
    <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Cover Image Header */}
      <div className="h-36 bg-primary-50 relative overflow-hidden">
        {trip.coverPhoto ? (
          <img src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary-300">
            <MapPin className="h-10 w-10 opacity-50" />
          </div>
        )}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-white/90 ${badgeStyle.text} shadow-sm uppercase tracking-wide`}>
          {trip.status}
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">{trip.name}</h3>
        <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary-400" />
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
        
        <div className="mb-6 flex">
          <span className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
            <MapPin className="h-3 w-3 mr-1" />
            {trip.stops?.length || 0} destinations
          </span>
        </div>
        
        {/* Footer Actions */}
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
          <Link to={`/trips/${trip.id}/view`} className="text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center gap-1 transition">
            <Eye className="h-4 w-4" /> View Itinerary
          </Link>
          
          <div className="flex gap-2">
            <Link to={`/trips/${trip.id}/build`} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition" title="Edit Trip">
              <Edit className="h-4 w-4" />
            </Link>
            <button onClick={() => onDelete && onDelete(trip.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete Trip">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
