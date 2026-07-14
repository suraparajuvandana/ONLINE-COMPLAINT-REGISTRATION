import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDetails from './pages/ComplaintDetails';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ComplaintForm from './components/ComplaintForm';

import { useAuth } from './context/AuthContext';

import './assets/css/App.css';
import './assets/css/Responsive.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <div className="app-body">
        {isAuthenticated && <Sidebar />}
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User routes */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/complaints/new" element={<ComplaintForm />} />
              <Route path="/feedback/:id" element={<Feedback />} />
            </Route>

            {/* Agent routes */}
            <Route element={<ProtectedRoute allowedRoles={['agent']} />}>
              <Route path="/agent" element={<AgentDashboard />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/complaints" element={<AdminDashboard />} />
            </Route>

            {/* Shared authenticated routes */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'agent', 'admin']} />}>
              <Route path="/complaints/:id" element={<ComplaintDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
