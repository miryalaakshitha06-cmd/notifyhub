import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Megaphone,
  Calendar,
  HelpCircle,
  Activity,
  Users,
  Settings,
  LogOut,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/portal-select');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { path: '/admin/events', label: 'Campus Events', icon: Calendar },
    { path: '/admin/queries', label: 'Student Queries', icon: HelpCircle },
    { path: '/admin/activity', label: 'Activity Audit Logs', icon: Activity, roles: ['ADMIN', 'HOD'] },
    { path: '/admin/users', label: 'User Directory', icon: Users, roles: ['ADMIN'] },
    { path: '/admin/settings', label: 'System Settings', icon: Settings, roles: ['ADMIN'] },
  ];

  const filteredNav = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside
      className={`sidebar glass-card ${isOpen ? 'open' : ''}`}
      style={{
        width: '260px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        borderRadius: 0,
        borderRight: '1px solid var(--border)',
        padding: '20px 16px',
        background: 'var(--surface)',
      }}
    >
      <div>
        {/* Brand */}
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '28px' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: 'var(--radius-sm)', color: '#ffffff' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
              Notify<span style={{ color: 'var(--primary)' }}>Hub</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              ADMINISTRATION
            </span>
          </div>
        </Link>

        {/* User Card */}
        {user && (
          <div style={{ background: 'var(--surface-hover)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge badge-normal" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>{user.role}</span>
              <span>{user.department || 'Campus'}</span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="btn"
                style={{
                  justifyContent: 'flex-start',
                  background: active ? 'var(--primary-light)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.9rem',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <Link to="/student" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '8px', fontSize: '0.85rem' }}>
          <UserCheck size={16} /> View Student View
        </Link>
        <button
          onClick={handleLogout}
          className="btn btn-danger"
          style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
