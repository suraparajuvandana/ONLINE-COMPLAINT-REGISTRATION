import api from './api';

const submitFeedback = async (complaintId, payload) => {
  const { data } = await api.post(`/complaints/${complaintId}/feedback`, payload);
  return data;
};

const getFeedbackByComplaint = async (complaintId) => {
  const { data } = await api.get(`/complaints/${complaintId}/feedback`);
  return data;
};

const getAllFeedback = async () => {
  const { data } = await api.get('/feedback');
  return data;
};

const feedbackService = {
  submitFeedback,
  getFeedbackByComplaint,
  getAllFeedback,
};

export default feedbackService;
