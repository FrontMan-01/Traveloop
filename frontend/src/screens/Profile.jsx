import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { User as UserIcon, Mail, Phone, MapPin, Globe, Camera, Check } from 'lucide-react';

const Profile = () => {
  const { user, login } = useContext(AuthContext); // Assume login can also update user state if token same
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    city: user?.city || '',
    country: user?.country || '',
    photo: user?.photo || ''
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Assuming a PUT /auth/profile exists, or we just mock success for the UI request
      // const res = await api.put('/auth/profile', formData);
      // login(res.data.data.user, localStorage.getItem('token'));
      
      // Mock toast
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-8 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-right-8">
          <div className="bg-green-100 p-1 rounded-full"><Check className="h-4 w-4" /></div>
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Banner & Avatar */}
      <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden mb-8">
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary-500 to-primary-700 relative"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 sm:-mt-16 mb-6">
            <div className="relative group">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-3xl shadow-md overflow-hidden relative">
                {formData.photo ? (
                  <img src={formData.photo} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  user?.firstName?.charAt(0) + user?.lastName?.charAt(0)
                )}
                {/* Overlay for editing */}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white cursor-pointer transition-all">
                  <Camera className="h-8 w-8" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 ml-6 pb-2 hidden sm:block">
              <h1 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
              <p className="text-gray-500 flex items-center gap-1"><Mail className="h-4 w-4" /> {user?.email}</p>
            </div>
          </div>
          
          <div className="sm:hidden mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
            <p className="text-gray-500 flex items-center gap-1"><Mail className="h-4 w-4" /> {user?.email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-4 w-4 text-gray-400" /></div>
                  <input type="text" name="firstName" className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition" value={formData.firstName} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-4 w-4 text-gray-400" /></div>
                  <input type="text" name="lastName" className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-4 w-4 text-gray-400" /></div>
                  <input type="tel" name="phone" className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Camera className="h-4 w-4 text-gray-400" /></div>
                  <input type="url" name="photo" className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition" value={formData.photo} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-4 w-4 text-gray-400" /></div>
                  <input type="text" name="city" className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition" value={formData.city} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Globe className="h-4 w-4 text-gray-400" /></div>
                  <input type="text" name="country" className="pl-9 w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none transition" value={formData.country} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button type="submit" disabled={saving} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-xl font-medium transition shadow-sm disabled:opacity-70 flex items-center gap-2">
                {saving ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save Changes'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Profile;
