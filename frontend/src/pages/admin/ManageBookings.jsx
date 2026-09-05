import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/admin/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/bookings/${id}/status`, { status });
      toast.success(`Booking status updated to ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter ? bookings.filter(b => b.status === filter) : bookings;

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Bookings</h1>
        <p className="text-slate-400 mb-6">{bookings.length} total bookings</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['', 'pending', 'confirmed', 'active', 'completed', 'canceled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              {status || 'All'} {status ? `(${bookings.filter(b => b.status === status).length})` : `(${bookings.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-400">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white">{b.car_brand} {b.car_model}</h3>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      User: {b.user_id?.slice(-6)} • {b.start_date} → {b.end_date} • {b.total_days} days
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white">${b.total_price}</span>
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className="input-field w-auto text-sm py-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
