import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, color = 'var(--primary)' }) {
  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </span>
        <h2 style={{ fontSize: '2rem', marginTop: '4px', fontWeight: 800 }}>{value}</h2>
        {trend && (
          <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
            {trend}
          </span>
        )}
      </div>
      {Icon && (
        <div style={{ background: `rgba(79, 70, 229, 0.1)`, padding: '14px', borderRadius: 'var(--radius-md)', color }}>
          <Icon size={28} />
        </div>
      )}
    </div>
  );
}
