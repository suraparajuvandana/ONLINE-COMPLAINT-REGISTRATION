import { useEffect, useMemo, useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import Loader from '../components/Loader';
import '../assets/css/AdminDashboard.css';
import '../assets/css/Table.css';
import '../assets/css/Forms.css';

const statusClassMap = {
  pending: 'badge-pending',
  'in-progress': 'badge-inprogress',
  resolved: 'badge-resolved',
  rejected: 'badge-rejected',
};

const AdminDashboard = () => {
  const { complaints, loading, fetchAllComplaints, assignComplaint } = useComplaints();
  const [agentIdInput, setAgentIdInput] = useState({});

  useEffect(() => {
    fetchAllComplaints();
  }, [fetchAllComplaints]);

  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;
    const pending = complaints.filter((c) => c.status === 'pending').length;
    const unassigned = complaints.filter((c) => !c.assignedTo).length;
    return { total, resolved, pending, unassigned };
  }, [complaints]);

  const handleAssign = async (id) => {
    const agentId = agentIdInput[id];
    if (!agentId) return;
    await assignComplaint(id, agentId);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Admin Overview</h2>

      <div className="admin-grid">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Complaints</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{stats.resolved}</h3>
          <p>Resolved</p>
        </div>
        <div className="stat-card">
          <h3>{stats.unassigned}</h3>
          <p>Unassigned</p>
        </div>
      </div>

      <div className="admin-section">
        <h3>All Complaints</h3>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Assigned Agent (ID)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td>{c.category}</td>
                  <td>
                    <span className={`badge ${statusClassMap[c.status] || 'badge-pending'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{c.assignedTo || '—'}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="Agent ID"
                      style={{ width: '110px', marginRight: '6px' }}
                      className="form-control"
                      value={agentIdInput[c._id] || ''}
                      onChange={(e) =>
                        setAgentIdInput({ ...agentIdInput, [c._id]: e.target.value })
                      }
                    />
                    <button className="btn btn-outline" onClick={() => handleAssign(c._id)}>
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
