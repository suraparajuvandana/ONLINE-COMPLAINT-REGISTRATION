import { createContext, useContext, useState, useCallback } from 'react';
import complaintService from '../services/complaintService';
import { toast } from 'react-toastify';

const ComplaintContext = createContext(null);

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMyComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await complaintService.getMyComplaints();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setComplaints(list);
      return list;
    } catch (err) {
      toast.error('Failed to load your complaints.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssignedComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await complaintService.getAssignedComplaints();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setComplaints(list);
      return list;
    } catch (err) {
      toast.error('Failed to load assigned complaints.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllComplaints = useCallback(async (params) => {
    setLoading(true);
    try {
      const data = await complaintService.getAllComplaints(params);
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setComplaints(list);
      return list;
    } catch (err) {
      toast.error('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComplaintById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await complaintService.getComplaintById(id);
      const complaint = data?.data ?? data;
      setSelectedComplaint(complaint);
      return complaint;
    } catch (err) {
      toast.error('Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createComplaint = useCallback(async (payload) => {
    const data = await complaintService.createComplaint(payload);
    setComplaints((prev) => [data, ...prev]);
    toast.success('Complaint submitted successfully.');
    return data;
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const data = await complaintService.updateComplaintStatus(id, status);
    setComplaints((prev) => prev.map((c) => (c._id === id ? data : c)));
    toast.success('Complaint status updated.');
    return data;
  }, []);

  const assignComplaint = useCallback(async (id, agentId) => {
    const data = await complaintService.assignComplaint(id, agentId);
    setComplaints((prev) => prev.map((c) => (c._id === id ? data : c)));
    toast.success('Complaint assigned.');
    return data;
  }, []);

  const value = {
    complaints,
    selectedComplaint,
    loading,
    fetchMyComplaints,
    fetchAssignedComplaints,
    fetchAllComplaints,
    fetchComplaintById,
    createComplaint,
    updateStatus,
    assignComplaint,
    setSelectedComplaint,
  };

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};

export default ComplaintContext;
