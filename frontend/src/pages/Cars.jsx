import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import API from '../api/axios';
import CarCard from '../components/CarCard';

export default function Cars() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    car_type: searchParams.get('car_type') || '',
    min_price: '', max_price: '',
    fuel_type: '', transmission: '',
    sort_by: 'price_low', page: 1,
  });

  useEffect(() => { fetchCities(); }, []);
  useEffect(() => { fetchCars(); }, [filters]);

  const fetchCities = async () => {
    try { const res = await API.get('/cars/cities/list'); setCities(res.data.cities || []); } catch {}
  };

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v; });
      const res = await API.get('/cars', { params });
      setCars(res.data.cars || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  const clearFilters = () => setFilters({ city: '', car_type: '', min_price: '', max_price: '', fuel_type: '', transmission: '', sort_by: 'price_low', page: 1 });

  const carTypes = ['sedan', 'suv', 'hatchback', 'luxury', 'convertible', 'minivan'];
  const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];

  return (
    <div style={{ paddingTop: '88px', paddingBottom: '64px', minHeight: '100vh', width: '100%' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#fff' }}>Browse Cars</h1>
            <p style={{ color: '#64748b', marginTop: '4px' }}>{total} cars available</p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary"
            style={{ display: 'none' }} className="btn-secondary md-hidden-toggle">
            <SlidersHorizontal style={{ width: '18px', height: '18px' }} /> Filters
          </button>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Sidebar Filters */}
          <div style={{ width: '260px', flexShrink: 0 }} className="hidden md:block">
            <div className="glass-card" style={{ padding: '28px', position: 'sticky', top: '96px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <Filter style={{ width: '16px', height: '16px' }} /> Filters
                </h3>
                <button onClick={clearFilters} style={{ fontSize: '12px', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>
              </div>

              {/* City */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>City</label>
                <select value={filters.city} onChange={(e) => updateFilter('city', e.target.value)} className="input-field" style={{ fontSize: '13px' }}>
                  <option value="">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Car Type */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Car Type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {carTypes.map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer', textTransform: 'capitalize' }}>
                      <input type="radio" name="car_type" checked={filters.car_type === type}
                        onChange={() => updateFilter('car_type', filters.car_type === type ? '' : type)}
                        style={{ accentColor: '#3b82f6' }} />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Price Range ($/day)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" placeholder="Min" value={filters.min_price} onChange={(e) => updateFilter('min_price', e.target.value)} className="input-field" style={{ fontSize: '13px' }} />
                  <input type="number" placeholder="Max" value={filters.max_price} onChange={(e) => updateFilter('max_price', e.target.value)} className="input-field" style={{ fontSize: '13px' }} />
                </div>
              </div>

              {/* Fuel */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Fuel Type</label>
                <select value={filters.fuel_type} onChange={(e) => updateFilter('fuel_type', e.target.value)} className="input-field" style={{ fontSize: '13px' }}>
                  <option value="">All</option>
                  {fuelTypes.map(f => <option key={f} value={f} style={{ textTransform: 'capitalize' }}>{f}</option>)}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Transmission</label>
                <select value={filters.transmission} onChange={(e) => updateFilter('transmission', e.target.value)} className="input-field" style={{ fontSize: '13px' }}>
                  <option value="">All</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Sort */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Showing {cars.length} of {total}</span>
              <select value={filters.sort_by} onChange={(e) => updateFilter('sort_by', e.target.value)} className="input-field" style={{ width: 'auto', fontSize: '13px', padding: '10px 14px' }}>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="glass-card" style={{ overflow: 'hidden' }}>
                    <div className="skeleton" style={{ height: '220px' }} />
                    <div style={{ padding: '20px' }}>
                      <div className="skeleton" style={{ height: '22px', width: '70%', marginBottom: '10px' }} />
                      <div className="skeleton" style={{ height: '16px', width: '50%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="glass-card" style={{ padding: '64px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>No Cars Found</h3>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {cars.map((car, i) => (
                    <motion.div key={car.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <CarCard car={car} />
                    </motion.div>
                  ))}
                </div>

                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                        style={{
                          width: '40px', height: '40px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer',
                          border: 'none', transition: 'all 0.2s', fontSize: '14px',
                          background: filters.page === p ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                          color: filters.page === p ? '#fff' : '#94a3b8',
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
