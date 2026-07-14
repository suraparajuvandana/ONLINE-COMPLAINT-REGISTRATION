import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import '../assets/css/ComplaintDetails.css';
import '../assets/css/Forms.css';
import '../assets/css/Buttons.css';

const statusClassMap = {
  pending: 'badge-pending',
  'in-progress': 'badge-inprogress',
  resolved: 'badge-resolved',
  rejected: 'badge-rejected',
};

const statusOptions = ['pending', 'in-progress', 'resolved', 'rejected'];

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { selectedComplaint, loading, fetchComplaintById, updateStatus } = useComplaints();
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchComplaintById(id);
  }, [id, fetchComplaintById]);

  if (loading || !selectedComplaint) return <Loader />;

  const { title, description, category, status, createdAt, updatedAt, timeline = [] } =
    selectedComplaint;

  const handleStatusChange = async (e) => {
    await updateStatus(id, e.target.value);
  };

  return (
    <div className="complaint-details">
      <div className="complaint-details-header">
        <h2>{title}</h2>
        <span className={`badge ${statusClassMap[status] || 'badge-pending'}`}>{status}</span>
      </div>

      <p>{description}</p>

      <div className="complaint-meta">
        <div>
          <span>Category</span>
          {category}
        </div>
        <div>
          <span>Filed On</span>
          {new Date(createdAt).toLocaleString()}
        </div>
        <div>
          <span>Last Updated</span>
          {updatedAt ? new Date(updatedAt).toLocaleString() : '—'}
        </div>
      </div>

      {(role === 'agent' || role === 'admin') && (
        <div className="form-group">
          <label htmlFor="status">Update Status</label>
          <select id="status" className="form-control" value={status} onChange={handleStatusChange}>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {status === 'resolved' && role === 'user' && (
        <Link to={`/feedback/${id}`} className="btn btn-primary">
          Leave Feedback
        </Link>
      )}

      <div className="complaint-timeline">
        <h3>Activity Timeline</h3>
        {timeline.length === 0 ? (
          <p>No activity recorded yet.</p>
        ) : (
          timeline.map((event, idx) => (
            <div className="complaint-timeline-item" key={idx}>
              <strong>{event.action}</strong> — {new Date(event.date).toLocaleString()}
              {event.note && <p>{event.note}</p>}
            </div>
          ))
        )}
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default ComplaintDetails;
