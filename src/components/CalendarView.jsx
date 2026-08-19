import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from 'lucide-react';

export default function CalendarView({ events = [], announcements = [], onSelectEvent }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  // Generate grid days
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  // Helper to match events for a given day
  const getEventsForDay = (dateObj) => {
    if (!dateObj) return [];
    const dateStr = dateObj.toISOString().split('T')[0];
    return events.filter((e) => {
      const eDateStr = new Date(e.startDate).toISOString().split('T')[0];
      return eDateStr === dateStr;
    });
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Calendar Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarIcon size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.4rem' }}>{monthNames[month]} {year}</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </button>
          <button className="btn btn-secondary btn-sm" onClick={todayMonth}>
            Today
          </button>
          <button className="btn btn-secondary btn-sm" onClick={nextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Days Grid */}
      <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {calendarDays.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} style={{ minHeight: '100px', background: 'transparent' }} />;
          }

          const dayEvents = getEventsForDay(day);
          const isToday = new Date().toDateString() === day.toDateString();

          return (
            <div
              key={day.toISOString()}
              className="calendar-day"
              style={{
                minHeight: '105px',
                padding: '6px',
                background: isToday ? 'var(--primary-light)' : 'var(--surface)',
                border: isToday ? '2px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: isToday ? 800 : 600, color: isToday ? 'var(--primary)' : 'var(--text-main)' }}>
                {day.getDate()}
              </div>

              {dayEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent && onSelectEvent(ev)}
                  style={{
                    background: 'var(--primary)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '3px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={`${ev.title} @ ${ev.venue}`}
                >
                  {ev.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
