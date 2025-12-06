import api from './api';

const roleService = {
  // Get all roles with permissions
  getRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },

  // Get all available permissions
  getPermissions: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },

  // Create a new role
  createRole: async (roleData) => {
    const response = await api.post('/roles', roleData);
    return response.data;
  },

  // Update a role
  updateRole: async (id, roleData) => {
    const response = await api.put(`/roles/${id}`, roleData);
    return response.data;
  },

  // Delete a role
  deleteRole: async (id) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },

  // Assign role to user
  assignRole: async (userId, role) => {
    const response = await api.post(`/users/${userId}/assign-role`, { role });
    return response.data;
  },
};

export default roleService;
