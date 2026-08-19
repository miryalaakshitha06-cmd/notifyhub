import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Megaphone, Calendar, HelpCircle, Bell } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      {/* Landing Navbar */}
      <header className="glass-header" style={{ height: '70px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
              <Sparkles size={22} />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
              Notify<span style={{ color: 'var(--primary)' }}>Hub</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle />
            <Link to="/portal-select" className="btn btn-primary btn-sm">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '60px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Glow background circles */}
        <div style={{ position: 'absolute', top: '-10%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--primary-light)', filter: 'blur(100px)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '350px', height: '350px', borderRadius: '50%', background: 'var(--secondary)', opacity: 0.15, filter: 'blur(90px)', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '24px' }}>
            <Sparkles size={16} /> Next-Generation Campus Communication Platform
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1px' }}>
            Connect. Inform. <span style={{ background: 'var(--urgent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Engage.</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            NotifyHub bridges the gap between campus administration and students. Real-time announcements, urgent exam alerts, event coordination, and student query resolution — all in one unified portal.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/student" className="btn btn-primary btn-lg" style={{ minWidth: '200px' }}>
              Enter Student Portal <ArrowRight size={20} />
            </Link>
            <Link to="/portal-select" className="btn btn-secondary btn-lg" style={{ minWidth: '200px' }}>
              <ShieldCheck size={20} /> Administration Login
            </Link>
          </div>

          {/* Feature Highlight Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '70px', textAlign: 'left' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '12px', borderRadius: 'var(--radius-sm)', width: 'fit-content', marginBottom: '16px' }}>
                <Megaphone size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Instant Announcements</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Filter notices by academic year, department, and priority (Urgent, Important, Normal).
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', width: 'fit-content', marginBottom: '16px' }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Campus Events & Calendar</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Stay updated with hackathons, guest lectures, sports meets, and online event registrations.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '12px', borderRadius: 'var(--radius-sm)', width: 'fit-content', marginBottom: '16px' }}>
                <HelpCircle size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Student Query Desk</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Submit queries directly to administration and faculty with instant status tracking.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', width: 'fit-content', marginBottom: '16px' }}>
                <Bell size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Role-Based Access</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Dedicated portals for Admin, HOD, and Faculty with full audit logging and RBAC protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container">
          <p>© 2026 NotifyHub — Campus Announcement & Event Platform</p>
        </div>
      </footer>
    </div>
  );
}
