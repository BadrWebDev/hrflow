import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import leaveService from '../services/leaveService';
import { useAuth } from '../context/AuthContext';
import '../components/Navbar.css';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const { hasPermission } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
  }, []);

  const fetchData = async () => {
    try {
      const [leavesData, typesData] = await Promise.all([
        leaveService.getLeaves(),
        leaveService.getLeaveTypes(),
      ]);
      setLeaves(leavesData);
      setLeaveTypes(typesData);
    } catch (err) {
      setError('Failed to load data');
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
            <h2>My Dashboard</h2>
            <p>Manage your leave requests</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

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
                  <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    Create Your First Request
                  </button>
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
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
