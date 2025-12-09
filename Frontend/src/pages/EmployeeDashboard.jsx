import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import leaveService from '../services/leaveService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../components/Navbar.css';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    // Set initial tab based on permissions
    if (hasPermission('view leaves')) return 'leaves';
    if (hasPermission('view users')) return 'users';
    if (hasPermission('view departments')) return 'departments';
    if (hasPermission('view leave types')) return 'leaveTypes';
    return 'leaves';
  });
  const [leaves, setLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department_id: '',
  });
  const [formData, setFormData] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setAvailableRoles(response.data);
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      if (activeTab === 'leaves' && hasPermission('view leaves')) {
        const [leavesData, typesData] = await Promise.all([
          leaveService.getLeaves(),
          leaveService.getLeaveTypes(),
        ]);
        setLeaves(leavesData);
        setLeaveTypes(typesData);
      } else if (activeTab === 'users' && hasPermission('view users')) {
        const [usersData, deptsData] = await Promise.all([
          api.get('/users'),
          api.get('/departments'),
        ]);
        setUsers(usersData.data);
        setDepartments(deptsData.data);
      } else if (activeTab === 'departments' && hasPermission('view departments')) {
        const response = await api.get('/departments');
        setDepartments(response.data);
      } else if (activeTab === 'leaveTypes' && hasPermission('view leave types')) {
        const typesData = await leaveService.getLeaveTypes();
        setLeaveTypes(typesData);
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await leaveService.createLeave(formData);
      setSuccess('Leave request submitted successfully!');
      setShowForm(false);
      setFormData({
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: '',
      });
      fetchData();
    } catch (err) {
      // Handle validation errors
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.error || 'Failed to submit leave request');
      }
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      await leaveService.deleteLeave(id);
      setSuccess('Leave request cancelled successfully');
      fetchData();
    } catch (err) {
      setError('Failed to cancel leave request');
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      await api.delete(`/departments/${id}`);
      setSuccess('Department deleted successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete department');
    }
  };

  const handleDeleteLeaveType = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave type?')) {
      return;
    }

    try {
      await api.delete(`/leave-types/${id}`);
      setSuccess('Leave type deleted successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete leave type');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      setSuccess('User deleted successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        // Update user
        const updateData = { ...userFormData };
        if (!updateData.password) {
          delete updateData.password; // Don't update password if empty
        }
        await api.put(`/users/${editingUser.id}`, updateData);
        setSuccess('User updated successfully');
      } else {
        // Create user
        await api.post('/users', userFormData);
        setSuccess('User created successfully');
      }
      setShowUserForm(false);
      setEditingUser(null);
      setUserFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        department_id: '',
      });
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to save user';
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0][0];
        setError(firstError);
      } else {
        setError(errorMsg);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      department_id: user.department_id || '',
    });
    setShowUserForm(true);
  };

  const handleCloseUserForm = () => {
    setShowUserForm(false);
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      department_id: '',
    });
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === 'pending').length,
    approved: leaves.filter((l) => l.status === 'approved').length,
    rejected: leaves.filter((l) => l.status === 'rejected').length,
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="dashboard-header-content">
              <h2>My Dashboard</h2>
              <p>Manage your leave requests and view your information</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tabs">
            {hasPermission('view leaves') && (
              <button
                className={`tab ${activeTab === 'leaves' ? 'active' : ''}`}
                onClick={() => setActiveTab('leaves')}
              >
                📋 My Leaves
              </button>
            )}
            {hasPermission('view users') && (
              <button
                className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                👥 Users
              </button>
            )}
            {hasPermission('view departments') && (
              <button
                className={`tab ${activeTab === 'departments' ? 'active' : ''}`}
                onClick={() => setActiveTab('departments')}
              >
                🏢 Departments
              </button>
            )}
            {hasPermission('view leave types') && (
              <button
                className={`tab ${activeTab === 'leaveTypes' ? 'active' : ''}`}
                onClick={() => setActiveTab('leaveTypes')}
              >
                📝 Leave Types
              </button>
            )}
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

          {/* Leaves Tab */}
          {activeTab === 'leaves' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Requests</h3>
                  <p className="stat-value">{stats.total}</p>
                </div>
                <div className="stat-card pending">
                  <h3>Pending</h3>
                  <p className="stat-value">{stats.pending}</p>
                </div>
                <div className="stat-card approved">
                  <h3>Approved</h3>
                  <p className="stat-value">{stats.approved}</p>
                </div>
                <div className="stat-card rejected">
                  <h3>Rejected</h3>
                  <p className="stat-value">{stats.rejected}</p>
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3>Leave Requests</h3>
                  {hasPermission('create leave') && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowForm(!showForm)}
                    >
                      {showForm ? 'Cancel' : 'New Request'}
                    </button>
                  )}
                </div>

                {showForm && hasPermission('create leave') && (
                  <form onSubmit={handleSubmit} className="leave-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Leave Type</label>
                        <select
                          value={formData.leave_type_id}
                          onChange={(e) =>
                            setFormData({ ...formData, leave_type_id: e.target.value })
                          }
                          required
                        >
                          <option value="">Select type</option>
                          {leaveTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name} ({type.default_quota} days)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="date"
                          value={formData.start_date}
                          onChange={(e) =>
                            setFormData({ ...formData, start_date: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="date"
                          value={formData.end_date}
                          onChange={(e) =>
                            setFormData({ ...formData, end_date: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Reason</label>
                      <textarea
                        value={formData.reason}
                        onChange={(e) =>
                          setFormData({ ...formData, reason: e.target.value })
                        }
                        rows="3"
                        placeholder="Brief reason for leave..."
                      />
                    </div>

                    <button type="submit" className="btn btn-success">
                      Submit Request
                    </button>
                  </form>
                )}

                <div className="leaves-table">
                  {leaves.length === 0 ? (
                    <div className="empty-state">
                      <p>No leave requests yet</p>
                      {hasPermission('create leave') && (
                        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                          Create Your First Request
                        </button>
                      )}
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Days</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaves.map((leave) => (
                          <tr key={leave.id}>
                            <td>{leave.leave_type?.name}</td>
                            <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                            <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                            <td>{leave.days}</td>
                            <td>
                              <span className={getStatusClass(leave.status)}>
                                {leave.status}
                              </span>
                            </td>
                            <td>
                              {leave.status === 'pending' && hasPermission('delete leave') && (
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleCancel(leave.id)}
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && hasPermission('view users') && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Users</h3>
                {hasPermission('create user') && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowUserForm(!showUserForm)}
                  >
                    {showUserForm ? 'Cancel' : 'Create User'}
                  </button>
                )}
              </div>

              {showUserForm && hasPermission('create user') && (
                <form onSubmit={handleUserFormSubmit} className="leave-form" style={{ marginBottom: '20px' }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={userFormData.name}
                        onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Password {editingUser && '(leave blank to keep current)'}</label>
                      <input
                        type="password"
                        value={userFormData.password}
                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                        required={!editingUser}
                        placeholder={editingUser ? 'Leave blank to keep current' : ''}
                      />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select
                        value={userFormData.role}
                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                        required
                      >
                        <option value="">Select a role...</option>
                        {availableRoles.map(role => (
                          <option key={role.id} value={role.name}>
                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={userFormData.department_id}
                      onChange={(e) => setUserFormData({ ...userFormData, department_id: e.target.value })}
                    >
                      <option value="">No Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-success">
                      {editingUser ? 'Update User' : 'Create User'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseUserForm}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="leaves-table">
                {users.length === 0 ? (
                  <div className="empty-state">
                    <p>No users found</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        {(hasPermission('edit user') || hasPermission('delete user')) && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className="status-badge">
                              {user.roles && user.roles.length > 0
                                ? user.roles.map(r => r.name).join(', ')
                                : user.role}
                            </span>
                          </td>
                          <td>{user.department?.name || '-'}</td>
                          {(hasPermission('edit user') || hasPermission('delete user')) && (
                            <td>
                              <div style={{ display: 'flex', gap: '5px' }}>
                                {hasPermission('edit user') && (
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    Edit
                                  </button>
                                )}
                                {hasPermission('delete user') && (
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Departments Tab */}
          {activeTab === 'departments' && hasPermission('view departments') && (
            <div className="card">
              <h3>Departments</h3>
              <div className="leaves-table">
                {departments.length === 0 ? (
                  <div className="empty-state">
                    <p>No departments found</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Employees</th>
                        {hasPermission('delete department') && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((dept) => (
                        <tr key={dept.id}>
                          <td>{dept.name}</td>
                          <td>{dept.users_count || 0}</td>
                          {hasPermission('delete department') && (
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteDepartment(dept.id)}
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Leave Types Tab */}
          {activeTab === 'leaveTypes' && hasPermission('view leave types') && (
            <div className="card">
              <h3>Leave Types</h3>
              <div className="leaves-table">
                {leaveTypes.length === 0 ? (
                  <div className="empty-state">
                    <p>No leave types found</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Default Quota</th>
                        {hasPermission('delete leave type') && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {leaveTypes.map((type) => (
                        <tr key={type.id}>
                          <td>{type.name}</td>
                          <td>{type.default_quota} days</td>
                          {hasPermission('delete leave type') && (
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteLeaveType(type.id)}
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
