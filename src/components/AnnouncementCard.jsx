import React from 'react';
import { AlertCircle, Calendar, Paperclip, Building, GraduationCap, Eye } from 'lucide-react';

export default function AnnouncementCard({ announcement, onViewDetails, onEdit, onDelete, isAdmin = false }) {
  const isUrgent = announcement.priority === 'URGENT';
  const isImportant = announcement.priority === 'IMPORTANT';

  const getPriorityBadge = () => {
    if (isUrgent) return <span className="badge badge-urgent"><AlertCircle size={12} /> Urgent</span>;
    if (isImportant) return <span className="badge badge-important">Important</span>;
    return <span className="badge badge-normal">Normal</span>;
  };

  return (
    <div
      className={`glass-card ${isUrgent ? 'urgent-highlight' : ''}`}
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        borderLeft: isUrgent ? '4px solid var(--danger)' : isImportant ? '4px solid var(--warning)' : '1px solid var(--glass-border)',
        background: isUrgent ? 'var(--urgent-bg)' : 'var(--glass-bg)',
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-category">{announcement.category}</span>
            {getPriorityBadge()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} />
            {new Date(announcement.publishedAt || announcement.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Title & Preview */}
        <h3
          onClick={() => onViewDetails(announcement)}
          style={{
            fontSize: '1.1rem',
            marginBottom: '8px',
            cursor: 'pointer',
            color: 'var(--text-main)',
            lineHeight: 1.35,
          }}
        >
          {announcement.title}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {announcement.description}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            paddingTop: '12px',
            borderTop: '1px solid var(--border)',
            marginBottom: '12px',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Building size={13} /> {announcement.targetDepartment || 'All Depts'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <GraduationCap size={13} /> {announcement.targetYear || 'All Years'}
          </span>
          {announcement.attachmentName && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600 }}>
              <Paperclip size={13} /> Attachment
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onViewDetails(announcement)}
            style={{ fontSize: '0.8rem' }}
          >
            <Eye size={14} /> Read Full Notice
          </button>

          {isAdmin && (
            <div style={{ display: 'flex', gap: '6px' }}>
              {onEdit && (
                <button className="btn btn-outline btn-sm" onClick={() => onEdit(announcement)} style={{ padding: '4px 8px' }}>
                  Edit
                </button>
              )}
              {onDelete && (
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(announcement)} style={{ padding: '4px 8px' }}>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
