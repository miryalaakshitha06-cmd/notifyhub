import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Clock, Paperclip, Download, CheckCircle2 } from 'lucide-react';

export default function EventModal({ event, onClose }) {
  const [registered, setRegistered] = useState(false);

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span className="badge badge-normal" style={{ marginBottom: '6px' }}>
              {event.registrationStatus || 'OPEN'}
            </span>
            <h2 style={{ fontSize: '1.4rem' }}>{event.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ background: 'var(--surface-hover)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Date & Time:</strong>
              <div>{new Date(event.startDate).toLocaleString()}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Venue:</strong>
              <div>{event.venue}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Organizer:</strong>
              <div>{event.organizer}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Registration Deadline:</strong>
              <div>{event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : 'N/A'}</div>
            </div>
          </div>
        </div>

        <h4 style={{ marginBottom: '8px', fontSize: '0.95rem' }}>About this Event</h4>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
          {event.description}
        </p>

        {event.attachmentData && (
          <div style={{ marginBottom: '24px' }}>
            <a
              href={event.attachmentData}
              download={event.attachmentName || 'event_brochure'}
              className="btn btn-secondary btn-sm"
            >
              <Paperclip size={16} /> {event.attachmentName || 'Download Brochure'} <Download size={14} />
            </a>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          {registered ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem' }}>
              <CheckCircle2 size={20} /> You are registered for this event!
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setRegistered(true)}>
              Register for Event
            </button>
          )}

          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
