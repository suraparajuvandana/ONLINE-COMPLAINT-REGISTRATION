import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/Sidebar.css';

const menuByRole = {
  user: [
    { to: '/dashboard', label: 'My Complaints', icon: '📋' },
    { to: '/complaints/new', label: 'New Complaint', icon: '➕' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ],
  agent: [
    { to: '/agent', label: 'Assigned Complaints', icon: '🗂️' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: '📊' },
    { to: '/admin/complaints', label: 'All Complaints', icon: '📋' },
    { to: '/admin/users', label: 'Manage Users', icon: '👥' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ],
};

const Sidebar = () => {
  const { role } = useAuth();
  const items = menuByRole[role] || [];

  if (items.length === 0) return null;

  return (
    <aside className="sidebar">
      <p className="sidebar-title">Menu</p>
      <ul className="sidebar-menu">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
