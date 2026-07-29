import { useState, useEffect } from 'react';
import { Download, Upload } from 'lucide-react';
import { getExercises } from '../lib/db';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    setExercises(getExercises());
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">📝 Bài Tập</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Danh sách bài tập cần hoàn thành. Nhớ nộp đúng hạn nhé!
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {exercises.length > 0 ? exercises.map((ex) => (
          <div key={ex.id} className="card" style={{ borderLeft: ex.urgent ? '4px solid var(--danger-color)' : '4px solid var(--secondary-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{ex.title}</h3>
                <p style={{ fontSize: '0.9rem', color: ex.urgent ? 'var(--danger-color)' : 'var(--text-secondary)', fontWeight: ex.urgent ? 600 : 400 }}>
                  Hạn nộp: {ex.deadline}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="btn btn-outline">
                  <Download size={16} /> Tải Đề
                </button>
                {ex.status === 'pending' ? (
                  <button className="btn btn-primary">
                    <Upload size={16} /> Nộp Bài
                  </button>
                ) : (
                  <button className="btn" style={{ backgroundColor: 'var(--secondary-color)', color: 'white', cursor: 'default' }}>
                    Đã Nộp
                  </button>
                )}
              </div>
            </div>
          </div>
        )) : (
           <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
             Chưa có bài tập nào được giao.
           </div>
        )}
      </div>
    </div>
  );
}
