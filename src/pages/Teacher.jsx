import { useState, useEffect } from 'react';
import { Mail, Phone } from 'lucide-react';
import { getTeacher } from '../lib/db';

export default function Teacher() {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    setTeacher(getTeacher());
  }, []);

  if (!teacher) return null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className="page-title" style={{ width: '100%', textAlign: 'left' }}>👨‍🏫 Giáo Viên Chủ Nhiệm</h1>
      
      <div className="card" style={{ maxWidth: '600px', width: '100%', marginTop: '2rem', textAlign: 'center' }}>
        <img 
          src={teacher.avatar} 
          alt="Avatar Giáo viên" 
          style={{ width: '150px', height: '150px', borderRadius: '50%', border: '4px solid var(--primary-light)', marginBottom: '1.5rem', objectFit: 'cover' }}
        />
        <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>{teacher.name}</h2>
        <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '1rem' }}>Giáo viên chủ nhiệm lớp LOP918LTK</p>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontStyle: 'italic', lineHeight: 1.8 }}>
          {teacher.quote}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Thông tin liên hệ</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Phone size={18} color="var(--primary-color)" />
            <span>{teacher.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={18} color="var(--primary-color)" />
            <span>{teacher.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
