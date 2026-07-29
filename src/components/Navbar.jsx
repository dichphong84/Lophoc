import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, FileText, Home, PenTool, User, Lock } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { name: 'Trang Chủ', path: '/', icon: <Home size={18} /> },
    { name: 'Bài Học', path: '/lessons', icon: <BookOpen size={18} /> },
    { name: 'Bài Tập', path: '/exercises', icon: <PenTool size={18} /> },
    { name: 'Tài Liệu', path: '/resources', icon: <FileText size={18} /> },
    { name: 'Lịch', path: '/calendar', icon: <Calendar size={18} /> },
    { name: 'Giáo Viên', path: '/teacher', icon: <User size={18} /> },
    { name: 'Admin', path: '/admin', icon: <Lock size={18} /> },
  ];

  return (
    <nav className="navbar glass">
      <div className="container" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="nav-brand">
          <BookOpen color="var(--primary-color)" size={28} />
          <span>LOP918LTK</span>
        </div>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-link ${path === link.path ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
