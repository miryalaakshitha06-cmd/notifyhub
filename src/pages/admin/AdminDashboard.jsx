import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Calendar, HelpCircle, Activity, Plus, Shield, CheckCircle, Users } from 'lucide-react';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    announcements: 0,
    events: 0,
    openQueries: 0,
    resolvedQueries: 0,
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [annRes, evRes, qRes, actRes] = await Promise.all([
          api.get('/api/announcements'),
          api.get('/api/events'),
          api.get('/api/queries'),
          api.get('/api/activity').catch(() => ({ success: false, data: [] })),
        ]);

        const announcements = annRes.data || [];
        const events = evRes.data || [];
        const queries = qRes.data || [];

        const openQ = queries.filter((q) => q.status === 'OPEN' || q.status === 'IN_PROGRESS').length;
        const resQ = queries.filter((q) => q.status === 'RESOLVED').length;

        setStats({
          announcements: announcements.length,
          events: events.length,
          openQueries: openQ,
          resolvedQueries: resQ,
        });

        if (actRes.success) {
          setActivityLogs(actRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Initializing administration control center..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-normal" style={{ marginBottom: '6px' }}>
            {user?.role} PORTAL
          </span>
          <h2 style={{ fontSize: '1.6rem' }}>Welcome back, {user?.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Department: <strong>{user?.department || 'Institution Administration'}</strong>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/admin/announcements" className="btn btn-primary btn-sm">
            <Plus size={16} /> Create Announcement
          </Link>
          <Link to="/admin/events" className="btn btn-secondary btn-sm">
            <Plus size={16} /> Create Event
          </Link>
          <Link to="/admin/queries" className="btn btn-outline btn-sm">
            <HelpCircle size={16} /> Manage Queries ({stats.openQueries})
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-stats">
        <StatCard title="Total Announcements" value={stats.announcements} icon={Megaphone} color="var(--primary)" />
        <StatCard title="Active Events" value={stats.events} icon={Calendar} color="var(--secondary)" />
        <StatCard title="Open Student Tickets" value={stats.openQueries} icon={HelpCircle} color="var(--danger)" />
        <StatCard title="Resolved Queries" value={stats.resolvedQueries} icon={CheckCircle} color="var(--success)" />
      </div>

      {/* Quick Visual Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Recent Activity Trail */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--primary)" /> Recent System Audit Logs
            </h3>
            <Link to="/admin/activity" style={{ fontSize: '0.8rem', fontWeight: 600 }}>View All</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activityLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                No recent activity recorded yet.
              </div>
            ) : (
              activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} style={{ padding: '10px 12px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '2px' }}>
                    <span>{log.user?.name || 'User'} ({log.user?.role})</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>{log.details || log.action}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Overview Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="var(--secondary)" /> Role-Based Access Scoping
          </h3>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block' }}>ADMIN Role</strong>
              Full control over all institutional notices, campus events, user directory, system settings, and complete audit logs.
            </div>
            <div style={{ padding: '12px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block' }}>HOD Role</strong>
              Department-level oversight for announcements, events, and student queries for your assigned department.
            </div>
            <div style={{ padding: '12px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block' }}>FACULTY Role</strong>
              Issue course/academic notices, manage assigned workshops, and respond to student inquiries.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
