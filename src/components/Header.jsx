import React from 'react';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../context/AuthContext';

export default function Header({ title = 'Administration Dashboard', onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="glass-header" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onToggleSidebar && (
          <button className="btn btn-secondary btn-sm" onClick={onToggleSidebar} style={{ padding: '8px' }}>
            <Menu size={20} />
          </button>
        )}
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <NotificationDropdown />
        <ThemeToggle />
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              {user.name?.charAt(0) || 'A'}
            </div>
            <div style={{ display: 'none', md: 'block' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>{user.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
