// src/Components/CompanyAdmin/UserSearch.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  User,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import axios from 'axios';

import api from "../../service/api";
const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter an email or user ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
            // Search for user subscription
      const response = await api.get('user-subscriptions/',
        {
          ,
          params: { search: searchTerm }
        }
      );
      
      // Find matching subscription
      const subscriptions = response.data.subscriptions || [];
      const foundSubscription = subscriptions.find(sub => 
        sub.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user_id?.toString() === searchTerm
      );
      
      if (foundSubscription) {
        setSubscription(foundSubscription);
        setUserDetails({
          email: foundSubscription.user_email,
          username: foundSubscription.user_username,
          userId: foundSubscription.user
        });
      } else {
        setError('User not found or has no subscription');
        setSubscription(null);
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      setError(error.response?.data?.error || 'Failed to search user');
      setSubscription(null);
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Search & Details</h1>
          <p className="text-lg text-gray-600">Search for users and view their subscription details</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}
        </div>

        {/* User Details */}
        {userDetails && subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* User Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <User className="h-6 w-6 text-blue-600" />
                <span>User Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{userDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Username</p>
                  <p className="text-lg font-semibold text-gray-900">{userDetails.username || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">User ID</p>
                  <p className="text-lg font-semibold text-gray-900">{userDetails.userId}</p>
                </div>
              </div>
            </div>

            {/* Subscription Details Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-purple-600" />
                <span>Subscription Details</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tier</p>
                  <p className="text-lg font-semibold text-gray-900">{subscription.tier_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subscription.status === 'active' ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {subscription.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Credits Remaining</p>
                  <p className="text-3xl font-bold text-blue-600">{subscription.credits_remaining}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Subscription Type</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{subscription.subscription_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Start Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(subscription.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Info className="h-6 w-6 text-green-600" />
                <span>Activity Statistics</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{subscription.total_generated_resumes || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Resumes Generated</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{subscription.total_analyzed_resumes || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Resumes Analyzed</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{subscription.total_technical_interviews || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Technical Interviews</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{subscription.total_hr_interviews || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">HR Interviews</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <p className="text-2xl font-bold text-pink-600">{subscription.total_coding_interviews || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Coding Interviews</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;