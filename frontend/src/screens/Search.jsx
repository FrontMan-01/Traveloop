import React, { useState } from 'react';
import { Search as SearchIcon, Filter, MapPin, Map, Navigation, Heart, ChevronRight } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Static mock data for search demonstration
  const allItems = [
    { id: 1, type: 'City', name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80', desc: 'City of light and romance.', cost: '$$$' },
    { id: 2, type: 'Sightseeing', name: 'Eiffel Tower', country: 'Paris, France', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=400&q=80', desc: 'Iconic iron lattice tower on the Champ de Mars.', cost: '$$' },
    { id: 3, type: 'City', name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80', desc: 'Bustling capital combining ultramodern and traditional.', cost: '$$$' },
    { id: 4, type: 'Food', name: 'Sushi Dai', country: 'Tokyo, Japan', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80', desc: 'World-renowned sushi at the Toyosu Market.', cost: '$$$' },
    { id: 5, type: 'Adventure', name: 'Mount Fuji Climb', country: 'Japan', img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=400&q=80', desc: 'Hike Japan’s highest mountain.', cost: '$$' },
    { id: 6, type: 'Stay', name: 'Ritz Paris', country: 'Paris, France', img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80', desc: 'Luxurious hotel in the heart of Paris.', cost: '$$$$' },
  ];

  const filters = ['All', 'City', 'Sightseeing', 'Food', 'Adventure', 'Stay', 'Transport'];

  const filteredItems = allItems.filter(item => {
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) || item.country.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
      
      {/* Search Header (Sticky) */}
      <div className="sticky top-16 bg-primary-50/90 backdrop-blur-md z-40 py-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">Discover Places & Activities</h1>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for cities, landmarks, restaurants..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-primary-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none text-lg transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === f 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                <div className="h-48 relative overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-gray-400 hover:text-red-500 cursor-pointer transition shadow-sm">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm uppercase tracking-wide">
                    {item.type}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
                    <span className="text-amber-500 font-bold text-sm bg-amber-50 px-2 py-0.5 rounded-md">{item.cost}</span>
                  </div>
                  
                  <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-3">
                    <MapPin className="h-3.5 w-3.5 text-primary-400" /> {item.country}
                  </p>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-grow">{item.desc}</p>
                  
                  <button className="w-full bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white border border-primary-100 font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    Add to Trip <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="bg-white p-6 rounded-full border-2 border-dashed border-gray-200 mb-6">
              <Map className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 max-w-md">We couldn't find anything matching "{query}" in {activeFilter}. Try adjusting your search terms.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Search;
