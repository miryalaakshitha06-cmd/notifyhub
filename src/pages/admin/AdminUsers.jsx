import React from 'react';
import { Users, Shield, Building2, GraduationCap, Mail } from 'lucide-react';

export default function AdminUsers() {
  const sampleUsers = [
    { id: '1', name: 'Dr. Arthur Pendelton', email: 'admin@notifyhub.com', role: 'ADMIN', department: 'Administration' },
    { id: '2', name: 'Prof. Sarah Jenkins', email: 'hod@notifyhub.com', role: 'HOD', department: 'Computer Science' },
    { id: '3', name: 'Dr. Rajesh Kumar', email: 'faculty@notifyhub.com', role: 'FACULTY', department: 'Computer Science' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>User & Role Directory</h1>
        <p style={{ color: 'var(--text-muted)' }}>Institutional user profiles and assigned access control levels</p>
      </div>

      <div className="grid-cards">
        {sampleUsers.map((u) => (
          <div key={u.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`badge ${u.role === 'ADMIN' ? 'badge-urgent' : u.role === 'HOD' ? 'badge-important' : 'badge-normal'}`}>
                {u.role}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID #{u.id}</span>
            </div>

            <h3 style={{ fontSize: '1.2rem' }}>{u.name}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="var(--primary)" /> {u.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={14} color="var(--secondary)" /> {u.department}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
