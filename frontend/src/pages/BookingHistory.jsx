import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, X } from 'lucide-react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      toast.success('Booking canceled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to cancel');
    }
  };

  const handlePay = async (bookingId) => {
    try {
      await API.post('/payments', { booking_id: bookingId, method: 'card' });
      toast.success('Payment successful! 🎉');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Payment failed');
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Booking History</h1>
          <p className="text-slate-400 mb-8">View and manage all your bookings</p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 skeleton" />)}</div>
        ) : bookings.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">No Bookings Yet</h3>
            <p className="text-slate-400 mb-4">Start by browsing our car collection</p>
            <button onClick={() => navigate('/cars')} className="btn-primary">Browse Cars</button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-3xl flex-shrink-0">
                    🚗
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg">{booking.car_brand} {booking.car_model}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {booking.start_date} → {booking.end_date}</span>
                      <span>{booking.total_days} days</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">${booking.total_price}</p>
                      <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={() => handlePay(booking.id)} className="btn-success text-xs py-1.5 px-3 flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" /> Pay
                          </button>
                          <button onClick={() => cancelBooking(booking.id)} className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button onClick={() => cancelBooking(booking.id)} className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
                    </div>
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
