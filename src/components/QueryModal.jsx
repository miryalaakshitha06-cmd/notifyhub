import React, { useState } from 'react';
import { X, Send, CheckCircle2, User, Clock, MessageSquare } from 'lucide-react';

export default function QueryModal({ query, onClose, onUpdateStatus, isAdmin = false }) {
  const [response, setResponse] = useState(query?.response || '');
  const [status, setStatus] = useState(query?.status || 'OPEN');
  const [loading, setLoading] = useState(false);

  if (!query) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onUpdateStatus) return;
    setLoading(true);
    await onUpdateStatus(query.id, { response, status });
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span className="badge badge-category" style={{ marginBottom: '6px' }}>{query.category}</span>
            <h2 style={{ fontSize: '1.25rem' }}>{query.subject}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Details */}
        <div style={{ background: 'var(--surface-hover)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <strong>Submitted By: {query.studentName || 'Student'} ({query.studentId || 'Anonymous'})</strong>
            <span style={{ color: 'var(--text-muted)' }}>{new Date(query.createdAt).toLocaleString()}</span>
          </div>
          {query.studentEmail && <div style={{ color: 'var(--text-muted)' }}>Email: {query.studentEmail}</div>}
        </div>

        <div style={{ marginBottom: '20px', background: 'var(--surface)', padding: '14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
          <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Query Message:</strong>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{query.description}</p>
        </div>

        {/* Existing Admin Response display */}
        {query.response && !isAdmin && (
          <div style={{ marginBottom: '20px', background: 'var(--success-bg)', padding: '14px', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 700, marginBottom: '6px' }}>
              <CheckCircle2 size={18} /> Official Response ({query.status})
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
              {query.response}
            </p>
            {query.assignedTo && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
                Responded by: {query.assignedTo.name} ({query.assignedTo.role})
              </span>
            )}
          </div>
        )}

        {/* Admin Response Form */}
        {isAdmin ? (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '10px' }}>Administration Action</h4>
            <div className="form-group">
              <label className="form-label">Ticket Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="OPEN">OPEN (Needs Attention)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Under Review)</option>
                <option value="RESOLVED">RESOLVED (Resolved Ticket)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Response Message to Student</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type official administration response..."
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Send size={16} /> {loading ? 'Submitting...' : 'Save & Update Status'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
