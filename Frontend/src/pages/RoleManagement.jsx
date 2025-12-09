import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import roleService from '../services/roleService';
import './RoleManagement.css';

const RoleManagement = () => {
  const navigate = useNavigate();
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
    setFormData(prev => {
      const isCurrentlyChecked = prev.permissions.includes(permName);
      let newPermissions = isCurrentlyChecked
        ? prev.permissions.filter(p => p !== permName)
        : [...prev.permissions, permName];
      
      // Dependency map for auto-adding view permissions
      const dependencyMap = {
        'create leave': ['view leaves'],
        'edit leave': ['view leaves'],
        'delete leave': ['view leaves'],
        'approve leave': ['view leaves'],
        'reject leave': ['view leaves'],
        'create user': ['view users', 'view departments', 'view roles'],
        'edit user': ['view users', 'view departments', 'view roles'],
        'delete user': ['view users'],
        'create department': ['view departments'],
        'edit department': ['view departments'],
        'delete department': ['view departments'],
        'create leave type': ['view leave types'],
        'edit leave type': ['view leave types'],
        'delete leave type': ['view leave types'],
        'create role': ['view roles'],
        'edit role': ['view roles'],
        'delete role': ['view roles'],
        'assign roles': ['view roles', 'view users'],
      };
      
      // If checking a permission, add its dependencies
      if (!isCurrentlyChecked && dependencyMap[permName]) {
        dependencyMap[permName].forEach(dep => {
          if (!newPermissions.includes(dep)) {
            newPermissions.push(dep);
          }
        });
      }
      
      // If unchecking a view permission, remove all permissions that depend on it
      if (isCurrentlyChecked) {
        const viewToActions = {
          'view leaves': ['create leave', 'edit leave', 'delete leave', 'approve leave', 'reject leave'],
          'view users': ['create user', 'edit user', 'delete user', 'assign roles'],
          'view departments': ['create user', 'edit user', 'create department', 'edit department', 'delete department'],
          'view roles': ['create user', 'edit user', 'create role', 'edit role', 'delete role', 'assign roles'],
          'view leave types': ['create leave type', 'edit leave type', 'delete leave type'],
        };
        
        if (viewToActions[permName]) {
          viewToActions[permName].forEach(action => {
            newPermissions = newPermissions.filter(p => p !== action);
          });
        }
      }
      
      return {
        ...prev,
        permissions: newPermissions
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Role name is required');
      return;
    }

    if (formData.permissions.length === 0) {
      setError('Please select at least one permission');
      return;
    }

    // Ensure view permissions are included with CRUD permissions
    const permissionsToSubmit = [...formData.permissions];
    const crudToViewMap = {
      'create leave': 'view leaves',
      'edit leave': 'view leaves',
      'delete leave': 'view leaves',
      'approve leave': 'view leaves',
      'reject leave': 'view leaves',
      'create user': 'view users',
      'edit user': 'view users',
      'delete user': 'view users',
      'create department': 'view departments',
      'edit department': 'view departments',
      'delete department': 'view departments',
      'create leave type': 'view leave types',
      'edit leave type': 'view leave types',
      'delete leave type': 'view leave types',
      'create role': 'view roles',
      'edit role': 'view roles',
      'delete role': 'view roles',
      'assign roles': 'view roles',
      'export reports': 'view reports',
    };

    formData.permissions.forEach(permission => {
      const viewPermission = crudToViewMap[permission];
      if (viewPermission && !permissionsToSubmit.includes(viewPermission)) {
        permissionsToSubmit.push(viewPermission);
      }
    });

    try {
      const dataToSubmit = {
        ...formData,
        permissions: permissionsToSubmit
      };

      if (editingRole) {
        await roleService.updateRole(editingRole.id, dataToSubmit);
        setSuccess('Role updated successfully!');
      } else {
        await roleService.createRole(dataToSubmit);
        setSuccess('Role created successfully!');
      }
      fetchData();
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to save role';
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0][0];
        setError(firstError);
      } else {
        setError(errorMsg);
      }
    }
  };

  const handleDelete = async (id, roleName) => {
    if (!window.confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await roleService.deleteRole(id);
      setSuccess('Role deleted successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete error:', err.response?.data);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to delete role';
      setError(errorMsg);
      setTimeout(() => setError(''), 5000);
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
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="dashboard-header-content">
              <h2>Role Management</h2>
              <p>Create and manage user roles and permissions</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                ← Back
              </button>
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                + Create Role
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="success-message">
              <span className="success-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

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
                    className="btn-secondary btn-sm"
                    onClick={() => handleOpenModal(role)}
                    disabled={isSystemRole(role.name)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger btn-sm"
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
                  <button className="close-button" onClick={handleCloseModal}>×</button>
                </div>

                <div className="modal-body">
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
                          <div key={category} className="permission-section">
                            <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                            {perms.map((perm) => (
                              <div key={perm.id} className="permission-item">
                                <input
                                  type="checkbox"
                                  id={`perm-${perm.id}`}
                                  checked={formData.permissions.includes(perm.name)}
                                  onChange={() => handlePermissionToggle(perm.name)}
                                />
                                <label htmlFor={`perm-${perm.id}`}>{perm.name}</label>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        <span>{error}</span>
                      </div>
                    )}
                    {success && (
                      <div className="success-message">
                        <span className="success-icon">✓</span>
                        <span>{success}</span>
                      </div>
                    )}

                    <div className="form-actions">
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoleManagement;
