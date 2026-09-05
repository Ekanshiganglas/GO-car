import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Fuel, Star, Gauge } from 'lucide-react';

export default function CarCard({ car }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link
        to={`/cars/${car.id}`}
        style={{ display: 'block', textDecoration: 'none' }}
        className="glass-card glass-card-hover overflow-hidden"
      >
        {/* Car Image */}
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
          <img
            src={car.image_url || `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80`}
            alt={`${car.brand} ${car.model}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80';
            }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
          />
          {/* Gradient overlay at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
            background: 'linear-gradient(to top, rgba(10,15,30,0.95) 0%, transparent 100%)',
          }} />

          {/* Type Badge */}
          <span style={{
            position: 'absolute', top: '14px', left: '14px',
            padding: '6px 14px', borderRadius: '10px',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
            fontSize: '12px', fontWeight: 600, textTransform: 'capitalize',
            color: '#e2e8f0', letterSpacing: '0.3px',
          }}>
            {car.car_type}
          </span>

          {/* Price on image */}
          <div style={{
            position: 'absolute', bottom: '14px', left: '14px',
          }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#60a5fa' }}>
              ${car.price_per_day}
            </span>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>/day</span>
          </div>

          {/* Rating on image */}
          <div style={{
            position: 'absolute', bottom: '18px', right: '14px',
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'rgba(245,158,11,0.15)', padding: '4px 10px',
            borderRadius: '8px',
          }}>
            <Star style={{ width: '14px', height: '14px', color: '#fbbf24', fill: '#fbbf24' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24' }}>{car.rating}</span>
          </div>

          {!car.available && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fb7185', fontWeight: 700, fontSize: '18px' }}>Not Available</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            {car.brand} {car.model}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>{car.year}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { icon: MapPin, text: car.city },
              { icon: Users, text: `${car.seats} seats` },
              { icon: Fuel, text: car.fuel_type },
              { icon: Gauge, text: car.transmission },
            ].map((item, i) => (
              <span key={i} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '12px', color: '#94a3b8',
                background: 'rgba(255,255,255,0.04)', padding: '5px 10px',
                borderRadius: '8px', textTransform: 'capitalize',
              }}>
                <item.icon style={{ width: '12px', height: '12px' }} />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
