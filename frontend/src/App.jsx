import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Dashboard from './pages/Dashboard';
import BookingHistory from './pages/BookingHistory';
import PaymentHistory from './pages/PaymentHistory';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageBookings from './pages/admin/ManageBookings';
import AddEditCar from './pages/admin/AddEditCar';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/cars" element={<AdminRoute><ManageCars /></AdminRoute>} />
            <Route path="/admin/cars/new" element={<AdminRoute><AddEditCar /></AdminRoute>} />
            <Route path="/admin/cars/edit/:id" element={<AdminRoute><AddEditCar /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
