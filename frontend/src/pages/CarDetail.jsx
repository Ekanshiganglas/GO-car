import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Fuel, Gauge, Star, Calendar, ArrowLeft, Check, CreditCard } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CarDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState({ start_date: '', end_date: '' });
  const [currentBooking, setCurrentBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchCar(); }, [id]);

  const fetchCar = async () => {
    try { const res = await API.get(`/cars/${id}`); setCar(res.data); }
    catch { toast.error('Car not found'); navigate('/cars'); }
    finally { setLoading(false); }
  };

  const totalDays = () => {
    if (!bookingData.start_date || !bookingData.end_date) return 0;
    return Math.max(Math.ceil((new Date(bookingData.end_date) - new Date(bookingData.start_date)) / 86400000), 0);
  };

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!bookingData.start_date || !bookingData.end_date) return toast.error('Select dates');
    if (totalDays() <= 0) return toast.error('End date must be after start date');
    setSubmitting(true);
    try {
      const res = await API.post('/bookings', { car_id: id, start_date: bookingData.start_date, end_date: bookingData.end_date });
      setCurrentBooking(res.data);
      setShowPayment(true);
      toast.success('Booking created! Proceed to payment.');
    } catch (err) { toast.error(err.response?.data?.detail || 'Booking failed'); }
    finally { setSubmitting(false); }
  };

  const handlePayment = async (method) => {
    if (!currentBooking) return;
    setSubmitting(true);
    try {
      await API.post('/payments', { booking_id: currentBooking.id, method });
      toast.success('Payment successful! 🎉');
      setShowPayment(false);
      navigate('/bookings');
    } catch (err) { toast.error(err.response?.data?.detail || 'Payment failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!car) return null;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ paddingTop: '88px', paddingBottom: '64px', minHeight: '100vh', width: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8',
          background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px',
          fontSize: '14px', fontWeight: 600,
        }}>
          <ArrowLeft style={{ width: '18px', height: '18px' }} /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          {/* Car Image & Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ overflow: 'hidden' }}>
            {/* Image */}
            <div style={{ height: '400px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={car.image_url || `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80`}
                alt={`${car.brand} ${car.model}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'; }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(10,15,30,0.9) 0%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>{car.brand} {car.model}</h1>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>{car.year} • {car.total_trips} trips</p>
              </div>
              <div style={{
                position: 'absolute', bottom: '28px', right: '32px',
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(245,158,11,0.15)', padding: '8px 16px', borderRadius: '12px',
              }}>
                <Star style={{ width: '18px', height: '18px', color: '#fbbf24', fill: '#fbbf24' }} />
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24' }}>{car.rating}</span>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '32px' }}>
              <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.8, marginBottom: '28px' }}>{car.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                {[
                  { icon: MapPin, label: 'City', value: car.city },
                  { icon: Users, label: 'Seats', value: car.seats },
                  { icon: Fuel, label: 'Fuel', value: car.fuel_type },
                  { icon: Gauge, label: 'Transmission', value: car.transmission },
                ].map(spec => (
                  <div key={spec.label} style={{
                    padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <spec.icon style={{ width: '18px', height: '18px', color: '#60a5fa', marginBottom: '10px' }} />
                    <p style={{ fontSize: '12px', color: '#64748b' }}>{spec.label}</p>
                    <p style={{ color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>{spec.value}</p>
                  </div>
                ))}
              </div>

              {car.features?.length > 0 && (
                <div>
                  <h3 style={{ fontWeight: 700, color: '#fff', marginBottom: '14px', fontSize: '16px' }}>Features</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {car.features.map(f => (
                      <span key={f} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 14px', borderRadius: '10px',
                        background: 'rgba(16,185,129,0.08)', color: '#34d399',
                        fontSize: '13px', fontWeight: 600,
                      }}>
                        <Check style={{ width: '14px', height: '14px' }} /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Booking Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <span style={{ fontSize: '40px', fontWeight: 800, color: '#60a5fa' }}>${car.price_per_day}</span>
                <span style={{ fontSize: '18px', color: '#64748b' }}>/day</span>
              </div>

              {!showPayment ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>Start Date</label>
                      <input type="date" min={today} value={bookingData.start_date}
                        onChange={(e) => setBookingData({...bookingData, start_date: e.target.value})} className="input-field" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>End Date</label>
                      <input type="date" min={bookingData.start_date || today} value={bookingData.end_date}
                        onChange={(e) => setBookingData({...bookingData, end_date: e.target.value})} className="input-field" />
                    </div>
                  </div>

                  {totalDays() > 0 && (
                    <div style={{ padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                        <span style={{ color: '#94a3b8' }}>${car.price_per_day} × {totalDays()} days</span>
                        <span style={{ color: '#fff' }}>${(car.price_per_day * totalDays()).toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                        <span style={{ fontWeight: 700, color: '#fff' }}>Total</span>
                        <span style={{ fontWeight: 800, fontSize: '22px', color: '#60a5fa' }}>${(car.price_per_day * totalDays()).toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <button onClick={handleBook} disabled={submitting || !car.available} className="btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '16px', justifyContent: 'center', opacity: (submitting || !car.available) ? 0.5 : 1 }}>
                    {submitting ? 'Processing...' : !car.available ? 'Not Available' : 'Book Now'}
                  </button>
                </>
              ) : (
                <div>
                  <h3 style={{ fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '16px' }}>Select Payment Method</h3>
                  <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center', marginBottom: '16px' }}>
                    <span style={{ color: '#64748b' }}>Total: </span>
                    <span style={{ color: '#60a5fa', fontWeight: 800, fontSize: '20px' }}>${currentBooking?.total_price}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['card', 'upi', 'netbanking'].map(method => (
                      <button key={method} onClick={() => handlePayment(method)} disabled={submitting}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '14px',
                          padding: '16px 18px', borderRadius: '14px',
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer', color: '#e2e8f0', fontSize: '15px',
                          fontWeight: 600, transition: 'all 0.2s', textTransform: 'capitalize',
                          opacity: submitting ? 0.5 : 1,
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                      >
                        <CreditCard style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
                        {method === 'upi' ? 'UPI' : method === 'netbanking' ? 'Net Banking' : 'Credit/Debit Card'}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => { setShowPayment(false); setCurrentBooking(null); }}
                    style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}>
                    Cancel
                  </button>
                </div>
              )}

              {!user && (
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '16px' }}>
                  <button onClick={() => navigate('/login')} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Log in</button> to book this car
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
