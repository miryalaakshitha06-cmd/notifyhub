import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Calendar, Home, Megaphone, HelpCircle, Shield, Menu, X, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/student', label: 'Home', icon: Home },
    { path: '/student/announcements', label: 'Announcements', icon: Megaphone },
    { path: '/student/events', label: 'Events', icon: Calendar },
    { path: '/student/calendar', label: 'Calendar', icon: Calendar },
    { path: '/student/queries', label: 'Student Queries', icon: HelpCircle },
  ];

  const isActive = (path) => {
    if (path === '/student' && location.pathname === '/student') return true;
    if (path !== '/student' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="glass-header">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              background: 'var(--urgent-gradient)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              Notify<span style={{ color: 'var(--primary)' }}>Hub</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>
              STUDENT PORTAL
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className="btn btn-sm"
                style={{
                  background: active ? 'var(--primary-light)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: active ? 700 : 500,
                  border: active ? '1px solid var(--primary)' : '1px solid transparent',
                  padding: '8px 14px',
                }}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NotificationDropdown />
          <ThemeToggle />
          
          <Link to="/portal-select" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={16} />
            <span>Admin Portal</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle btn btn-secondary btn-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '8px' }}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="btn"
                style={{
                  justifyContent: 'flex-start',
                  background: isActive(link.path) ? 'var(--primary-light)' : 'transparent',
                  color: isActive(link.path) ? 'var(--primary)' : 'var(--text-main)',
                }}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
