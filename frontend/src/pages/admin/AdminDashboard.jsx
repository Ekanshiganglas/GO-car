import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Calendar, Users, DollarSign, Plus, ArrowRight } from 'lucide-react';
import API from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    { icon: Car, label: 'Total Cars', value: stats.total_cars, color: 'text-blue-400', bg: 'from-blue-500/20 to-cyan-500/20' },
    { icon: Calendar, label: 'Total Bookings', value: stats.total_bookings, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-teal-500/20' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${stats.total_revenue}`, color: 'text-purple-400', bg: 'from-purple-500/20 to-pink-500/20' },
    { icon: Users, label: 'Total Users', value: stats.total_users, color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/20' },
  ] : [];

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 mt-1">Manage your car rental platform</p>
            </div>
            <Link to="/admin/cars/new" className="btn-primary"><Plus className="w-5 h-5" /> Add Car</Link>
          </div>
        </motion.div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[1,2,3,4].map(i => <div key={i} className="h-32 skeleton rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {statCards.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link to="/admin/cars" className="glass-card glass-card-hover p-6 flex items-center gap-4 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><Car className="w-6 h-6 text-blue-400" /></div>
            <div className="flex-1"><h3 className="font-semibold text-white">Manage Cars</h3><p className="text-sm text-slate-400">Add, edit, or remove cars</p></div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
          <Link to="/admin/bookings" className="glass-card glass-card-hover p-6 flex items-center gap-4 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Calendar className="w-6 h-6 text-emerald-400" /></div>
            <div className="flex-1"><h3 className="font-semibold text-white">Manage Bookings</h3><p className="text-sm text-slate-400">View and update bookings</p></div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
          <Link to="/admin/cars/new" className="glass-card glass-card-hover p-6 flex items-center gap-4 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center"><Plus className="w-6 h-6 text-purple-400" /></div>
            <div className="flex-1"><h3 className="font-semibold text-white">Add New Car</h3><p className="text-sm text-slate-400">List a new vehicle</p></div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
        </div>

        {/* Recent Bookings */}
        {stats?.recent_bookings && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              {stats.recent_bookings.map(b => (
                <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                  <div className="flex-1"><p className="text-white font-medium">{b.car_brand} {b.car_model}</p><p className="text-sm text-slate-400">{b.start_date} → {b.end_date}</p></div>
                  <span className="font-bold text-white">${b.total_price}</span>
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
