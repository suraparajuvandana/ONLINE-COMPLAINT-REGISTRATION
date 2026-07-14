import api from './api';

const unwrapPayload = (responseData) => responseData?.data ?? responseData;

const createComplaint = async (payload) => {
  const { data } = await api.post('/complaints', payload);
  return unwrapPayload(data);
};

const getMyComplaints = async () => {
  const { data } = await api.get('/complaints/my');
  return unwrapPayload(data);
};

const getAssignedComplaints = async () => {
  const { data } = await api.get('/complaints/assigned');
  return unwrapPayload(data);
};

const getAllComplaints = async (params = {}) => {
  const { data } = await api.get('/complaints', { params });
  return unwrapPayload(data);
};

const getComplaintById = async (id) => {
  const { data } = await api.get(`/complaints/${id}`);
  return unwrapPayload(data);
};

const updateComplaintStatus = async (id, status) => {
  const { data } = await api.patch(`/complaints/${id}/status`, { status });
  return unwrapPayload(data);
};

const assignComplaint = async (id, agentId) => {
  const { data } = await api.patch(`/complaints/${id}/assign`, { agentId });
  return unwrapPayload(data);
};

const addComplaintComment = async (id, comment) => {
  const { data } = await api.post(`/complaints/${id}/comments`, { comment });
  return unwrapPayload(data);
};

const deleteComplaint = async (id) => {
  const { data } = await api.delete(`/complaints/${id}`);
  return unwrapPayload(data);
};

const complaintService = {
  createComplaint,
  getMyComplaints,
  getAssignedComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  addComplaintComment,
  deleteComplaint,
};

export default complaintService;
