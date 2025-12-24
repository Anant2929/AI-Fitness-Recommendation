import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ActivityForm from './pages/ActivityForm';
import Profile from './pages/Profile'; 
import ActivityAnalysis from './pages/ActivityAnalysis';
import AnalyticsHub from './pages/AnalyticsHub';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activity" element={<ActivityForm />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/analysis/:activityId" element={<ActivityAnalysis />} />
          <Route path="/analytics" element={<AnalyticsHub />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;