import { Link } from 'react-router-dom';
import '../assets/css/ComplaintCard.css';
import '../assets/css/Forms.css';

const statusClassMap = {
  pending: 'badge-pending',
  'in-progress': 'badge-inprogress',
  resolved: 'badge-resolved',
  rejected: 'badge-rejected',
};

const ComplaintCard = ({ complaint }) => {
  const { _id, title, description, category, status, createdAt } = complaint;

  return (
    <Link to={`/complaints/${_id}`} className="complaint-card">
      <div className="complaint-card-header">
        <h4>{title}</h4>
        <span className={`badge ${statusClassMap[status] || 'badge-pending'}`}>{status}</span>
      </div>
      <p className="description">{description}</p>
      <div className="complaint-card-footer">
        <span>{category}</span>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
};

export default ComplaintCard;
