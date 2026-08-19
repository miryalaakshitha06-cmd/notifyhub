import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No items found', description = 'There are no records matching your criteria.', action }) {
  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 24px',
        textAlign: 'center',
        margin: '20px 0',
      }}
    >
      <div style={{ background: 'var(--primary-light)', padding: '16px', borderRadius: '50%', marginBottom: '16px', color: 'var(--primary)' }}>
        <Icon size={36} />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.9rem', marginBottom: action ? '20px' : '0' }}>{description}</p>
      {action && action}
    </div>
  );
}
