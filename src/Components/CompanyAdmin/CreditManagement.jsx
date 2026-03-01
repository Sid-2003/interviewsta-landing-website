// src/Components/CompanyAdmin/CreditManagement.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Minus,
  XCircle,
  Search,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

import api from "../../service/api";
const CreditManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditReason, setCreditReason] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a subscription ID or user email');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
            // Get all subscriptions and find matching one
      const response = await api.get('user-subscriptions/'
      );
      
      const subscriptions = response.data.subscriptions || [];
      const found = subscriptions.find(sub => 
        sub.id?.toString() === searchTerm ||
        sub.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (found) {
        setSubscription(found);
      } else {
        setError('Subscription not found');
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error searching subscription:', error);
      setError(error.response?.data?.error || 'Failed to find subscription');
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = async () => {
    if (!subscription || !creditAmount || creditAmount === 0) {
      setError('Please enter a valid credit amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
            const response = await api.post(`subscriptions/${subscription.id}/add-credits/`,
        {
          credits: parseInt(creditAmount),
          reason: creditReason || 'Admin adjustment'
        }
      );
      
      setSuccess(`Successfully ${creditAmount > 0 ? 'added' : 'removed'} ${Math.abs(creditAmount)} credits`);
      setCreditAmount(0);
      setCreditReason('');
      setShowCreditModal(false);
      handleSearch(); // Refresh subscription data
    } catch (error) {
      console.error('Error updating credits:', error);
      setError(error.response?.data?.error || 'Failed to update credits');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    if (!confirm(`Are you sure you want to cancel subscription for ${subscription.user_email}?`)) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
            await api.delete(`user-subscriptions/${subscription.id}/`);
      
      setSuccess('Subscription cancelled successfully');
      setSubscription(null);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError(error.response?.data?.error || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Credit Management</h1>
          <p className="text-lg text-gray-600">Add, remove credits and manage user subscriptions</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subscription ID or user email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {success}
            </div>
          )}
        </div>

        {/* Subscription Details */}
        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Subscription Details</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                  <span>Manage Credits</span>
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle className="h-5 w-5" />
                  <span>Cancel Subscription</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">User Email</p>
                <p className="text-lg font-semibold text-gray-900">{subscription.user_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tier</p>
                <p className="text-lg font-semibold text-gray-900">{subscription.tier_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                  subscription.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Credits Remaining</p>
                <p className="text-3xl font-bold text-blue-600">{subscription.credits_remaining}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Credit Modal */}
        {showCreditModal && subscription && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Credits</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Amount (positive to add, negative to remove)
                  </label>
                  <input
                    type="number"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 100 or -50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current credits: {subscription.credits_remaining}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <input
                    type="text"
                    value={creditReason}
                    onChange={(e) => setCreditReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Admin adjustment"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddCredits}
                  disabled={loading || !creditAmount}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Apply'}
                </button>
                <button
                  onClick={() => {
                    setShowCreditModal(false);
                    setCreditAmount(0);
                    setCreditReason('');
                  }}
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

export default CreditManagement;