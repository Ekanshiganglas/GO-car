import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Car, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome to GoCar!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Doe', required: true },
    { name: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com', required: true },
    { name: 'phone', label: 'Phone (Optional)', type: 'tel', icon: Phone, placeholder: '+91 9876543210' },
    { name: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: 'Min 6 characters', required: true },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '120px 24px 80px', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.05) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.05) 0%, transparent 60%)',
      }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        <div className="glass-card" style={{ padding: '40px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Car style={{ width: '32px', height: '32px', color: '#fff' }} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>Create Account</h1>
            <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>Join GoCar and start driving today</p>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.map(field => (
              <div key={field.name} style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>{field.label}</label>
                <div style={{ position: 'relative' }}>
                  <field.icon style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#475569' }} />
                  <input
                    type={field.type} name={field.name} value={form[field.name]}
                    onChange={handleChange} className="input-field"
                    style={{ paddingLeft: '44px' }} placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '15px', fontSize: '15px', justifyContent: 'center', marginTop: '8px', opacity: loading ? 0.6 : 1 }}>
              {loading ? (
                <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                <>Create Account <ArrowRight style={{ width: '18px', height: '18px' }} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600 }}>Log In</Link>
            </p>
          </div>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
