import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { getEvents } from '../lib/db';

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      setEvents(await getEvents());
    }
    load();
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">📅 Lịch Học & Sự Kiện</h1>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        {events.length > 0 ? (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {events.map(ev => (
              <li key={ev.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ minWidth: '80px', textAlign: 'center', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                    Tháng {new Date(ev.date).getMonth() + 1}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {new Date(ev.date).getDate()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', color: ev.type === 'exam' ? 'var(--danger-color)' : 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                    {ev.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <CalendarIcon size={14} />
                    {new Date(ev.date).toLocaleDateString('vi-VN')}
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>{ev.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
            <p>Hiện chưa có sự kiện nào sắp tới.</p>
          </div>
        )}
      </div>
    </div>
  );
}
