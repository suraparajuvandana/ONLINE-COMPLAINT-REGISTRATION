import { useEffect, useState, useMemo } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintCard from '../components/ComplaintCard';
import Loader from '../components/Loader';
import '../assets/css/AgentDashboard.css';
import '../assets/css/UserDashboard.css';

const statusOptions = ['all', 'pending', 'in-progress', 'resolved', 'rejected'];

const AgentDashboard = () => {
  const { complaints, loading, fetchAssignedComplaints } = useComplaints();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAssignedComplaints();
  }, [fetchAssignedComplaints]);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [complaints, statusFilter, search]);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Assigned Complaints</h2>
      </div>

      <div className="agent-filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All Statuses' : s}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p>No complaints match the current filters.</p>
      ) : (
        <div className="complaint-list">
          {filtered.map((c) => (
            <ComplaintCard key={c._id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
