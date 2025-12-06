import api from './api';

const bulkService = {
  // Bulk approve leaves
  bulkApproveLeaves: async (leaveIds) => {
    const response = await api.post('/bulk/approve-leaves', { leave_ids: leaveIds });
    return response.data;
  },

  // Bulk reject leaves
  bulkRejectLeaves: async (leaveIds) => {
    const response = await api.post('/bulk/reject-leaves', { leave_ids: leaveIds });
    return response.data;
  },

  // Bulk delete users
  bulkDeleteUsers: async (userIds) => {
    const response = await api.post('/bulk/delete-users', { user_ids: userIds });
    return response.data;
  },
};

export default bulkService;
