import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Shield, Building2, GraduationCap, ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function PortalSelection() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      {/* Header */}
      <header className="glass-header" style={{ height: '70px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }} className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
              <Sparkles size={18} />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>NotifyHub Portal Select</span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <div className="container" style={{ flex: 1, padding: '40px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>Select Your Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Choose your user role to access NotifyHub</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          {/* Student Portal Card */}
          <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--secondary)' }}>
            <div>
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)', padding: '16px', borderRadius: '50%', width: 'fit-content', marginBottom: '20px' }}>
                <UserCheck size={36} />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Student Portal</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                Explore official announcements, urgent exam schedules, campus events calendar, and submit queries to administration. No login required.
              </p>
            </div>
            <Link to="/student" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Enter Student Portal <ArrowRight size={18} />
            </Link>
          </div>

          {/* Administration Section */}
          <div className="glass-card" style={{ padding: '32px', borderTop: '4px solid var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '16px', borderRadius: '50%', width: 'fit-content', marginBottom: '20px' }}>
                <Shield size={36} />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Administration Portal</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                Authorized institution portal to issue announcements, create campus events, resolve student queries, and monitor activity logs.
              </p>

              {/* 3 Role Card Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                <Link to="/admin/login" className="btn btn-secondary" style={{ justifyContent: 'space-between', padding: '12px 16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
                    <Shield size={18} color="var(--primary)" /> Admin Login
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Institution Access</span>
                </Link>

                <Link to="/hod/login" className="btn btn-secondary" style={{ justifyContent: 'space-between', padding: '12px 16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
                    <Building2 size={18} color="var(--secondary)" /> HOD Login
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Department Level</span>
                </Link>

                <Link to="/faculty/login" className="btn btn-secondary" style={{ justifyContent: 'space-between', padding: '12px 16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
                    <GraduationCap size={18} color="var(--success)" /> Faculty Login
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Faculty & Query Desk</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
