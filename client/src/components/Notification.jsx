import { useEffect, useState, useRef } from 'react';
import notificationService from '../services/notificationService';
import '../assets/css/Notification.css';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const panelRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      // fail silently in UI, notifications are non-critical
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="notification-panel" ref={panelRef}>
      <div className="notification-bell" onClick={() => setOpen((o) => !o)}>
        🔔
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>
      {open && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <div className="notification-empty">No notifications yet</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${!n.read ? 'unread' : ''}`}
                onClick={() => handleMarkRead(n._id)}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
