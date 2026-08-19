import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import CalendarView from '../../components/CalendarView';
import EventModal from '../../components/EventModal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function StudentCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const res = await api.get('/api/events');
        if (res.success) {
          setEvents(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching calendar events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  if (loading) return <LoadingSpinner message="Loading campus calendar..." />;

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Campus Event Calendar</h1>
        <p style={{ color: 'var(--text-muted)' }}>Interactive schedule of academic deadlines, hackathons, and campus activities</p>
      </div>

      <CalendarView events={events} onSelectEvent={(ev) => setSelectedEvent(ev)} />

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
