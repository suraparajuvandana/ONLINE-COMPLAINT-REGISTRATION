import api from './api';

const normalizeAuthPayload = (responseData) => {
  const payload = responseData?.data ?? responseData;
  const user = payload?.user ?? payload;
  return {
    ...payload,
    user,
    token: payload?.token,
  };
};

const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  const authData = normalizeAuthPayload(data);
  if (authData?.token) {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }
  return authData.user;
};

const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  const authData = normalizeAuthPayload(data);
  return authData.user || authData;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const getToken = () => localStorage.getItem('token');

const updateProfile = async (payload) => {
  const { data } = await api.put('/auth/profile', payload);
  if (data?.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

const changePassword = async (payload) => {
  const { data } = await api.put('/auth/change-password', payload);
  return data;
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getToken,
  updateProfile,
  changePassword,
};

export default authService;
