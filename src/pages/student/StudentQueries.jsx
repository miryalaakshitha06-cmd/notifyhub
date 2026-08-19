import React, { useState, useEffect } from 'react';
import { Plus, Search, MessageSquare, CheckCircle, HelpCircle, Clock, Send, X, Paperclip } from 'lucide-react';
import { api } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import QueryCard from '../../components/QueryCard';
import QueryModal from '../../components/QueryModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function StudentQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);

  // Submit form state
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const params = {
        ...(search && { search }),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
      };
      const res = await api.get('/api/queries', params);
      if (res.success) {
        setQueries(res.data || []);
      }
    } catch (err) {
      console.error('Fetch queries error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [search, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess('');

    try {
      const res = await api.post('/api/queries', {
        subject,
        description,
        category,
        studentName,
        studentEmail,
        studentId,
      });

      if (res.success) {
        setSubmitSuccess('Query submitted successfully! Administration has been notified.');
        setSubject('');
        setDescription('');
        setTimeout(() => {
          setIsSubmitModalOpen(false);
          setSubmitSuccess('');
          fetchQueries();
        }, 1500);
      }
    } catch (err) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Student Query Desk</h1>
          <p style={{ color: 'var(--text-muted)' }}>Submit tickets regarding exams, marks discrepancy, placement portal, or campus Wi-Fi</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsSubmitModalOpen(true)}>
          <Plus size={18} /> Submit New Query
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Track by Roll No, Query Subject, or Email..." />
        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="ALL">All Statuses</option>
          <option value="OPEN">OPEN Tickets</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching query tickets..." />
      ) : queries.length === 0 ? (
        <EmptyState
          title="No queries found"
          description="Have a question or discrepancy? Submit a query ticket and track official administration responses."
          action={
            <button className="btn btn-primary" onClick={() => setIsSubmitModalOpen(true)}>
              Submit Query Ticket
            </button>
          }
        />
      ) : (
        <div className="grid-cards">
          {queries.map((q) => (
            <QueryCard key={q.id} query={q} onClick={(item) => setSelectedQuery(item)} />
          ))}
        </div>
      )}

      {/* Submit Query Modal */}
      {isSubmitModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSubmitModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>Submit Student Query Ticket</h2>
              <button onClick={() => setIsSubmitModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {submitSuccess && (
              <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.88rem' }}>
                {submitSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Subject / Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Marks Discrepancy in DS Mid-Sem Exam"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="GENERAL">GENERAL</option>
                    <option value="EXAM">EXAM</option>
                    <option value="ACADEMIC">ACADEMIC</option>
                    <option value="PLACEMENT">PLACEMENT</option>
                    <option value="HOSTEL">HOSTEL & IT</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Roll No / Student ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. CS2023-089"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="alex@student.edu"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Query Description *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide complete details regarding your inquiry or issue..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsSubmitModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Query Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Query Detail Modal */}
      {selectedQuery && (
        <QueryModal query={selectedQuery} onClose={() => setSelectedQuery(null)} />
      )}
    </div>
  );
}
