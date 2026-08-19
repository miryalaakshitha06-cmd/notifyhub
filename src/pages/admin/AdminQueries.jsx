import React, { useState, useEffect } from 'react';
import { HelpCircle, Search, Filter } from 'lucide-react';
import { api } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import QueryCard from '../../components/QueryCard';
import QueryModal from '../../components/QueryModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedQuery, setSelectedQuery] = useState(null);

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

  const handleUpdateStatus = async (id, data) => {
    try {
      await api.put(`/api/queries/${id}`, data);
      fetchQueries();
    } catch (err) {
      alert(err.message || 'Failed to update ticket');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Student Queries Inbox</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review student inquiries, marks discrepancies, and provide official administration responses</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student name, roll no, or subject..." />
        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="ALL">All Statuses</option>
          <option value="OPEN">OPEN Tickets</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching student query inbox..." />
      ) : queries.length === 0 ? (
        <EmptyState title="No query tickets found" description="All student inquiries have been resolved." />
      ) : (
        <div className="grid-cards">
          {queries.map((q) => (
            <QueryCard key={q.id} query={q} isAdmin={true} onClick={(item) => setSelectedQuery(item)} />
          ))}
        </div>
      )}

      {selectedQuery && (
        <QueryModal
          query={selectedQuery}
          isAdmin={true}
          onClose={() => setSelectedQuery(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
