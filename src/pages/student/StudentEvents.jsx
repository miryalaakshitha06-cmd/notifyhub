import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import EventCard from '../../components/EventCard';
import EventModal from '../../components/EventModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const params = {
          ...(search && { search }),
          ...(registrationStatus !== 'ALL' && { registrationStatus }),
        };
        const res = await api.get('/api/events', params);
        if (res.success) {
          setEvents(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [search, registrationStatus]);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Campus Events & Activities</h1>
        <p style={{ color: 'var(--text-muted)' }}>Participate in hackathons, workshops, guest lectures, and sports meets</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by event title, venue, or organizer..." />
        <select
          className="form-select"
          value={registrationStatus}
          onChange={(e) => setRegistrationStatus(e.target.value)}
          style={{ width: 'auto', minWidth: '180px' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Registrations OPEN</option>
          <option value="CLOSED">CLOSED</option>
          <option value="UPCOMING">UPCOMING</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading campus events..." />
      ) : events.length === 0 ? (
        <EmptyState title="No campus events found" description="Check back soon for new hackathons and workshops." />
      ) : (
        <div className="grid-cards">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} onViewDetails={(item) => setSelectedEvent(item)} />
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
