import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe } from 'lucide-react';

export default function AdminSettings() {
  const [institutionName, setInstitutionName] = useState('NotifyHub Institute of Technology');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [enableUrgentEmails, setEnableUrgentEmails] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>System Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure institutional branding, notification defaults, and security policies</p>
      </div>

      {saved && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
          ✓ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="form-group">
          <label className="form-label">Institution Name</label>
          <input
            type="text"
            className="form-input"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Current Academic Session</label>
          <input
            type="text"
            className="form-input"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Notification & Broadcast Preferences</h4>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={enableUrgentEmails}
              onChange={(e) => setEnableUrgentEmails(e.target.checked)}
            />
            <span>Broadcast urgent notices automatically to student notification feed</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
