import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- QUẢN LÝ MÔN HỌC ---
export async function getSubjects() {
  const { data, error } = await supabase.from('subjects').select('*').order('created_at', { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(s => s.name);
}

export async function addSubject(subject) {
  await supabase.from('subjects').insert([{ name: subject }]);
}

export async function removeSubject(subject) {
  await supabase.from('subjects').delete().eq('name', subject);
  await supabase.from('chapters').delete().eq('subject', subject);
}

// --- QUẢN LÝ THÔNG BÁO ---
export async function getAnnouncements() {
  const { data, error } = await supabase.from('announcements').select('*').order('date', { ascending: false });
  return data || [];
}

export async function addAnnouncement(announcement) {
  await supabase.from('announcements').insert([announcement]);
}

export async function removeAnnouncement(id) {
  await supabase.from('announcements').delete().eq('id', id);
}

// --- QUẢN LÝ BÀI TẬP ---
export async function getExercises() {
  const { data, error } = await supabase.from('exercises').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function addExercise(exercise) {
  await supabase.from('exercises').insert([exercise]);
}

export async function removeExercise(id) {
  await supabase.from('exercises').delete().eq('id', id);
}

// --- QUẢN LÝ BÀI HỌC (CHƯƠNG & BÀI) ---
export async function getChapters() {
  const { data, error } = await supabase.from('chapters').select('*').order('created_at', { ascending: true });
  return data || [];
}

export async function addChapter(subject, title) {
  await supabase.from('chapters').insert([{ subject, title, items: [] }]);
}

export async function removeChapter(chapterId) {
  await supabase.from('chapters').delete().eq('id', chapterId);
}

export async function addLessonToChapter(chapterId, lesson) {
  // Fetch current items first
  const { data } = await supabase.from('chapters').select('items').eq('id', chapterId).single();
  if (data) {
    const newItems = [...data.items, { ...lesson, id: Date.now() }];
    await supabase.from('chapters').update({ items: newItems }).eq('id', chapterId);
  }
}

export async function removeLessonFromChapter(chapterId, lessonId) {
  const { data } = await supabase.from('chapters').select('items').eq('id', chapterId).single();
  if (data) {
    const newItems = data.items.filter(l => l.id !== lessonId);
    await supabase.from('chapters').update({ items: newItems }).eq('id', chapterId);
  }
}

// --- QUẢN LÝ TÀI LIỆU ---
export async function getResources() {
  const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function addResource(resource) {
  await supabase.from('resources').insert([resource]);
}

export async function removeResource(id) {
  await supabase.from('resources').delete().eq('id', id);
}

// --- QUẢN LÝ LỊCH ---
export async function getEvents() {
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  return data || [];
}

export async function addEvent(event) {
  await supabase.from('events').insert([event]);
}

export async function removeEvent(id) {
  await supabase.from('events').delete().eq('id', id);
}

// --- QUẢN LÝ GIÁO VIÊN ---
export async function getTeacher() {
  const { data, error } = await supabase.from('teacher').select('*').eq('id', 1).single();
  return data || {
    name: 'Thầy/Cô Giáo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher',
    quote: '"Chào các em học sinh yêu quý!"',
    phone: '0123 456 789 (Zalo)',
    email: 'giaovien@lop918ltk.edu.vn'
  };
}

export async function updateTeacher(teacherData) {
  await supabase.from('teacher').update(teacherData).eq('id', 1);
}
