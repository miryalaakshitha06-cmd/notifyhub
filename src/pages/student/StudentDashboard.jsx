import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Calendar, AlertTriangle, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';
import AnnouncementCard from '../../components/AnnouncementCard';
import AnnouncementModal from '../../components/AnnouncementModal';
import EventCard from '../../components/EventCard';
import EventModal from '../../components/EventModal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function StudentDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [annRes, evRes, qRes] = await Promise.all([
          api.get('/api/announcements', { status: 'PUBLISHED' }),
          api.get('/api/events'),
          api.get('/api/queries'),
        ]);

        if (annRes.success) setAnnouncements(annRes.data || []);
        if (evRes.success) setEvents(evRes.data || []);
        if (qRes.success) setQueries(qRes.data || []);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const urgentNotices = announcements.filter((a) => a.priority === 'URGENT');

  if (loading) return <LoadingSpinner message="Fetching campus announcements and events..." />;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div className="glass-card" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)', border: '1px solid var(--primary-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
          <Sparkles size={18} /> Official Student Hub
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Welcome to NotifyHub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '680px' }}>
          Stay updated with official academic schedules, exam timetables, placement drives, campus events, and query support.
        </p>
      </div>

      {/* Urgent Notice Alert Bar */}
      {urgentNotices.length > 0 && (
        <div
          style={{
            background: 'var(--urgent-bg)',
            border: '2px dashed var(--danger)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <AlertTriangle size={24} color="var(--danger)" style={{ flexShrink: 0 }} />
            <div>
              <span className="badge badge-urgent" style={{ marginBottom: '4px' }}>URGENT ALERT</span>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                {urgentNotices[0].title}
              </div>
            </div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => setSelectedAnnouncement(urgentNotices[0])}>
            View Urgent Notice
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid-stats">
        <StatCard title="Announcements" value={announcements.length} icon={Megaphone} color="var(--primary)" />
        <StatCard title="Upcoming Events" value={events.length} icon={Calendar} color="var(--secondary)" />
        <StatCard title="Urgent Notices" value={urgentNotices.length} icon={AlertTriangle} color="var(--danger)" />
        <StatCard title="My Submitted Queries" value={queries.length} icon={MessageSquare} color="var(--success)" />
      </div>

      {/* Latest Announcements Grid */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Latest Campus Announcements</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Official notices published by administration and faculty</p>
          </div>
          <Link to="/student/announcements" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-cards">
          {announcements.slice(0, 3).map((item) => (
            <AnnouncementCard key={item.id} announcement={item} onViewDetails={(a) => setSelectedAnnouncement(a)} />
          ))}
        </div>
      </section>

      {/* Upcoming Campus Events */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Upcoming Events</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hackathons, workshops, guest lectures, and cultural fests</p>
          </div>
          <Link to="/student/events" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            View All Events <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-cards">
          {events.slice(0, 3).map((item) => (
            <EventCard key={item.id} event={item} onViewDetails={(ev) => setSelectedEvent(ev)} />
          ))}
        </div>
      </section>

      {/* Detail Modals */}
      {selectedAnnouncement && (
        <AnnouncementModal announcement={selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} />
      )}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
