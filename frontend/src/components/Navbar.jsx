import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plane, User as UserIcon, LogOut, Search, Map, Globe, LogIn } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${isActive(path) ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50/50'}`;

  return (
    <nav className="bg-white border-b border-primary-100 sticky top-0 z-50 shadow-sm h-16 flex items-center">
      <div className="container mx-auto px-4 md:px-8 w-full flex justify-between items-center">
        
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-primary-700 font-bold text-xl hover:opacity-80 transition">
            <Plane className="h-6 w-6" />
            <span>Traveloop</span>
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
              <Link to="/trips" className={linkClass('/trips')}>My Trips</Link>
              <Link to="/search" className={linkClass('/search')}>Search</Link>
              <Link to="/community" className={linkClass('/community')}>Community</Link>
              {user.isAdmin && (
                <Link to="/admin" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-xl font-bold transition">Admin</Link>
              )}
            </div>
          )}
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/plan" className="hidden sm:block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
                + Plan Trip
              </Link>
              <div className="h-8 w-px bg-primary-100 hidden sm:block mx-2"></div>
              
              <Link to="/profile" className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-primary-100 hover:border-primary-300 overflow-hidden transition">
                {user.photo ? (
                  <img src={user.photo} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                )}
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition" title="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
              <UserIcon className="h-4 w-4" /> Sign Up
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
