import { useState, useEffect } from 'react';
import { Bell, BookOpen, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAnnouncements, getExercises } from '../lib/db';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    setAnnouncements(getAnnouncements());
    // Lấy tối đa 3 bài tập mới nhất/khẩn cấp để hiện ra trang chủ
    setExercises(getExercises().slice(0, 3));
  }, []);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '3rem 1rem', background: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h1 className="page-title">Chào mừng đến với Lớp 918LTK!</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Đây là không gian học tập trực tuyến của lớp chúng ta. Hãy theo dõi bài học, làm bài tập đầy đủ và cập nhật thông báo thường xuyên nhé!
        </p>
      </div>

      <div className="grid-2">
        {/* Thông báo mới nhất */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Bell color="var(--accent-color)" size={24} />
            <h2 className="section-title" style={{ margin: 0 }}>Thông báo mới nhất</h2>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.length > 0 ? announcements.map((a) => (
              <li key={a.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, color: a.type === 'exam' ? 'var(--primary-color)' : a.type === 'urgent' ? 'var(--danger-color)' : 'var(--text-primary)' }}>
                  {a.type === 'exam' ? '📅 ' : a.type === 'urgent' ? '🚨 ' : '🔔 '}{a.title}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{a.content}</p>
              </li>
            )) : (
              <li style={{ color: 'var(--text-secondary)' }}>Không có thông báo mới.</li>
            )}
          </ul>
        </div>

        {/* Bài tập cần làm */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <PenTool color="var(--danger-color)" size={24} />
            <h2 className="section-title" style={{ margin: 0 }}>Bài tập cần làm</h2>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {exercises.length > 0 ? exercises.map((ex) => (
              <li key={ex.id} style={{ padding: '1rem', background: ex.urgent ? '#fee2e2' : '#f1f5f9', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: ex.urgent ? '#991b1b' : 'var(--text-primary)' }}>{ex.title}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, background: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', color: ex.urgent ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                    Hạn: {ex.deadline}
                  </span>
                </div>
              </li>
            )) : (
              <li style={{ color: 'var(--text-secondary)' }}>Bạn đã hoàn thành hết bài tập! Tuyệt vời!</li>
            )}
          </ul>
          <Link to="/exercises" className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem' }}>
            Xem tất cả bài tập
          </Link>
        </div>
      </div>
      
      {/* Quick Links */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h2 className="section-title">Truy cập nhanh</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/lessons" className="btn btn-primary"><BookOpen size={18} /> Vào Học Ngay</Link>
          <Link to="/exercises" className="btn btn-primary" style={{ backgroundColor: 'var(--secondary-color)' }}><PenTool size={18} /> Làm Bài Tập</Link>
        </div>
      </div>
    </div>
  );
}
