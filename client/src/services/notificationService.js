import api from './api';

const normalizeNotifications = (responseData) => {
  const payload = responseData?.data ?? responseData;
  return Array.isArray(payload) ? payload : [];
};

const getNotifications = async () => {
  const { data } = await api.get('/notifications');
  return normalizeNotifications(data);
};

const markAsRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
};

const markAllAsRead = async () => {
  const { data } = await api.patch('/notifications/read-all');
  return data;
};

const deleteNotification = async (id) => {
  const { data } = await api.delete(`/notifications/${id}`);
  return data;
};

const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationService;
