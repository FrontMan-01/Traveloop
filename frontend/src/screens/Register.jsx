import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Plane, User as UserIcon, Mail, Lock, Phone, MapPin, Globe, Camera } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: '',
    photo: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.data.user, res.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex bg-white font-sans">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl mb-16">
            <Plane className="h-8 w-8" />
            <span>Traveloop</span>
          </Link>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-4">Start your journey <br/>with us.</h1>
          <p className="text-primary-200 text-lg max-w-md">Create your free account and get access to the best itinerary builder on the web.</p>
        </div>
        
        {/* Abstract Travel SVG Illustration */}
        <svg className="absolute bottom-0 right-0 w-[120%] h-auto opacity-20 transform translate-x-20 translate-y-10" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 500 Q 250 300 400 400 T 700 200 L 800 600 L 0 600 Z" fill="currentColor"/>
          <circle cx="650" cy="150" r="40" fill="currentColor" />
          <path d="M200 400 L 250 350 L 300 420 Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto hide-scrollbar">
        <div className="w-full max-w-md my-auto pb-10">
          <div className="lg:hidden flex items-center gap-2 text-primary-600 font-bold text-2xl mb-8 mt-4">
            <Plane className="h-8 w-8" />
            <span>Traveloop</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Sign up in just a few seconds.</p>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl mb-6 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex justify-center mb-6">
              <div className="relative group cursor-pointer">
                <div className="h-24 w-24 rounded-full border-2 border-dashed border-primary-200 flex flex-col items-center justify-center text-primary-400 bg-primary-50 group-hover:bg-primary-100 group-hover:border-primary-300 transition overflow-hidden">
                  {formData.photo ? (
                    <img src={formData.photo} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8 mb-1" />
                  )}
                </div>
                <input type="url" name="photo" placeholder="Photo URL" className="mt-3 w-full text-xs text-center text-gray-500 outline-none" value={formData.photo} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-4 w-4 text-gray-400" /></div>
                  <input type="text" name="firstName" required className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition-all" value={formData.firstName} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-4 w-4 text-gray-400" /></div>
                  <input type="text" name="lastName" required className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition-all" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-gray-400" /></div>
                <input type="email" name="email" required className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition-all" value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-gray-400" /></div>
                <input type="password" name="password" required className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition-all" value={formData.password} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City (Opt)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-4 w-4 text-gray-400" /></div>
                  <input type="text" name="city" className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition-all" value={formData.city} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Country (Opt)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Globe className="h-4 w-4 text-gray-400" /></div>
                  <input type="text" name="country" className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition-all" value={formData.country} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-70 mt-6 active:scale-[0.98]">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Already have an account? <Link to="/" className="text-primary-600 font-semibold hover:text-primary-700 transition">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
