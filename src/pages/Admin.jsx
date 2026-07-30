import { useState, useEffect } from 'react';
import { 
  getSubjects, addSubject, removeSubject,
  getAnnouncements, addAnnouncement, removeAnnouncement,
  getExercises, addExercise, removeExercise,
  getChapters, addChapter, removeChapter, addLessonToChapter, removeLessonFromChapter,
  getResources, addResource, removeResource,
  getEvents, addEvent, removeEvent,
  getTeacher, updateTeacher
} from '../lib/db';
import { Lock, Trash2, Plus, Bell, PenTool, BookOpen, Layers, FileText, Calendar, User, Save } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('lessons');

  // Subjects & Lessons
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  
  // New Lesson form
  const [lessonChapterId, setLessonChapterId] = useState('');
  const [newLessonName, setNewLessonName] = useState('');
  const [newLessonType, setNewLessonType] = useState('doc');
  const [newLessonLink, setNewLessonLink] = useState('');

  // Other modules states
  const [announcements, setAnnouncements] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [teacher, setTeacher] = useState({ name: '', avatar: '', quote: '', phone: '', email: '' });

  // Forms for other modules
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnType, setNewAnnType] = useState('info');

  const [newExTitle, setNewExTitle] = useState('');
  const [newExDeadline, setNewExDeadline] = useState('');
  const [newExUrgent, setNewExUrgent] = useState(false);
  const [newResName, setNewResName] = useState('');
  const [newResType, setNewResType] = useState('pdf');
  const [newResLink, setNewResLink] = useState('');

  const [newEvTitle, setNewEvTitle] = useState('');
  const [newEvDate, setNewEvDate] = useState('');
  const [newEvDesc, setNewEvDesc] = useState('');
  const [newEvType, setNewEvType] = useState('info');

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    const subs = await getSubjects();
    setSubjects(subs);
    if (subs.length > 0 && !selectedSubject) setSelectedSubject(subs[0]);
    setChapters(await getChapters());
    setAnnouncements(await getAnnouncements());
    setExercises(await getExercises());
    setResources(await getResources());
    setEvents(await getEvents());
    setTeacher(await getTeacher());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '12345678@') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else alert('Mật khẩu không đúng!');
  };
  const handleLogout = () => { setIsAuthenticated(false); sessionStorage.removeItem('admin_auth'); };

  // --- ACTIONS ---
  // Subjects
  const handleAddSubject = async (e) => { e.preventDefault(); if (newSubject.trim()) { await addSubject(newSubject.trim()); await loadData(); setNewSubject(''); } };
  const handleRemoveSubject = async (subject) => { if (window.confirm('Xóa môn học này và toàn bộ chương bên trong?')) { await removeSubject(subject); await loadData(); if(selectedSubject === subject) setSelectedSubject(''); } };
  
  // Chapters
  const handleAddChapter = async (e) => { e.preventDefault(); if (newChapterTitle.trim()) { await addChapter(selectedSubject, newChapterTitle.trim()); await loadData(); setNewChapterTitle(''); } };
  const handleRemoveChapter = async (id) => { if (window.confirm('Xóa chương này?')) { await removeChapter(id); await loadData(); } };

  // Lessons
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (lessonChapterId && newLessonName.trim()) {
      await addLessonToChapter(Number(lessonChapterId), { name: newLessonName, type: newLessonType, link: newLessonLink });
      await loadData();
      setNewLessonName(''); setNewLessonLink('');
    } else alert('Vui lòng chọn chương và nhập tên bài học!');
  };

  // Resources
  const handleAddResource = async (e) => { e.preventDefault(); if (newResName.trim()) { await addResource({ name: newResName, type: newResType, link: newResLink }); await loadData(); setNewResName(''); setNewResLink(''); } };
  
  // Events
  const handleAddEvent = async (e) => { e.preventDefault(); if (newEvTitle.trim() && newEvDate) { await addEvent({ title: newEvTitle, date: newEvDate, description: newEvDesc, type: newEvType }); await loadData(); setNewEvTitle(''); setNewEvDesc(''); setNewEvDate(''); } };
  
  // Teacher
  const handleSaveTeacher = async (e) => { e.preventDefault(); await updateTeacher(teacher); alert('Đã lưu thông tin Giáo viên!'); await loadData(); };

  if (!isAuthenticated) return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center' }}>
        <Lock size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
        <h2 className="section-title">Đăng nhập Quản Trị CMS</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="password" placeholder="Nhập mật khẩu quản trị..." value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
          <button type="submit" className="btn btn-primary">Đăng nhập</button>
        </form>
      </div>
    </div>
  );

  const tabs = [
    { id: 'lessons', name: 'Bài Học', icon: <Layers size={18} /> },
    { id: 'resources', name: 'Tài Liệu', icon: <FileText size={18} /> },
    { id: 'exercises', name: 'Bài Tập', icon: <PenTool size={18} /> },
    { id: 'announcements', name: 'Thông Báo', icon: <Bell size={18} /> },
    { id: 'calendar', name: 'Lịch Sự Kiện', icon: <Calendar size={18} /> },
    { id: 'teacher', name: 'Giáo Viên', icon: <User size={18} /> },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>⚙️ CMS Quản Trị Nội Dung</h1>
        <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}>Đăng Xuất</button>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'none', border: 'none', fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer', borderBottom: activeTab === tab.id ? '3px solid var(--primary-color)' : '3px solid transparent', marginBottom: '-0.65rem', whiteSpace: 'nowrap' }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="card">
        {/* --- TAB BÀI HỌC --- */}
        {activeTab === 'lessons' && (
          <div>
            <h2 className="section-title">Quản lý Môn học & Bài học</h2>
            
            {/* Step 1: Subjects */}
            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ marginBottom: '1rem' }}>1. Môn Học</h3>
              <form onSubmit={handleAddSubject} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" placeholder="Thêm môn mới..." value={newSubject} onChange={(e) => setNewSubject(e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--secondary-color)' }}>Thêm</button>
              </form>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {subjects.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', background: selectedSubject === s ? 'var(--primary-color)' : 'white', color: selectedSubject === s ? 'white' : 'inherit', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '0.25rem 0.25rem 0.25rem 1rem', cursor: 'pointer' }} onClick={() => setSelectedSubject(s)}>
                    <span style={{ marginRight: '0.5rem' }}>{s}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveSubject(s); }} style={{ background: 'none', border: 'none', color: selectedSubject === s ? 'white' : 'var(--danger-color)', cursor: 'pointer', display: 'flex' }}><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 & 3: Chapters & Lessons */}
            {selectedSubject && (
              <div>
                <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>2. Các Chương của môn {selectedSubject}</h3>
                
                <form onSubmit={handleAddChapter} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  <input type="text" placeholder={`Tên chương mới của môn ${selectedSubject}...`} value={newChapterTitle} onChange={(e) => setNewChapterTitle(e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                  <button className="btn btn-primary" style={{ backgroundColor: 'var(--secondary-color)' }}>Thêm Chương</button>
                </form>

                {chapters.filter(c => c.subject === selectedSubject).map(chapter => (
                  <div key={chapter.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{chapter.title}</h4>
                      <button onClick={() => handleRemoveChapter(chapter.id)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}><Trash2 size={16}/></button>
                    </div>
                    
                    <ul style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {chapter.items.map(lesson => (
                        <li key={lesson.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                          <div>
                            <span style={{ fontWeight: 500 }}>[{lesson.type === 'video' ? 'Video' : 'Tài liệu'}]</span> {lesson.name}
                          </div>
                          <button onClick={async () => { await removeLessonFromChapter(chapter.id, lesson.id); await loadData(); }} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}><Trash2 size={16}/></button>
                        </li>
                      ))}
                    </ul>

                    {/* Add Lesson Form inline */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input type="text" placeholder="Tên bài học..." onChange={(e) => {setNewLessonName(e.target.value); setLessonChapterId(chapter.id);}} style={{ flex: 2, minWidth: '150px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                      <select onChange={(e) => setNewLessonType(e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <option value="doc">Tài liệu</option><option value="video">Video</option>
                      </select>
                      <input type="text" placeholder="Link (URL)..." onChange={(e) => setNewLessonLink(e.target.value)} style={{ flex: 2, minWidth: '150px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                      <button onClick={handleAddLesson} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}><Plus size={16}/> Thêm Bài</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB TÀI LIỆU --- */}
        {activeTab === 'resources' && (
          <div>
            <h2 className="section-title">Quản lý Tài Liệu Chung</h2>
            <form onSubmit={handleAddResource} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Tên tài liệu..." value={newResName} onChange={(e) => setNewResName(e.target.value)} style={{ flex: 2, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required/>
              <select value={newResType} onChange={(e) => setNewResType(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <option value="pdf">PDF</option><option value="word">Word</option><option value="ppt">PowerPoint</option><option value="video">Video</option>
              </select>
              <input type="text" placeholder="Link Drive/URL..." value={newResLink} onChange={(e) => setNewResLink(e.target.value)} style={{ flex: 2, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required/>
              <button type="submit" className="btn btn-primary"><Plus size={18}/> Thêm</button>
            </form>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {resources.map(r => (
                <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{r.name}</span> <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({r.type})</span>
                  </div>
                  <button onClick={async () => {await removeResource(r.id); await loadData();}} className="btn btn-outline" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)', padding: '0.5rem' }}><Trash2 size={18}/></button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --- TAB LỊCH SỰ KIỆN --- */}
        {activeTab === 'calendar' && (
          <div>
            <h2 className="section-title">Quản lý Lịch Học & Sự Kiện</h2>
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <input type="text" placeholder="Tên sự kiện..." value={newEvTitle} onChange={(e) => setNewEvTitle(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required/>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="date" value={newEvDate} onChange={(e) => setNewEvDate(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required/>
                <select value={newEvType} onChange={(e) => setNewEvType(e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <option value="info">Thông tin chung</option><option value="exam">Lịch kiểm tra/Thi</option>
                </select>
              </div>
              <textarea placeholder="Ghi chú thêm..." value={newEvDesc} onChange={(e) => setNewEvDesc(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              <button type="submit" className="btn btn-primary"><Plus size={18}/> Đưa vào Lịch</button>
            </form>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {events.map(ev => (
                <li key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h3 style={{ color: ev.type === 'exam' ? 'var(--danger-color)' : 'var(--primary-color)' }}>{ev.title}</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ngày: {ev.date}</div>
                  </div>
                  <button onClick={async () => {await removeEvent(ev.id); await loadData();}} className="btn btn-outline" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)', padding: '0.5rem' }}><Trash2 size={18}/></button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --- TAB GIÁO VIÊN --- */}
        {activeTab === 'teacher' && (
          <div>
            <h2 className="section-title">Thông tin Giáo Viên Chủ Nhiệm</h2>
            <form onSubmit={handleSaveTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tên Giáo Viên</label>
                <input type="text" value={teacher.name} onChange={(e) => setTeacher({...teacher, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required/>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Link Ảnh Đại Diện (Avatar URL)</label>
                <input type="text" value={teacher.avatar} onChange={(e) => setTeacher({...teacher, avatar: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Số Điện Thoại</label>
                  <input type="text" value={teacher.phone} onChange={(e) => setTeacher({...teacher, phone: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
                  <input type="email" value={teacher.email} onChange={(e) => setTeacher({...teacher, email: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Lời ngỏ (Trích dẫn)</label>
                <textarea value={teacher.quote} onChange={(e) => setTeacher({...teacher, quote: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '100px' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}><Save size={18}/> Lưu Thông Tin</button>
            </form>
          </div>
        )}
        
        {/* --- QUẢN LÝ THÔNG BÁO --- */}
        {activeTab === 'announcements' && (
          <div>
            <h2 className="section-title">Quản lý Thông Báo</h2>
            <form onSubmit={async (e) => { e.preventDefault(); if (newAnnTitle.trim() && newAnnContent.trim()) { await addAnnouncement({ title: newAnnTitle, content: newAnnContent, type: newAnnType }); await loadData(); setNewAnnTitle(''); setNewAnnContent(''); } }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <input type="text" placeholder="Tiêu đề thông báo..." value={newAnnTitle} onChange={(e) => setNewAnnTitle(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required />
              <textarea placeholder="Nội dung chi tiết..." value={newAnnContent} onChange={(e) => setNewAnnContent(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '80px' }} required />
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select value={newAnnType} onChange={(e) => setNewAnnType(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <option value="info">Thông báo thường</option>
                  <option value="exam">Lịch kiểm tra</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--accent-color)' }}><Plus size={18} /> Đăng Thông Báo</button>
              </div>
            </form>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {announcements.map(a => (
                <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h3 style={{ color: a.type === 'exam' ? 'var(--primary-color)' : a.type === 'urgent' ? 'var(--danger-color)' : 'var(--text-primary)' }}>{a.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{a.content}</p>
                  </div>
                  <button onClick={async () => { if(window.confirm('Xóa?')) { await removeAnnouncement(a.id); await loadData(); } }} className="btn btn-outline" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)', padding: '0.5rem', height: 'fit-content' }}><Trash2 size={18} /></button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --- QUẢN LÝ BÀI TẬP --- */}
        {activeTab === 'exercises' && (
          <div>
            <h2 className="section-title">Quản lý Bài Tập</h2>
            <form onSubmit={async (e) => { e.preventDefault(); if (newExTitle.trim() && newExDeadline.trim()) { await addExercise({ title: newExTitle, deadline: newExDeadline, urgent: newExUrgent }); await loadData(); setNewExTitle(''); setNewExDeadline(''); setNewExUrgent(false); } }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <input type="text" placeholder="Tên bài tập (VD: Bài tập Toán Chương 1)" value={newExTitle} onChange={(e) => setNewExTitle(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required />
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Hạn nộp</label>
                  <input type="date" value={newExDeadline} onChange={(e) => setNewExDeadline(e.target.value)} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} required />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1rem' }}>
                  <input type="checkbox" checked={newExUrgent} onChange={(e) => setNewExUrgent(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                  Đánh dấu Khẩn cấp
                </label>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}><Plus size={18} /> Giao Bài Tập</button>
              </div>
            </form>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {exercises.map(ex => (
                <li key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', borderLeft: ex.urgent ? '4px solid var(--danger-color)' : '4px solid var(--secondary-color)' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{ex.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hạn nộp: {ex.deadline}</p>
                  </div>
                  <button onClick={async () => { if(window.confirm('Xóa?')) { await removeExercise(ex.id); await loadData(); } }} className="btn btn-outline" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)', padding: '0.5rem' }}><Trash2 size={18} /></button>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
