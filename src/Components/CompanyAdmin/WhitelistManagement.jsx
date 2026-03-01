// src/Components/CompanyAdmin/WhitelistManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Upload,
  Download
} from 'lucide-react';
import api from '../../service/api';
import api from "../../service/api";

const WhitelistManagement = () => {
  const [whitelist, setWhitelist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [reason, setReason] = useState('Developer access');
  const [bulkEmails, setBulkEmails] = useState('');
  const [stats, setStats] = useState({ count: 0, active_count: 0 });

  useEffect(() => {
    fetchWhitelist();
  }, []);

  const fetchWhitelist = async () => {
    try {
      setLoading(true);
      const response = await api.get('admin/developer-whitelist/');
      
      setWhitelist(response.data.developers || []);
      setStats({
        count: response.data.count || 0,
        active_count: response.data.active_count || 0
      });
    } catch (error) {
      console.error('Error fetching whitelist:', error);
      alert('Failed to fetch whitelist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      alert('Please enter an email');
      return;
    }

    try {
      await api.post('admin/developer-whitelist/', { email: newEmail, reason });
      
      setNewEmail('');
      setReason('Developer access');
      setShowAddModal(false);
      fetchWhitelist();
    } catch (error) {
      console.error('Error adding email:', error);
      alert(error.response?.data?.error || 'Failed to add email');
    }
  };

  const handleBulkAdd = async () => {
    const emails = bulkEmails
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('@'));
    
    if (emails.length === 0) {
      alert('Please enter at least one valid email');
      return;
    }

    try {
            const emailList = emails.map(email => ({
        email,
        reason: 'Developer access'
      }));
      
      await api.post('admin/developer-whitelist/bulk/', { emails: emailList });
      
      setBulkEmails('');
      setShowBulkModal(false);
      fetchWhitelist();
    } catch (error) {
      console.error('Error bulk adding:', error);
      alert(error.response?.data?.error || 'Failed to bulk add emails');
    }
  };

  const handleRemove = async (email, permanent = false) => {
    if (!confirm(`Are you sure you want to ${permanent ? 'permanently remove' : 'deactivate'} ${email}?`)) {
      return;
    }

    try {
            await api.delete('admin/developer-whitelist/',
        {
          data: { email, permanent },
          
        }
      );
      
      fetchWhitelist();
    } catch (error) {
      console.error('Error removing email:', error);
      alert(error.response?.data?.error || 'Failed to remove email');
    }
  };

  const filteredWhitelist = whitelist.filter(item =>
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Developer Whitelist</h1>
          <p className="text-lg text-gray-600">Manage whitelisted developer accounts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Whitelisted</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.count}</p>
              </div>
              <Shield className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.active_count}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Inactive</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">{stats.count - stats.active_count}</p>
              </div>
              <XCircle className="h-10 w-10 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Email</span>
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span>Bulk Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading whitelist...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWhitelist.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.added_by_email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRemove(item.email, false)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Deactivate"
                          >
                            Deactivate
                          </button>
                          <button
                            onClick={() => handleRemove(item.email, true)}
                            className="text-red-600 hover:text-red-800"
                            title="Permanently Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredWhitelist.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No whitelisted developers found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Email Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Email to Whitelist</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="developer@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Developer access"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddEmail}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Bulk Add Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bulk Add Emails</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter emails (one per line)
                </label>
                <textarea
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleBulkAdd}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Add All
                </button>
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhitelistManagement;