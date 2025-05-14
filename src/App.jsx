import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CalendarView from './components/CalendarView';
import Graficas from './components/Graficas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/graficos" element={<Graficas />} />
      </Routes>
    </Router>
  );
}

export default App;
