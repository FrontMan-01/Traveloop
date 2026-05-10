import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Screens
import Login from './screens/Login';
import Register from './screens/Register';
import Dashboard from './screens/Dashboard';
import PlanTrip from './screens/PlanTrip';
import MyTrips from './screens/MyTrips';
import ItineraryBuilder from './screens/ItineraryBuilder';
import ItineraryView from './screens/ItineraryView';
import Profile from './screens/Profile';
import Search from './screens/Search';
import Community from './screens/Community';
import Checklist from './screens/Checklist';
import Notes from './screens/Notes';
import AdminDashboard from './screens/AdminDashboard';
import Invoice from './screens/Invoice';

function App() {
  return (
    <div className="min-h-screen bg-primary-50 flex flex-col font-sans text-primary-950">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-8 py-8 w-full">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plan" element={<PlanTrip />} />
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/trips/:id/build" element={<ItineraryBuilder />} />
            <Route path="/trips/:id/view" element={<ItineraryView />} />
            <Route path="/trips/:id/notes" element={<Notes />} />
            <Route path="/trips/:id/checklist" element={<Checklist />} />
            <Route path="/trips/:id/invoice" element={<Invoice />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/community" element={<Community />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
