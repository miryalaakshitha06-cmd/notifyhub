import React from 'react';
import { X, Calendar, Building, GraduationCap, Paperclip, Download, User } from 'lucide-react';

export default function AnnouncementModal({ announcement, onClose }) {
  if (!announcement) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-category">{announcement.category}</span>
              <span className={`badge badge-${announcement.priority.toLowerCase()}`}>
                {announcement.priority}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', lineHeight: 1.3 }}>{announcement.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        {/* Metadata */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            background: 'var(--surface-hover)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            Published: {new Date(announcement.publishedAt || announcement.createdAt).toLocaleDateString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building size={14} />
            Department: {announcement.targetDepartment || 'All'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GraduationCap size={14} />
            Target Year: {announcement.targetYear || 'All'}
          </div>
          {announcement.createdBy && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} />
              Issued by: {announcement.createdBy.name} ({announcement.createdBy.role})
            </div>
          )}
        </div>

        {/* Description Body */}
        <div style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
          {announcement.description}
        </div>

        {/* Attachment Download */}
        {announcement.attachmentData && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Official Attachment</h4>
            <a
              href={announcement.attachmentData}
              download={announcement.attachmentName || 'announcement_attachment'}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Paperclip size={16} />
              <span>{announcement.attachmentName || 'Download File'}</span>
              <Download size={14} />
            </a>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
