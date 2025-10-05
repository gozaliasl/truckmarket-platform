import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', role: '', status: '', category: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user is admin
    if (user && user.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      if (activeTab === 'stats') {
        fetchStats();
      } else if (activeTab === 'users') {
        fetchUsers();
      } else if (activeTab === 'trucks') {
        fetchTrucks();
      }
    }
    // eslint-disable-next-line
  }, [activeTab, user, pagination.page, filters]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 403) {
        alert('Access denied');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        params: {
          page: pagination.page,
          limit: 20,
          search: filters.search,
          role: filters.role
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
      setPagination(prev => ({ ...prev, totalPages: response.data.totalPages }));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/trucks', {
        params: {
          page: pagination.page,
          limit: 20,
          status: filters.status,
          category: filters.category
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrucks(response.data.trucks);
      setPagination(prev => ({ ...prev, totalPages: response.data.totalPages }));
    } catch (error) {
      console.error('Error fetching trucks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, updates) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/users/${userId}/status`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user status');
    }
  };

  const updateTruckStatus = async (truckId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/trucks/${truckId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrucks();
    } catch (error) {
      console.error('Error updating truck:', error);
      alert('Failed to update truck status');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and all their listings?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const deleteTruck = async (truckId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/trucks/${truckId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrucks();
    } catch (error) {
      console.error('Error deleting truck:', error);
      alert('Failed to delete truck');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>👑 Admin Dashboard</h1>
        <p>Platform Management & Analytics</p>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button
          className={activeTab === 'trucks' ? 'active' : ''}
          onClick={() => setActiveTab('trucks')}
        >
          🚛 Truck Listings
        </button>
      </div>

      <div className="admin-content">
        {loading && <div className="loading">Loading...</div>}

        {activeTab === 'stats' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
              <small>{stats.recentRegistrations} new in last 30 days</small>
            </div>

            <div className="stat-card">
              <h3>Total Trucks</h3>
              <p className="stat-number">{stats.totalTrucks}</p>
              <small>{stats.recentListings} new in last 30 days</small>
            </div>

            <div className="stat-card">
              <h3>Admins</h3>
              <p className="stat-number">{stats.totalAdmins}</p>
            </div>

            <div className="stat-card full-width">
              <h3>Users by Tier</h3>
              <div className="tier-breakdown">
                {stats.usersByTier.map(tier => (
                  <div key={tier.tier} className="tier-item">
                    <span className="tier-name">{tier.tier}</span>
                    <span className="tier-count">{tier.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-card full-width">
              <h3>Trucks by Status</h3>
              <div className="status-breakdown">
                {stats.trucksByStatus.map(status => (
                  <div key={status.status} className="status-item">
                    <span className="status-name">{status.status}</span>
                    <span className="status-count">{status.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-card full-width">
              <h3>Top Categories</h3>
              <div className="category-breakdown">
                {stats.trucksByCategory.slice(0, 5).map(cat => (
                  <div key={cat.category} className="category-item">
                    <span className="category-name">{cat.category}</span>
                    <span className="category-count">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-filters">
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              >
                <option value="">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Tier</th>
                    <th>Role</th>
                    <th>Active</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(usr => (
                    <tr key={usr.id}>
                      <td>{usr.id}</td>
                      <td>{usr.name}</td>
                      <td>{usr.email}</td>
                      <td><span className={`badge badge-${usr.tier}`}>{usr.tier}</span></td>
                      <td><span className={`badge badge-${usr.role}`}>{usr.role}</span></td>
                      <td>
                        <input
                          type="checkbox"
                          checked={usr.is_active}
                          onChange={(e) => updateUserStatus(usr.id, { is_active: e.target.checked })}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={usr.is_verified}
                          onChange={(e) => updateUserStatus(usr.id, { is_verified: e.target.checked })}
                        />
                      </td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => deleteUser(usr.id)}
                          disabled={usr.role === 'admin'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                >
                  Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trucks' && (
          <div className="trucks-section">
            <div className="section-filters">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="semi-trailer-trucks">Semi-Trailer Trucks</option>
                <option value="trucks-over-7.5t">Trucks over 7.5t</option>
                <option value="vans">Vans</option>
              </select>
            </div>

            <div className="trucks-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Owner</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trucks.map(truck => (
                    <tr key={truck.id}>
                      <td>{truck.id}</td>
                      <td>{truck.title}</td>
                      <td>{truck.user_name || truck.user_email}</td>
                      <td>{truck.category}</td>
                      <td>${truck.price?.toLocaleString()}</td>
                      <td>
                        <select
                          value={truck.status}
                          onChange={(e) => updateTruckStatus(truck.id, e.target.value)}
                          className={`status-select status-${truck.status}`}
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="sold">Sold</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => deleteTruck(truck.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                >
                  Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
