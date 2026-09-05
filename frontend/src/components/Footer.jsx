import { Link } from 'react-router-dom';
import { Car, Mail, Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(10,15,30,0.9)',
      padding: '60px 24px 30px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px', marginBottom: '40px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Car style={{ width: '18px', height: '18px', color: '#fff' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800 }} className="gradient-text">GoCar</span>
            </div>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>
              AI-powered car rental platform. Find your perfect ride in minutes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, color: '#fff', marginBottom: '16px', fontSize: '15px' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/cars', label: 'Browse Cars' },
                { to: '/login', label: 'Login' },
                { to: '/signup', label: 'Sign Up' },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{
                  fontSize: '14px', color: '#94a3b8', transition: 'color 0.2s',
                }}
                  onMouseOver={e => e.target.style.color = '#60a5fa'}
                  onMouseOut={e => e.target.style.color = '#94a3b8'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontWeight: 700, color: '#fff', marginBottom: '16px', fontSize: '15px' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['FAQ', 'Terms of Service', 'Privacy Policy', 'Contact Us'].map(text => (
                <span key={text} style={{ fontSize: '14px', color: '#94a3b8', cursor: 'pointer' }}
                  onMouseOver={e => e.target.style.color = '#60a5fa'}
                  onMouseOut={e => e.target.style.color = '#94a3b8'}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 style={{ fontWeight: 700, color: '#fff', marginBottom: '16px', fontSize: '15px' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[ExternalLink, Globe, Mail].map((Icon, i) => (
                <span key={i} style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseOver={e => {e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';}}
                  onMouseOut={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';}}
                >
                  <Icon style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px', textAlign: 'center',
        }}>
          <p style={{ fontSize: '13px', color: '#475569' }}>
            © {new Date().getFullYear()} GoCar. All rights reserved. Built with ❤️ for learning.
          </p>
        </div>
      </div>
    </footer>
  );
}
