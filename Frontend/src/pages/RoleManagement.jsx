import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import roleService from '../services/roleService';
import './RoleManagement.css';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesData, permsData] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permsData);
    } catch (err) {
      setError('Failed to load roles and permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        permissions: role.permissions.map(p => p.name),
      });
    } else {
      setEditingRole(null);
      setFormData({ name: '', permissions: [] });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setFormData({ name: '', permissions: [] });
  };

  const handlePermissionToggle = (permName) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permName)
        ? prev.permissions.filter(p => p !== permName)
        : [...prev.permissions, permName],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingRole) {
        await roleService.updateRole(editingRole.id, formData);
        setSuccess('Role updated successfully!');
      } else {
        await roleService.createRole(formData);
        setSuccess('Role created successfully!');
      }
      fetchData();
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save role');
    }
  };

  const handleDelete = async (id, roleName) => {
    if (!window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      return;
    }

    try {
      await roleService.deleteRole(id);
      setSuccess('Role deleted successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete role');
    }
  };

  const isSystemRole = (roleName) => {
    return ['admin', 'employee', 'department_manager'].includes(roleName);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="loading">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Role Management</h1>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            + Create Role
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="roles-grid">
          {roles.map((role) => (
            <div key={role.id} className={`role-card ${isSystemRole(role.name) ? 'system-role' : ''}`}>
              <div className="role-header">
                <h3>{role.name}</h3>
                {isSystemRole(role.name) && <span className="system-badge">System</span>}
              </div>
              <div className="role-body">
                <p className="permission-count">
                  {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                </p>
                <div className="permission-list">
                  {role.permissions.slice(0, 5).map((perm) => (
                    <span key={perm.id} className="permission-tag">
                      {perm.name}
                    </span>
                  ))}
                  {role.permissions.length > 5 && (
                    <span className="permission-tag more">
                      +{role.permissions.length - 5} more
                    </span>
                  )}
                </div>
              </div>
              <div className="role-actions">
                <button
                  className="btn-secondary"
                  onClick={() => handleOpenModal(role)}
                  disabled={isSystemRole(role.name)}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(role.id, role.name)}
                  disabled={isSystemRole(role.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingRole ? 'Edit Role' : 'Create New Role'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Role Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., HR Manager"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Permissions</label>
                  <div className="permissions-grid">
                    {Object.entries(permissions).map(([category, perms]) => (
                      <div key={category} className="permission-category">
                        <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                        {perms.map((perm) => (
                          <label key={perm.id} className="permission-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(perm.name)}
                              onChange={() => handlePermissionToggle(perm.name)}
                            />
                            <span>{perm.name}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RoleManagement;
