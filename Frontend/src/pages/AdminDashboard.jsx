import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ExportPanel from '../components/ExportPanel';
import leaveService from '../services/leaveService';
import bulkService from '../services/bulkService';
import api from '../services/api';
import '../components/Navbar.css';
import './Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('leaves');
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'leaves') {
        const data = await leaveService.getLeaves();
        setLeaves(data);
      } else if (activeTab === 'users') {
        const response = await api.get('/users');
        setUsers(response.data);
      } else if (activeTab === 'departments') {
        const response = await api.get('/departments');
        setDepartments(response.data);
      } else if (activeTab === 'leaveTypes') {
        const data = await leaveService.getLeaveTypes();
        setLeaveTypes(data);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await leaveService.updateLeave(id, { status: 'approved' });
      setSuccess('Leave request approved');
      fetchData();
    } catch (err) {
      setError('Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    try {
      await leaveService.updateLeave(id, { status: 'rejected' });
      setSuccess('Leave request rejected');
      fetchData();
    } catch (err) {
      setError('Failed to reject leave');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/users/${id}`);
      setSuccess('User deleted successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  // Bulk operations
  const handleBulkApprove = async () => {
    if (selectedLeaves.length === 0) {
      setError('Please select leaves to approve');
      return;
    }

    if (!window.confirm(`Approve ${selectedLeaves.length} leave(s)?`)) return;

    try {
      const result = await bulkService.bulkApproveLeaves(selectedLeaves);
      setSuccess(result.message);
      setSelectedLeaves([]);
      fetchData();
    } catch (err) {
      setError('Failed to approve leaves');
    }
  };

  const handleBulkReject = async () => {
    if (selectedLeaves.length === 0) {
      setError('Please select leaves to reject');
      return;
    }

    if (!window.confirm(`Reject ${selectedLeaves.length} leave(s)?`)) return;

    try {
      const result = await bulkService.bulkRejectLeaves(selectedLeaves);
      setSuccess(result.message);
      setSelectedLeaves([]);
      fetchData();
    } catch (err) {
      setError('Failed to reject leaves');
    }
  };

  const handleBulkDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select users to delete');
      return;
    }

    if (!window.confirm(`Delete ${selectedUsers.length} user(s)? This action cannot be undone.`)) return;

    try {
      const result = await bulkService.bulkDeleteUsers(selectedUsers);
      setSuccess(result.message);
      setSelectedUsers([]);
      fetchData();
    } catch (err) {
      setError('Failed to delete users');
    }
  };

  const toggleLeaveSelection = (leaveId) => {
    setSelectedLeaves(prev =>
      prev.includes(leaveId) ? prev.filter(id => id !== leaveId) : [...prev, leaveId]
    );
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const selectAllLeaves = () => {
    if (selectedLeaves.length === leaves.filter(l => l.status === 'pending').length) {
      setSelectedLeaves([]);
    } else {
      setSelectedLeaves(leaves.filter(l => l.status === 'pending').map(l => l.id));
    }
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const pendingLeaves = leaves.filter((l) => l.status === 'pending').length;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h2>Admin Dashboard</h2>
            <div className="header-actions">
              <ExportPanel />
              <button 
                className="btn-primary"
                onClick={() => navigate('/role-management')}
              >
                🔐 Roles
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Employees</h3>
              <p className="stat-value">{users.length}</p>
            </div>
            <div className="stat-card pending">
              <h3>Pending Approvals</h3>
              <p className="stat-value">{pendingLeaves}</p>
            </div>
            <div className="stat-card">
              <h3>Departments</h3>
              <p className="stat-value">{departments.length}</p>
            </div>
            <div className="stat-card">
              <h3>Leave Types</h3>
              <p className="stat-value">{leaveTypes.length}</p>
            </div>
          </div>

          <div className="card">
            <div className="admin-tabs">
              <button
                className={`tab ${activeTab === 'leaves' ? 'active' : ''}`}
                onClick={() => setActiveTab('leaves')}
              >
                Leave Requests
              </button>
              <button
                className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                Employees
              </button>
              <button
                className={`tab ${activeTab === 'departments' ? 'active' : ''}`}
                onClick={() => setActiveTab('departments')}
              >
                Departments
              </button>
              <button
                className={`tab ${activeTab === 'leaveTypes' ? 'active' : ''}`}
                onClick={() => setActiveTab('leaveTypes')}
              >
                Leave Types
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                {activeTab === 'leaves' && (
                  <div className="leaves-table">
                    {selectedLeaves.length > 0 && (
                      <div className="bulk-actions">
                        <span>{selectedLeaves.length} selected</span>
                        <button className="btn-success btn-sm" onClick={handleBulkApprove}>
                          ✓ Approve Selected
                        </button>
                        <button className="btn-danger btn-sm" onClick={handleBulkReject}>
                          ✗ Reject Selected
                        </button>
                      </div>
                    )}
                    {leaves.length === 0 ? (
                      <div className="empty-state">
                        <p>No leave requests</p>
                      </div>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>
                              <input
                                type="checkbox"
                                onChange={selectAllLeaves}
                                checked={selectedLeaves.length === leaves.filter(l => l.status === 'pending').length && leaves.filter(l => l.status === 'pending').length > 0}
                              />
                            </th>
                            <th>Employee</th>
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
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedLeaves.includes(leave.id)}
                                  onChange={() => toggleLeaveSelection(leave.id)}
                                  disabled={leave.status !== 'pending'}
                                />
                              </td>
                              <td>{leave.user?.name}</td>
                              <td>{leave.leave_type?.name}</td>
                              <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                              <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                              <td>{leave.days}</td>
                              <td>
                                <span className={`status-badge status-${leave.status}`}>
                                  {leave.status}
                                </span>
                              </td>
                              <td>
                                {leave.status === 'pending' && (
                                  <div className="action-buttons">
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleApprove(leave.id)}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleReject(leave.id)}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="leaves-table">
                    {selectedUsers.length > 0 && (
                      <div className="bulk-actions">
                        <span>{selectedUsers.length} selected</span>
                        <button className="btn-danger btn-sm" onClick={handleBulkDeleteUsers}>
                          🗑️ Delete Selected
                        </button>
                      </div>
                    )}
                    <table>
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              onChange={selectAllUsers}
                              checked={selectedUsers.length === users.length && users.length > 0}
                            />
                          </th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Department</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => toggleUserSelection(user.id)}
                              />
                            </td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`status-badge status-${user.role === 'admin' ? 'approved' : 'pending'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td>{user.department?.name || 'N/A'}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'departments' && (
                  <div className="leaves-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Manager</th>
                          <th>Employees</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map((dept) => (
                          <tr key={dept.id}>
                            <td>{dept.name}</td>
                            <td>{dept.manager?.name || 'No manager'}</td>
                            <td>{dept.users?.length || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'leaveTypes' && (
                  <div className="leaves-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Default Quota</th>
                          <th>Max Consecutive Days</th>
                          <th>Total Requests</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveTypes.map((type) => (
                          <tr key={type.id}>
                            <td>{type.name}</td>
                            <td>{type.default_quota} days</td>
                            <td>{type.max_consecutive_days} days</td>
                            <td>{type.leaves_count || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
