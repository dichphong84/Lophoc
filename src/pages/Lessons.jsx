import { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, FileText } from 'lucide-react';
import { getChapters, getSubjects } from '../lib/db';

export default function Lessons() {
  const [chapters, setChapters] = useState([]);
  const [activeSubject, setActiveSubject] = useState('');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    async function load() {
      const loadedSubjects = await getSubjects();
      setSubjects(loadedSubjects);
      if (loadedSubjects.length > 0) {
        setActiveSubject(loadedSubjects[0]);
      }
      setChapters(await getChapters());
    }
    load();
  }, []);

  const currentChapters = chapters.filter(c => c.subject === activeSubject);

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">📚 Bài Học</h1>
      
      {/* Thanh Tabs chọn Môn học */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {subjects.map(subject => (
          <button 
            key={subject}
            onClick={() => setActiveSubject(subject)}
            style={{
              padding: '0.5rem 1.5rem',
              background: 'none',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: activeSubject === subject ? 700 : 500,
              color: activeSubject === subject ? 'var(--primary-color)' : 'var(--text-secondary)',
              cursor: 'pointer',
              borderBottom: activeSubject === subject ? '3px solid var(--primary-color)' : '3px solid transparent',
              marginBottom: '-0.65rem',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
            }}
          >
            {subject}
          </button>
        ))}
        {subjects.length === 0 && (
          <span style={{ color: 'var(--text-secondary)' }}>Chưa có môn học nào được thêm.</span>
        )}
      </div>

      {/* Danh sách chương của môn học đang chọn */}
      <div className="grid-2">
        {currentChapters.length > 0 ? (
          currentChapters.map((chapter) => (
            <div key={chapter.id} className="card animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.5rem' }}>
                {chapter.title}
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {chapter.items.length > 0 ? chapter.items.map((lesson) => (
                  <li key={lesson.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius-md)', transition: 'var(--transition)' }} className="hover-bg">
                    <div style={{ marginTop: '2px', color: lesson.type === 'video' ? 'var(--danger-color)' : 'var(--primary-color)' }}>
                      {lesson.type === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 500, display: 'block' }}>{lesson.name}</span>
                      {lesson.link && lesson.link !== '#' && (
                        <a href={lesson.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'underline' }}>
                          {lesson.type === 'video' ? 'Xem Video' : 'Tải Tài Liệu'}
                        </a>
                      )}
                    </div>
                  </li>
                )) : (
                  <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chưa có bài học trong chương này.</li>
                )}
              </ul>
              <style>{`.hover-bg:hover { background-color: var(--bg-color); }`}</style>
            </div>
          ))
        ) : (
          subjects.length > 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1', background: 'var(--surface-color)', borderRadius: 'var(--radius-md)' }}>
              Giáo viên chưa cập nhật bài học cho môn {activeSubject}.
            </div>
          )
        )}
      </div>
    </div>
  );
}
