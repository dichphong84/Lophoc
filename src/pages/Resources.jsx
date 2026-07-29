import { useState, useEffect } from 'react';
import { FileText, File, FileType2, PlaySquare } from 'lucide-react';
import { getResources } from '../lib/db';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setResources(getResources());
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText size={24} color="#ef4444" />;
      case 'word': return <File size={24} color="#2563eb" />;
      case 'ppt': return <FileType2 size={24} color="#f59e0b" />;
      case 'video': return <PlaySquare size={24} color="#10b981" />;
      default: return <File size={24} color="#64748b" />;
    }
  };

  const filteredResources = resources.filter(r => r.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">📖 Tài Liệu</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm tài liệu..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '1rem' }}
        />
      </div>

      <div className="grid-3">
        {filteredResources.length > 0 ? filteredResources.map((res) => (
          <div key={res.id} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '50%' }}>
              {getIcon(res.type)}
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{res.name}</h3>
            {res.link && res.link !== '#' ? (
              <a href={res.link} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }}>
                Tải Về / Xem
              </a>
            ) : (
              <button disabled className="btn btn-outline" style={{ width: '100%', marginTop: 'auto', opacity: 0.5 }}>Chưa có Link</button>
            )}
          </div>
        )) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
            Chưa có tài liệu nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}
