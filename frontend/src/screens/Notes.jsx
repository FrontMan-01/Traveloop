import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { StickyNote, Trash2, ArrowLeft, Send } from 'lucide-react';

const Notes = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [stops, setStops] = useState([]);
  const [content, setContent] = useState('');
  const [stopId, setStopId] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const notesRes = await api.get(`/trips/${id}/notes`);
      setNotes(notesRes.data.data);
      const tripRes = await api.get(`/trips/${id}`);
      setStops(tripRes.data.data.stops || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!content) return;
    try {
      const res = await api.post(`/trips/${id}/notes`, { content, stopId: stopId || null });
      setNotes([res.data.data, ...notes]);
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-12">
      
      <div className="mb-8 flex items-center gap-4">
        <Link to={`/trips/${id}/view`} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition border border-gray-100 text-gray-500 hover:text-primary-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Trip Notes</h1>
          <p className="text-gray-500">Jot down thoughts, links, and reminders.</p>
        </div>
      </div>

      {/* Note Creation */}
      <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6 mb-8">
        <form onSubmit={handleAdd}>
          <textarea
            rows="3"
            placeholder="Type your note here..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition resize-none mb-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div className="flex justify-between items-center">
            <select
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-400"
              value={stopId}
              onChange={(e) => setStopId(e.target.value)}
            >
              <option value="">General Note</option>
              {stops.map(s => <option key={s.id} value={s.id}>{s.city}</option>)}
            </select>
            <button type="submit" disabled={!content} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-sm disabled:opacity-50 flex items-center gap-2">
              <Send className="h-4 w-4" /> Save Note
            </button>
          </div>
        </form>
      </div>

      {/* Masonry Grid Simulation for Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <div key={note.id} className="bg-amber-50/50 rounded-2xl p-6 border border-amber-200/60 shadow-sm relative group hover:shadow-md transition">
            
            <button onClick={() => handleDelete(note.id)} className="absolute top-4 right-4 text-amber-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1 bg-white rounded-full shadow-sm">
              <Trash2 className="h-4 w-4" />
            </button>

            {note.stop && (
              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-lg mb-3 shadow-sm border border-amber-200">
                📍 {note.stop.city}
              </span>
            )}
            {!note.stop && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-lg mb-3 border border-gray-200">
                General
              </span>
            )}
            
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
              {note.content}
            </p>

            <div className="mt-4 pt-4 border-t border-amber-200/50 flex justify-between items-center text-xs text-amber-600/70 font-medium">
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              <StickyNote className="h-3.5 w-3.5" />
            </div>
          </div>
        ))}
      </div>
      
      {notes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400">No notes yet. Add one above!</p>
        </div>
      )}

    </div>
  );
};

export default Notes;
