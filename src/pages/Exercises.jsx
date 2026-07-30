import { useState, useEffect } from 'react';
import { Download, Upload, MessageCircle } from 'lucide-react';
import { getExercises, getTeacher } from '../lib/db';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    async function load() {
      setExercises(await getExercises());
      setTeacher(await getTeacher());
    }
    load();
  }, []);

  const handleSubmit = (title) => {
    if (teacher && teacher.phone) {
      let phone = teacher.phone.replace(/[^0-9]/g, '');
      if (phone.startsWith('0')) phone = '84' + phone.substring(1);
      const message = encodeURIComponent(`Dạ thưa thầy/cô, em nộp bài tập: ${title}`);
      window.open(`https://zalo.me/${phone}?text=${message}`, '_blank');
    } else {
      alert('Giáo viên chưa cập nhật số điện thoại Zalo!');
    }
  };

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
                <button onClick={() => handleSubmit(ex.title)} className="btn btn-primary" style={{ backgroundColor: '#0068ff', border: 'none' }}>
                  <MessageCircle size={16} /> Nộp Bài qua Zalo
                </button>
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
