import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Edit, Trash2, X, Paperclip, Save } from 'lucide-react';
import { api } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import EventCard from '../../components/EventCard';
import EventModal from '../../components/EventModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('OPEN');
  const [targetDepartment, setTargetDepartment] = useState('ALL');
  const [targetYear, setTargetYear] = useState('ALL');
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/events', search ? { search } : {});
      if (res.success) {
        setEvents(res.data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search]);

  const openCreateModal = () => {
    setTitle('');
    setDescription('');
    setStartDate(new Date().toISOString().slice(0, 16));
    setEndDate('');
    setVenue('');
    setOrganizer('');
    setRegistrationDeadline('');
    setRegistrationStatus('OPEN');
    setTargetDepartment('ALL');
    setTargetYear('ALL');
    setAttachment(null);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setStartDate(new Date(item.startDate).toISOString().slice(0, 16));
    setEndDate(item.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : '');
    setVenue(item.venue);
    setOrganizer(item.organizer);
    setRegistrationDeadline(item.registrationDeadline ? new Date(item.registrationDeadline).toISOString().slice(0, 10) : '');
    setRegistrationStatus(item.registrationStatus || 'OPEN');
    setTargetDepartment(item.targetDepartment || 'ALL');
    setTargetYear(item.targetYear || 'ALL');
    setAttachment(item.attachmentData ? { name: item.attachmentName, data: item.attachmentData, type: item.attachmentType } : null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.file) {
        setAttachment(res.file);
      }
    } catch (err) {
      alert('File upload failed: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title,
      description,
      startDate,
      endDate,
      venue,
      organizer,
      registrationDeadline,
      registrationStatus,
      targetDepartment,
      targetYear,
      ...(attachment && {
        attachmentName: attachment.name,
        attachmentType: attachment.type,
        attachmentData: attachment.data,
      }),
    };

    try {
      if (editingItem) {
        await api.put(`/api/events/${editingItem.id}`, payload);
      } else {
        await api.post('/api/events', payload);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/events/${deletingItem.id}`);
      setDeletingItem(null);
      fetchEvents();
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Manage Campus Events</h1>
          <p style={{ color: 'var(--text-muted)' }}>Organize hackathons, workshops, seminars, and cultural fests</p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Create New Event
        </button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search events by title, venue, or organizer..." />

      {loading ? (
        <LoadingSpinner message="Loading campus events..." />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Create your first campus event or hackathon."
          action={
            <button className="btn btn-primary" onClick={openCreateModal}>
              Create Event
            </button>
          }
        />
      ) : (
        <div className="grid-cards">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              isAdmin={true}
              onViewDetails={(item) => setViewingItem(item)}
              onEdit={(item) => openEditModal(item)}
              onDelete={(item) => setDeletingItem(item)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>{editingItem ? 'Edit Campus Event' : 'Create New Campus Event'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hackathon 2026: AI & Automation Challenge"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Venue / Location *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Main Auditorium & Innovation Lab"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Organizer Name / Body</label>
                  <input
                    type="text"
                    className="form-input"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="e.g. Tech Club & CSE Dept"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Registration Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Registration Status</label>
                  <select className="form-select" value={registrationStatus} onChange={(e) => setRegistrationStatus(e.target.value)}>
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="UPCOMING">UPCOMING</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Event Description & Agenda *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide event details, prize pools, and schedule..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Event Brochure (PDF/Image)</label>
                <input type="file" onChange={handleFileUpload} style={{ fontSize: '0.85rem' }} />
                {attachment && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>
                    Attached: {attachment.name}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Save size={16} /> {submitting ? 'Saving...' : editingItem ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingItem && (
        <EventModal event={viewingItem} onClose={() => setViewingItem(null)} />
      )}

      {deletingItem && (
        <ConfirmDialog
          isOpen={!!deletingItem}
          title="Delete Event"
          message={`Are you sure you want to delete event "${deletingItem.title}"?`}
          confirmText="Delete Event"
          onConfirm={handleDelete}
          onCancel={() => setDeletingItem(null)}
          loading={submitting}
        />
      )}
    </div>
  );
}
