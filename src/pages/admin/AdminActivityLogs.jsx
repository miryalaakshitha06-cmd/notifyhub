import React, { useState, useEffect } from 'react';
import { Activity, User, Calendar, Shield } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const res = await api.get('/api/activity');
        if (res.success) {
          setLogs(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load activity logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching activity audit logs..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Activity & Audit Trail</h1>
        <p style={{ color: 'var(--text-muted)' }}>Complete audit log of administrative actions, notice releases, and query responses</p>
      </div>

      {logs.length === 0 ? (
        <EmptyState title="No audit logs" description="System activity will be logged automatically." />
      ) : (
        <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
          <table className="table-responsive" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Timestamp</th>
                <th style={{ padding: '12px' }}>User</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Action</th>
                <th style={{ padding: '12px' }}>Entity</th>
                <th style={{ padding: '12px' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{log.user?.name || 'System User'}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-normal" style={{ fontSize: '0.65rem' }}>{log.user?.role || 'N/A'}</span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary)' }}>{log.action}</td>
                  <td style={{ padding: '12px' }}>{log.entity}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{log.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
