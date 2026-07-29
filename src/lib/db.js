const DB_SUBJECTS = 'lophoc_db_subjects';
const DB_ANNOUNCEMENTS = 'lophoc_db_announcements';
const DB_EXERCISES = 'lophoc_db_exercises';
const DB_CHAPTERS = 'lophoc_db_chapters';
const DB_RESOURCES = 'lophoc_db_resources';
const DB_EVENTS = 'lophoc_db_events';
const DB_TEACHER = 'lophoc_db_teacher';

// --- QUẢN LÝ MÔN HỌC ---
export function getSubjects() {
  const data = localStorage.getItem(DB_SUBJECTS);
  return data ? JSON.parse(data) : ['Toán Học', 'Ngữ Văn', 'Tiếng Anh'];
}

export function addSubject(subject) {
  const subjects = getSubjects();
  if (!subjects.includes(subject)) {
    subjects.push(subject);
    localStorage.setItem(DB_SUBJECTS, JSON.stringify(subjects));
  }
}

export function removeSubject(subject) {
  const subjects = getSubjects();
  localStorage.setItem(DB_SUBJECTS, JSON.stringify(subjects.filter(s => s !== subject)));
  // Cần xóa luôn các chương thuộc môn này
  const chapters = getChapters();
  localStorage.setItem(DB_CHAPTERS, JSON.stringify(chapters.filter(c => c.subject !== subject)));
}

// --- QUẢN LÝ THÔNG BÁO ---
export function getAnnouncements() {
  const data = localStorage.getItem(DB_ANNOUNCEMENTS);
  return data ? JSON.parse(data) : [
    { id: 1, title: 'Lịch kiểm tra 15 phút Toán', content: 'Thứ 6 tuần này, nội dung: Giải hệ phương trình.', type: 'exam', date: new Date().toISOString() }
  ];
}

export function addAnnouncement(announcement) {
  const announcements = getAnnouncements();
  announcements.unshift({ ...announcement, id: Date.now(), date: new Date().toISOString() });
  localStorage.setItem(DB_ANNOUNCEMENTS, JSON.stringify(announcements));
}

export function removeAnnouncement(id) {
  localStorage.setItem(DB_ANNOUNCEMENTS, JSON.stringify(getAnnouncements().filter(a => a.id !== id)));
}

// --- QUẢN LÝ BÀI TẬP ---
export function getExercises() {
  const data = localStorage.getItem(DB_EXERCISES);
  return data ? JSON.parse(data) : [
    { id: 1, title: 'Tuần 1: Bài tập Toán Hình học', deadline: '2026-08-05', urgent: true, status: 'pending' }
  ];
}

export function addExercise(exercise) {
  const exercises = getExercises();
  exercises.unshift({ ...exercise, id: Date.now(), status: 'pending' });
  localStorage.setItem(DB_EXERCISES, JSON.stringify(exercises));
}

export function removeExercise(id) {
  localStorage.setItem(DB_EXERCISES, JSON.stringify(getExercises().filter(e => e.id !== id)));
}

// --- QUẢN LÝ BÀI HỌC (CHƯƠNG & BÀI) ---
// Structure: { id, subject, title, items: [{id, name, type, link}] }
export function getChapters() {
  const data = localStorage.getItem(DB_CHAPTERS);
  return data ? JSON.parse(data) : [
    {
      id: 1, subject: 'Toán Học', title: 'Chương 1: Hệ phương trình', items: [
        { id: 101, name: 'Bài 1: Khái niệm', type: 'video', link: '#' }
      ]
    }
  ];
}

export function addChapter(subject, title) {
  const chapters = getChapters();
  chapters.push({ id: Date.now(), subject, title, items: [] });
  localStorage.setItem(DB_CHAPTERS, JSON.stringify(chapters));
}

export function removeChapter(chapterId) {
  localStorage.setItem(DB_CHAPTERS, JSON.stringify(getChapters().filter(c => c.id !== chapterId)));
}

export function addLessonToChapter(chapterId, lesson) {
  const chapters = getChapters();
  const chapter = chapters.find(c => c.id === chapterId);
  if (chapter) {
    chapter.items.push({ ...lesson, id: Date.now() });
    localStorage.setItem(DB_CHAPTERS, JSON.stringify(chapters));
  }
}

export function removeLessonFromChapter(chapterId, lessonId) {
  const chapters = getChapters();
  const chapter = chapters.find(c => c.id === chapterId);
  if (chapter) {
    chapter.items = chapter.items.filter(l => l.id !== lessonId);
    localStorage.setItem(DB_CHAPTERS, JSON.stringify(chapters));
  }
}

// --- QUẢN LÝ TÀI LIỆU ---
export function getResources() {
  const data = localStorage.getItem(DB_RESOURCES);
  return data ? JSON.parse(data) : [
    { id: 1, name: 'Đề cương ôn tập Giữa kì 1', type: 'pdf', link: '#' }
  ];
}

export function addResource(resource) {
  const resources = getResources();
  resources.unshift({ ...resource, id: Date.now() });
  localStorage.setItem(DB_RESOURCES, JSON.stringify(resources));
}

export function removeResource(id) {
  localStorage.setItem(DB_RESOURCES, JSON.stringify(getResources().filter(r => r.id !== id)));
}

// --- QUẢN LÝ LỊCH ---
export function getEvents() {
  const data = localStorage.getItem(DB_EVENTS);
  return data ? JSON.parse(data) : [];
}

export function addEvent(event) {
  const events = getEvents();
  // Sort by date ascending automatically
  events.push({ ...event, id: Date.now() });
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  localStorage.setItem(DB_EVENTS, JSON.stringify(events));
}

export function removeEvent(id) {
  localStorage.setItem(DB_EVENTS, JSON.stringify(getEvents().filter(e => e.id !== id)));
}

// --- QUẢN LÝ GIÁO VIÊN ---
export function getTeacher() {
  const data = localStorage.getItem(DB_TEACHER);
  return data ? JSON.parse(data) : {
    name: 'Thầy/Cô Giáo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher',
    quote: '"Chào các em học sinh yêu quý! Hãy luôn cố gắng học tập và rèn luyện. Thầy/Cô luôn ở đây để hỗ trợ các em trong suốt năm học này."',
    phone: '0123 456 789 (Zalo)',
    email: 'giaovien@lop918ltk.edu.vn'
  };
}

export function updateTeacher(teacherData) {
  localStorage.setItem(DB_TEACHER, JSON.stringify(teacherData));
}
