import React from 'react';
import { MessageSquare, Clock, CheckCircle, HelpCircle, User } from 'lucide-react';

export default function QueryCard({ query, onClick, onRespond, isAdmin = false }) {
  const getStatusBadge = () => {
    switch (query.status) {
      case 'OPEN':
        return <span className="badge badge-urgent"><Clock size={12} /> Open</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-important"><HelpCircle size={12} /> In Progress</span>;
      case 'RESOLVED':
        return <span className="badge badge-normal" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)' }}><CheckCircle size={12} /> Resolved</span>;
      default:
        return <span className="badge badge-category">{query.status}</span>;
    }
  };

  return (
    <div
      className="glass-card"
      onClick={() => onClick(query)}
      style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        cursor: 'pointer',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="badge badge-category">{query.category}</span>
          {getStatusBadge()}
        </div>

        <h4 style={{ fontSize: '1.05rem', marginBottom: '6px', color: 'var(--text-main)' }}>{query.subject}</h4>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {query.description}
        </p>
      </div>

      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={13} /> {query.studentName || 'Student'} ({query.studentId || 'Ticket'})
          </span>
          <span>{new Date(query.createdAt).toLocaleDateString()}</span>
        </div>

        {query.response && (
          <div style={{ marginTop: '8px', padding: '6px 10px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', color: 'var(--success)', fontWeight: 600 }}>
            ✓ Admin Responded
          </div>
        )}
      </div>
    </div>
  );
}
