import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Car, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '120px 24px 80px', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.05) 0%, transparent 60%)',
      }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        <div className="glass-card" style={{ padding: '40px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Car style={{ width: '32px', height: '32px', color: '#fff' }} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>Welcome Back</h1>
            <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>Log in to your GoCar account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#475569' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field" style={{ paddingLeft: '44px' }} placeholder="you@example.com" />
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#475569' }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input-field" style={{ paddingLeft: '44px' }} placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '15px', fontSize: '15px', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
              {loading ? (
                <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                <>Log In <ArrowRight style={{ width: '18px', height: '18px' }} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#60a5fa', fontWeight: 600 }}>Sign Up</Link>
            </p>
          </div>

          <div style={{
            marginTop: '24px', padding: '16px', borderRadius: '14px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <p style={{ fontSize: '12px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>Demo Accounts:</p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Admin: admin@gocar.com / admin123</p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>User: user@gocar.com / user123</p>
          </div>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
