import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-secondary btn-sm ${className}`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme"
      style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)' }}
    >
      {theme === 'dark' ? (
        <>
          <Sun size={18} color="#fbbf24" />
          <span style={{ fontSize: '0.85rem' }}>Light</span>
        </>
      ) : (
        <>
          <Moon size={18} color="#6366f1" />
          <span style={{ fontSize: '0.85rem' }}>Dark</span>
        </>
      )}
    </button>
  );
}
