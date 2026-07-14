import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/Home.css';
import '../assets/css/Buttons.css';

const features = [
  { icon: '📝', title: 'Easy Filing', desc: 'Submit complaints in seconds with a guided form.' },
  { icon: '🔍', title: 'Real-time Tracking', desc: 'Follow your complaint status from start to resolution.' },
  { icon: '⚡', title: 'Fast Resolution', desc: 'Dedicated agents work to resolve issues quickly.' },
  { icon: '⭐', title: 'Feedback Driven', desc: 'Rate the service you received to help us improve.' },
];

const Home = () => {
  const { isAuthenticated, role } = useAuth();
  const dashboardPath = role === 'admin' ? '/admin' : role === 'agent' ? '/agent' : '/dashboard';

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-text">
          <h1>We're here to resolve your concerns</h1>
          <p>
            The Complaint Management System lets you file, track, and resolve complaints
            transparently — from submission to satisfaction.
          </p>
          {isAuthenticated ? (
            <Link to={dashboardPath} className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          )}
        </div>
      </section>

      <section className="home-features">
        {features.map((f) => (
          <div className="home-feature-card" key={f.title}>
            <div style={{ fontSize: '2rem' }}>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>
    </>
  );
};

export default Home;
