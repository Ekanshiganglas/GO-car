import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Car, Calendar, CreditCard, ArrowRight, TrendingUp } from 'lucide-react';
import API from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [bRes, pRes] = await Promise.all([
        API.get('/bookings'),
        API.get('/payments')
      ]);
      setBookings(bRes.data.bookings || []);
      setPayments(pRes.data.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'active'].includes(b.status)).length;
  const totalSpent = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    { icon: Calendar, label: 'Active Bookings', value: activeBookings, color: 'text-blue-400', bg: 'from-blue-500/20 to-cyan-500/20' },
    { icon: Car, label: 'Total Bookings', value: bookings.length, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-teal-500/20' },
    { icon: CreditCard, label: 'Total Spent', value: `$${totalSpent.toFixed(0)}`, color: 'text-purple-400', bg: 'from-purple-500/20 to-pink-500/20' },
    { icon: TrendingUp, label: 'Completed Trips', value: bookings.filter(b => b.status === 'completed').length, color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/20' },
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
          <p className="text-slate-400 mb-8">Here's an overview of your rental activity</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link to="/cars" className="glass-card glass-card-hover p-6 flex items-center gap-4 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Browse Cars</h3>
              <p className="text-sm text-slate-400">Find your next ride</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
          <Link to="/bookings" className="glass-card glass-card-hover p-6 flex items-center gap-4 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">My Bookings</h3>
              <p className="text-sm text-slate-400">View all bookings</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
          <Link to="/payments" className="glass-card glass-card-hover p-6 flex items-center gap-4 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Payments</h3>
              <p className="text-sm text-slate-400">View payment history</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
            <Link to="/bookings" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 skeleton" />)}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-slate-400">No bookings yet. <Link to="/cars" className="text-blue-400">Browse cars</Link> to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map(booking => (
                <div key={booking.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-2xl">🚗</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{booking.car_brand} {booking.car_model}</p>
                    <p className="text-sm text-slate-400">{booking.start_date} → {booking.end_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">${booking.total_price}</p>
                    <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
