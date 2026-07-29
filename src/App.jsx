import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Exercises from './pages/Exercises';
import Resources from './pages/Resources';
import Calendar from './pages/Calendar';
import Teacher from './pages/Teacher';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content container animate-fade-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
