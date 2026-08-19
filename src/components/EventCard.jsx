import React from 'react';
import { Calendar, MapPin, Users, Clock, Eye } from 'lucide-react';

export default function EventCard({ event, onViewDetails, onEdit, onDelete, isAdmin = false }) {
  const isOpen = event.registrationStatus === 'OPEN';

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        borderTop: '4px solid var(--secondary)',
      }}
    >
      <div>
        {/* Status Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className={`badge ${isOpen ? 'badge-urgent' : 'badge-category'}`} style={{ background: isOpen ? 'var(--success-bg)' : undefined, color: isOpen ? 'var(--success)' : undefined, border: isOpen ? '1px solid var(--success)' : undefined }}>
            {event.registrationStatus || 'OPEN'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Organized by: {event.organizer}
          </span>
        </div>

        {/* Event Title */}
        <h3
          onClick={() => onViewDetails(event)}
          style={{ fontSize: '1.15rem', marginBottom: '8px', cursor: 'pointer', lineHeight: 1.3 }}
        >
          {event.title}
        </h3>

        {/* Short description */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.description}
        </p>

        {/* Key Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={15} color="var(--primary)" />
            <span>{new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} color="var(--primary)" />
            <span>{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={15} color="var(--danger)" />
            <span>{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => onViewDetails(event)}>
          <Eye size={14} /> Event Details
        </button>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '6px' }}>
            {onEdit && (
              <button className="btn btn-outline btn-sm" onClick={() => onEdit(event)} style={{ padding: '4px 8px' }}>
                Edit
              </button>
            )}
            {onDelete && (
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(event)} style={{ padding: '4px 8px' }}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
