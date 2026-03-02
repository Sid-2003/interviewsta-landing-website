// src/Components/CompanyAdmin/CompanyAdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OrganizationManagement from './OrganizationManagement';

import {
  Users,
  FileText,
  Search,
  CreditCard,
  Shield,
  University
} from 'lucide-react';

const CompanyAdminDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'whitelist',
      title: 'Developer Whitelist',
      description: 'View and manage whitelisted developers',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      route: '/company-admin/whitelist'
    },
    {
      id: 'credit-logs',
      title: 'Credit Activity Logs',
      description: 'View all credit transactions and activities',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      route: '/company-admin/credit-logs'
    },
    {
      id: 'user-search',
      title: 'User Search & Details',
      description: 'Search users and view subscription details',
      icon: Search,
      color: 'from-purple-500 to-purple-600',
      route: '/company-admin/user-search'
    },
    {
      id: 'credit-management',
      title: 'Credit Management',
      description: 'Add, remove credits and manage subscriptions',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      route: '/company-admin/credit-management'
    },
    {
        id: 'organization-management',
        title: 'Organization Management',
        description: 'Manage organizations and organization members',
        icon: University,
        color: 'from-red-500 to-red-600',
        route: '/company-admin/organization-management'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Admin Portal</h1>
          <p className="text-lg text-gray-600">Manage subscriptions, credits, and developer access</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate(item.route)}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminDashboard;