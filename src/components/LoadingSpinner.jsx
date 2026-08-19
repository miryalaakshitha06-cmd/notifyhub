import React from 'react';

export default function LoadingSpinner({ message = 'Loading campus data...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '16px', color: 'var(--text-muted)' }}>
      <div
        style={{
          width: '42px',
          height: '42px',
          border: '4px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message}</span>
    </div>
  );
}
