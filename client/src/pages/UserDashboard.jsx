import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintCard from '../components/ComplaintCard';
import Loader from '../components/Loader';
import '../assets/css/UserDashboard.css';
import '../assets/css/Buttons.css';

const UserDashboard = () => {
  const { complaints, loading, fetchMyComplaints } = useComplaints();

  useEffect(() => {
    fetchMyComplaints();
  }, [fetchMyComplaints]);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'pending').length;
    const inProgress = complaints.filter((c) => c.status === 'in-progress').length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;
    return { total, pending, inProgress, resolved };
  }, [complaints]);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-header">
        <h2>My Complaints</h2>
        <Link to="/complaints/new" className="btn btn-primary">
          + New Complaint
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Complaints</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{stats.inProgress}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <h3>{stats.resolved}</h3>
          <p>Resolved</p>
        </div>
      </div>

      {complaints.length === 0 ? (
        <p>You haven't filed any complaints yet.</p>
      ) : (
        <div className="complaint-list">
          {complaints.map((c) => (
            <ComplaintCard key={c._id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
