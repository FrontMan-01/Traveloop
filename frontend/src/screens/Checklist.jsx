import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckSquare, Trash2, Plus, ArrowLeft, RotateCcw } from 'lucide-react';

const Checklist = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', category: 'General' });

  useEffect(() => {
    fetchItems();
  }, [id]);

  const fetchItems = async () => {
    try {
      const res = await api.get(`/trips/${id}/checklist`);
      setItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name) return;
    try {
      const res = await api.post(`/trips/${id}/checklist`, newItem);
      setItems([...items, res.data.data]);
      setNewItem({ ...newItem, name: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (itemId, currentStatus) => {
    try {
      await api.put(`/checklist/${itemId}`, { isPacked: !currentStatus });
      setItems(items.map(item => item.id === itemId ? { ...item, isPacked: !currentStatus } : item));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await api.delete(`/checklist/${itemId}`);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  const packedCount = items.filter(i => i.isPacked).length;
  const progress = items.length === 0 ? 0 : Math.round((packedCount / items.length) * 100);

  // Group by category
  const categories = [...new Set(items.map(i => i.category))];
  if (!categories.includes('General')) categories.push('General');

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500 pb-12">
      
      <div className="mb-8 flex items-center gap-4">
        <Link to={`/trips/${id}/view`} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition border border-gray-100 text-gray-500 hover:text-primary-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Packing Checklist</h1>
          <p className="text-gray-500">Don't forget the essentials.</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100 mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-3xl font-black text-primary-600">{progress}%</span>
            <span className="text-gray-500 font-medium ml-2 uppercase tracking-wide text-xs">Packed</span>
          </div>
          <p className="text-sm font-medium text-gray-500">{packedCount} of {items.length} items</p>
        </div>
        <div className="h-3 w-full bg-primary-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map(cat => {
          const catItems = items.filter(i => i.category === cat);
          return (
            <div key={cat} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary-500" /> {cat}
                </h3>
                <span className="bg-white border border-gray-200 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {catItems.filter(i => i.isPacked).length}/{catItems.length}
                </span>
              </div>
              
              <div className="p-2">
                {catItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition group">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center transition-colors ${item.isPacked ? 'bg-primary-500 border-primary-500' : 'border-gray-300'}`}>
                        {item.isPacked && <CheckSquare className="h-4 w-4 text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={item.isPacked} onChange={() => handleToggle(item.id, item.isPacked)} />
                      <span className={`text-sm font-medium transition-colors ${item.isPacked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {item.name}
                      </span>
                    </label>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Add new to this category */}
                <form onSubmit={handleAdd} className="flex gap-2 p-2 mt-2">
                  <input
                    type="text"
                    placeholder={`Add to ${cat}...`}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 outline-none transition"
                    value={newItem.category === cat ? newItem.name : ''}
                    onChange={(e) => setNewItem({ name: e.target.value, category: cat })}
                  />
                  <button type="submit" className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-3 py-2 rounded-lg font-medium transition shadow-sm border border-primary-100">
                    <Plus className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Checklist;
