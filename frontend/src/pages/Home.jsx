import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, MapPin, Shield, Zap, Car, Star, Users, Calendar } from 'lucide-react';
import API from '../api/axios';
import CarCard from '../components/CarCard';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/cars?limit=6&sort_by=rating').then(res => setCars(res.data.cars || [])).catch(() => {});
    API.get('/cars/cities/list').then(res => setCities(res.data.cities || [])).catch(() => {});
  }, []);

  const handleSearch = () => {
    navigate(`/cars${selectedCity ? `?city=${selectedCity}` : ''}`);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* HERO SECTION */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', padding: '120px 24px 80px',
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.05) 0%, transparent 50%)',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: '400px', height: '400px',
          borderRadius: '50%', background: 'rgba(59,130,246,0.03)', filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px',
          borderRadius: '50%', background: 'rgba(139,92,246,0.04)', filter: 'blur(60px)',
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '30px', padding: '8px 20px', marginBottom: '28px',
                fontSize: '13px', color: '#60a5fa', fontWeight: 600,
              }}>
                <Zap style={{ width: '14px', height: '14px' }} /> AI-Powered Car Rentals
              </div>

              <h1 style={{
                fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900,
                lineHeight: 1.1, marginBottom: '24px',
              }}>
                <span style={{ color: '#fff' }}>Rent Your </span>
                <span className="gradient-text">Dream Car</span>
                <br />
                <span style={{ color: '#fff' }}>In Minutes</span>
              </h1>

              <p style={{
                fontSize: '18px', color: '#94a3b8', lineHeight: 1.7,
                maxWidth: '560px', marginBottom: '40px',
              }}>
                Choose from 100+ premium cars across 8+ cities. Book instantly, drive anywhere. Powered by AI to find you the best deals.
              </p>

              {/* Search Box */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '12px',
                padding: '8px', borderRadius: '20px',
                background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                maxWidth: '560px',
              }}>
                <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
                  <MapPin style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    style={{
                      width: '100%', padding: '14px 14px 14px 44px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '14px', color: '#e2e8f0', fontSize: '14px',
                      outline: 'none', appearance: 'auto',
                    }}
                  >
                    <option value="" style={{ background: '#1e293b' }}>All Cities</option>
                    {cities.map(c => <option key={c} value={c} style={{ background: '#1e293b' }}>{c}</option>)}
                  </select>
                </div>
                <button onClick={handleSearch} className="btn-primary" style={{ padding: '14px 32px' }}>
                  <Search style={{ width: '18px', height: '18px' }} /> Search Cars
                </button>
              </div>

              {/* Stats below search */}
              <div style={{
                display: 'flex', gap: '40px', marginTop: '48px', flexWrap: 'wrap',
              }}>
                {[
                  { value: '100+', label: 'Cars Available' },
                  { value: '500+', label: 'Happy Customers' },
                  { value: '8+', label: 'Cities' },
                ].map(stat => (
                  <div key={stat.label}>
                    <p style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>{stat.value}</p>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Rent a car in 3 easy steps</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { icon: Search, title: 'Search & Filter', desc: 'Browse 100+ cars. Filter by city, type, price, and more to find the perfect ride.', color: '#3b82f6', step: '01' },
              { icon: Calendar, title: 'Book Instantly', desc: 'Select your dates, review the price, and book in seconds. No hidden fees.', color: '#8b5cf6', step: '02' },
              { icon: Car, title: 'Start Driving', desc: 'Pay securely online, pick up your car, and hit the road. It\'s that simple!', color: '#06b6d4', step: '03' },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              >
                <div className="glass-card" style={{ padding: '36px 32px', textAlign: 'center' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '18px',
                    background: `rgba(${item.color === '#3b82f6' ? '59,130,246' : item.color === '#8b5cf6' ? '139,92,246' : '6,182,212'},0.12)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}>
                    <item.icon style={{ width: '28px', height: '28px', color: item.color }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: item.color, letterSpacing: '1px' }}>STEP {item.step}</span>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '10px 0 12px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                Featured <span className="gradient-text">Cars</span>
              </h2>
              <p style={{ color: '#64748b', fontSize: '16px' }}>Our top-rated vehicles ready for you</p>
            </div>
            <Link to="/cars" className="btn-secondary" style={{ padding: '12px 24px' }}>
              View All <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </motion.div>

          {cars.length === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {[1,2,3].map(i => (
                <div key={i} className="glass-card" style={{ overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: '220px' }} />
                  <div style={{ padding: '20px' }}>
                    <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '12px' }} />
                    <div className="skeleton" style={{ height: '16px', width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {cars.map((car, i) => (
                <motion.div key={car.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              Why Choose <span className="gradient-text">GoCar</span>?
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { icon: Shield, title: 'Verified Cars', desc: 'Every vehicle is inspected and verified for safety.', color: '#10b981' },
              { icon: Zap, title: 'AI Suggestions', desc: 'Our AI finds you the cheapest, best-rated options.', color: '#f59e0b' },
              { icon: Star, title: 'Top Rated', desc: '4.8 average rating from 500+ happy customers.', color: '#8b5cf6' },
              { icon: Users, title: '24/7 Support', desc: 'Customer support available around the clock.', color: '#06b6d4' },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <div className="glass-card glass-card-hover" style={{ padding: '32px' }}>
                  <item.icon style={{ width: '32px', height: '32px', color: item.color, marginBottom: '18px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="glass-card gradient-border" style={{ padding: '64px 32px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
                Ready to Hit the Road?
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
                Join thousands of happy drivers. Sign up today and get your first booking discount.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/cars" className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
                  Browse Cars <ArrowRight style={{ width: '18px', height: '18px' }} />
                </Link>
                <Link to="/signup" className="btn-secondary" style={{ padding: '16px 36px', fontSize: '16px' }}>
                  Create Account
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
