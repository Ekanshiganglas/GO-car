import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Menu, X, User, LogOut, LayoutDashboard, Calendar, CreditCard, Shield, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/cars', label: 'Cars' },
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10, 15, 30, 0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 24px', height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Car style={{ width: '22px', height: '22px', color: '#fff' }} />
          </div>
          <span style={{ fontSize: '22px', fontWeight: 800 }} className="gradient-text">GoCar</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
             className="hidden md:flex">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} style={{
              padding: '10px 18px', borderRadius: '12px', fontSize: '14px',
              fontWeight: 600, transition: 'all 0.2s',
              color: isActive(link.path) ? '#fff' : '#94a3b8',
              background: isActive(link.path) ? 'rgba(59,130,246,0.15)' : 'transparent',
            }}>
              {link.label}
            </Link>
          ))}
          {user && (
            <Link to="/dashboard" style={{
              padding: '10px 18px', borderRadius: '12px', fontSize: '14px',
              fontWeight: 600, transition: 'all 0.2s',
              color: isActive('/dashboard') ? '#fff' : '#94a3b8',
              background: isActive('/dashboard') ? 'rgba(59,130,246,0.15)' : 'transparent',
            }}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 16px', borderRadius: '14px', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0', fontSize: '14px', fontWeight: 600,
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
                <ChevronDown style={{ width: '16px', height: '16px', color: '#64748b',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }} />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setDropdownOpen(false)} />
                  <div style={{
                    position: 'absolute', top: '52px', right: 0, zIndex: 50,
                    width: '220px', padding: '8px',
                    background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}>
                    {[
                      { to: '/profile', icon: User, label: 'Profile' },
                      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                      { to: '/bookings', icon: Calendar, label: 'Bookings' },
                      { to: '/payments', icon: CreditCard, label: 'Payments' },
                      ...(user.role === 'admin' ? [{ to: '/admin', icon: Shield, label: 'Admin Portal' }] : []),
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 14px', borderRadius: '10px',
                        fontSize: '14px', color: '#cbd5e1',
                        transition: 'background 0.2s',
                      }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <item.icon style={{ width: '18px', height: '18px', color: '#64748b' }} />
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 14px', borderRadius: '10px', width: '100%',
                      fontSize: '14px', color: '#fb7185', background: 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut style={{ width: '18px', height: '18px' }} />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '10px 22px' }}>Log In</Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '10px 22px' }}>Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '10px', cursor: 'pointer',
              color: '#e2e8f0', display: 'flex',
            }}
          >
            {menuOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden" style={{
          padding: '16px 24px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(10,15,30,0.95)',
        }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)} style={{
              display: 'block', padding: '14px 16px', borderRadius: '12px',
              fontSize: '16px', fontWeight: 600,
              color: isActive(link.path) ? '#fff' : '#94a3b8',
              background: isActive(link.path) ? 'rgba(59,130,246,0.15)' : 'transparent',
              marginBottom: '4px',
            }}>
              {link.label}
            </Link>
          ))}
          {user && (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{
                display: 'block', padding: '14px 16px', borderRadius: '12px',
                fontSize: '16px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px',
              }}>
                Dashboard
              </Link>
              <Link to="/bookings" onClick={() => setMenuOpen(false)} style={{
                display: 'block', padding: '14px 16px', borderRadius: '12px',
                fontSize: '16px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px',
              }}>
                Bookings
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
