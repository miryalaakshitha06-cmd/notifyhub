import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function StudentLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '32px 0' }}>
        <Outlet />
      </main>
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--surface)' }}>
        <div className="container">
          <p>© 2026 NotifyHub — Campus Announcement & Event Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
