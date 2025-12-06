import api from './api';

const leaveService = {
  // Get all leaves (admin sees all, employee sees own)
  getLeaves: async () => {
    const response = await api.get('/leaves');
    return response.data;
  },

  // Get specific leave
  getLeave: async (id) => {
    const response = await api.get(`/leaves/${id}`);
    return response.data;
  },

  // Create leave request
  createLeave: async (leaveData) => {
    const response = await api.post('/leaves', leaveData);
    return response.data;
  },

  // Update leave (approve/reject - admin only)
  updateLeave: async (id, data) => {
    const response = await api.put(`/leaves/${id}`, data);
    return response.data;
  },

  // Delete/cancel leave
  deleteLeave: async (id) => {
    const response = await api.delete(`/leaves/${id}`);
    return response.data;
  },

  // Get leave types
  getLeaveTypes: async () => {
    const response = await api.get('/leave-types');
    return response.data;
  },
};

export default leaveService;
