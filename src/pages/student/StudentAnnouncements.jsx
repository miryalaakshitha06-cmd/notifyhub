import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import FilterBar from '../../components/FilterBar';
import AnnouncementCard from '../../components/AnnouncementCard';
import AnnouncementModal from '../../components/AnnouncementModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: 'ALL', priority: 'ALL', department: 'ALL', year: 'ALL' });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        setLoading(true);
        const params = {
          status: 'PUBLISHED',
          ...(search && { search }),
          ...(filters.category !== 'ALL' && { category: filters.category }),
          ...(filters.priority !== 'ALL' && { priority: filters.priority }),
          ...(filters.department !== 'ALL' && { department: filters.department }),
          ...(filters.year !== 'ALL' && { year: filters.year }),
        };
        const res = await api.get('/api/announcements', params);
        if (res.success) {
          setAnnouncements(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnnouncements();
  }, [search, filters]);

  const categories = ['ACADEMIC', 'EXAM', 'PLACEMENT', 'WORKSHOP', 'EVENT', 'GENERAL'];
  const priorities = ['NORMAL', 'IMPORTANT', 'URGENT'];
  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Administration'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Campus Announcements</h1>
        <p style={{ color: 'var(--text-muted)' }}>Official notifications, exam schedules, and academic updates</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by announcement title or description..." />
      </div>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        priorities={priorities}
        departments={departments}
        years={years}
      />

      {loading ? (
        <LoadingSpinner message="Filtering announcements..." />
      ) : announcements.length === 0 ? (
        <EmptyState title="No announcements found" description="Try adjusting your search terms or filter selections." />
      ) : (
        <div className="grid-cards">
          {announcements.map((item) => (
            <AnnouncementCard key={item.id} announcement={item} onViewDetails={(a) => setSelectedAnnouncement(a)} />
          ))}
        </div>
      )}

      {selectedAnnouncement && (
        <AnnouncementModal announcement={selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} />
      )}
    </div>
  );
}
