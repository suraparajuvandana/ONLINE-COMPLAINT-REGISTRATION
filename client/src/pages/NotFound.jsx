import { Link } from 'react-router-dom';
import '../assets/css/Buttons.css';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary-color)' }}>404</h1>
      <p style={{ marginBottom: '24px', fontSize: '1.1rem' }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
