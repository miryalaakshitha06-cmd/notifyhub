import React, { useState, useEffect } from 'react';
import { Plus, Search, Megaphone, Edit, Trash2, X, Paperclip, Upload, Save } from 'lucide-react';
import { api } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import AnnouncementCard from '../../components/AnnouncementCard';
import AnnouncementModal from '../../components/AnnouncementModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals & Dialogs state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [priority, setPriority] = useState('NORMAL');
  const [status, setStatus] = useState('PUBLISHED');
  const [targetDepartment, setTargetDepartment] = useState('ALL');
  const [targetYear, setTargetYear] = useState('ALL');
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/announcements', search ? { search } : {});
      if (res.success) {
        setAnnouncements(res.data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [search]);

  const openCreateModal = () => {
    setTitle('');
    setDescription('');
    setCategory('GENERAL');
    setPriority('NORMAL');
    setStatus('PUBLISHED');
    setTargetDepartment('ALL');
    setTargetYear('ALL');
    setAttachment(null);
    setEditingItem(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setPriority(item.priority);
    setStatus(item.status);
    setTargetDepartment(item.targetDepartment || 'ALL');
    setTargetYear(item.targetYear || 'ALL');
    setAttachment(item.attachmentData ? { name: item.attachmentName, data: item.attachmentData, type: item.attachmentType } : null);
    setIsCreateModalOpen(true);
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
      category,
      priority,
      status,
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
        await api.put(`/api/announcements/${editingItem.id}`, payload);
      } else {
        await api.post('/api/announcements', payload);
      }
      setIsCreateModalOpen(false);
      fetchAnnouncements();
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
      await api.delete(`/api/announcements/${deletingItem.id}`);
      setDeletingItem(null);
      fetchAnnouncements();
    } catch (err) {
      alert(err.message || 'Failed to delete announcement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Manage Announcements</h1>
          <p style={{ color: 'var(--text-muted)' }}>Publish official notices, exam timetables, urgent alerts, and placement info</p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Create Announcement
        </button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by title or content..." />

      {loading ? (
        <LoadingSpinner message="Loading announcements catalog..." />
      ) : announcements.length === 0 ? (
        <EmptyState
          title="No announcements found"
          description="Create your first institutional notice for students."
          action={
            <button className="btn btn-primary" onClick={openCreateModal}>
              Create Announcement
            </button>
          }
        />
      ) : (
        <div className="grid-cards">
          {announcements.map((item) => (
            <AnnouncementCard
              key={item.id}
              announcement={item}
              isAdmin={true}
              onViewDetails={(a) => setViewingItem(a)}
              onEdit={(a) => openEditModal(a)}
              onDelete={(a) => setDeletingItem(a)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>{editingItem ? 'Edit Announcement' : 'Create New Announcement'}</h2>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Announcement Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. End Semester Examination Timetable Released"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="GENERAL">GENERAL</option>
                    <option value="ACADEMIC">ACADEMIC</option>
                    <option value="EXAM">EXAM</option>
                    <option value="PLACEMENT">PLACEMENT</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="EVENT">EVENT</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="NORMAL">NORMAL</option>
                    <option value="IMPORTANT">IMPORTANT</option>
                    <option value="URGENT">URGENT 🚨</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Publish Status</label>
                  <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Target Department</label>
                  <select className="form-select" value={targetDepartment} onChange={(e) => setTargetDepartment(e.target.value)}>
                    <option value="ALL">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Academic Year</label>
                  <select className="form-select" value={targetYear} onChange={(e) => setTargetYear(e.target.value)}>
                    <option value="ALL">All Academic Years</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notice Details & Description *</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide comprehensive details regarding the notice..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Official Attachment (PDF/Image)</label>
                <input type="file" onChange={handleFileUpload} style={{ fontSize: '0.85rem' }} />
                {attachment && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Paperclip size={14} /> Attached: {attachment.name}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Save size={16} /> {submitting ? 'Saving...' : editingItem ? 'Update Notice' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingItem && (
        <AnnouncementModal announcement={viewingItem} onClose={() => setViewingItem(null)} />
      )}

      {/* Delete Confirmation */}
      {deletingItem && (
        <ConfirmDialog
          isOpen={!!deletingItem}
          title="Delete Announcement"
          message={`Are you sure you want to permanently delete "${deletingItem.title}"? This operation cannot be undone.`}
          confirmText="Delete Notice"
          onConfirm={handleDelete}
          onCancel={() => setDeletingItem(null)}
          loading={submitting}
        />
      )}
    </div>
  );
}
