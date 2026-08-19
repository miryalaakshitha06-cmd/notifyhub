import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Bell, CheckCheck, AlertCircle, Calendar, MessageSquare, Info } from 'lucide-react';

export default function StudentNotifications() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'URGENT':
        return <AlertCircle size={22} color="var(--danger)" />;
      case 'EVENT':
        return <Calendar size={22} color="var(--secondary)" />;
      case 'QUERY':
      case 'QUERY_RESPONSE':
        return <MessageSquare size={22} color="var(--success)" />;
      default:
        return <Info size={22} color="var(--primary)" />;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Notification Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time updates on urgent announcements, events, and query responses</p>
        </div>

        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={markAllAsRead}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching campus notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up! Important notices will appear here." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markAsRead(n.id)}
              className="glass-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                borderLeft: n.type === 'URGENT' ? '4px solid var(--danger)' : n.isRead ? '1px solid var(--border)' : '4px solid var(--primary)',
                background: n.isRead ? 'var(--surface)' : 'var(--primary-light)',
                cursor: n.isRead ? 'default' : 'pointer',
              }}
            >
              <div style={{ marginTop: '2px' }}>{getIcon(n.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{n.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.message}</p>
              </div>
              {!n.isRead && (
                <span className="badge badge-normal" style={{ fontSize: '0.65rem' }}>NEW</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
