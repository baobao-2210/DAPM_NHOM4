import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import ServiceDetail from './pages/ServiceDetail';
import RescueRequest from './pages/RescueRequest';
import RescueHistory from './pages/RescueHistory';
import RescueTracking from './pages/RescueTracking';
import CancelRequest from './pages/CancelRequest';
import RescueComplete from './pages/RescueComplete';
import CostEstimation from './pages/CostEstimation';
import UserProfile from './pages/UserProfile';
import Support from './pages/Support';
import Feedback from './pages/Feedback';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/detail" element={<ServiceDetail />} />
        <Route path="/request" element={<RescueRequest />} />
        <Route path="/history" element={<RescueHistory />} />
        <Route path="/tracking" element={<RescueTracking />} />
        <Route path="/cancel" element={<CancelRequest />} />
        <Route path="/complete" element={<RescueComplete />} />
        <Route path="/estimation" element={<CostEstimation />} />
        <Route path="/support" element={<Support />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;