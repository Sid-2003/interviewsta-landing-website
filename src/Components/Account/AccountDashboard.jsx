import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../service/api';
import Sidebar from './Sidebar';
import AccountDetails from './tabs/AccountDetails';
import UsageCredits from './tabs/UsageCredits';
import BillingPayments from './tabs/BillingPayments';
import SettingsTab from './tabs/SettingsTab';
import DeveloperTab from './tabs/DeveloperTab';

const TAB_TITLES = {
  account:   'Account Details',
  usage:     'Usage & Credits',
  billing:   'Billing & Payments',
  settings:  'Settings',
  developer: 'Developer',
};

const AccountDashboard = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('billing/account/');
      setAccountData(data);
    } catch (e) {
      setError('Failed to load account data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccount(); }, [fetchAccount]);

  const user = accountData?.user;
  const account = accountData?.account;
  const isDeveloper = account?.tier === 4;

  const renderTab = () => {
    const props = { user, account, onRefresh: fetchAccount };
    switch (activeTab) {
      case 'account':   return <AccountDetails {...props} />;
      case 'usage':     return <UsageCredits {...props} />;
      case 'billing':   return <BillingPayments {...props} />;
      case 'settings':  return <SettingsTab {...props} />;
      case 'developer': return <DeveloperTab {...props} />;
      default:          return <AccountDetails {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile, credits, and billing</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <span>{error}</span>
            <button onClick={fetchAccount} className="ml-auto text-red-600 hover:text-red-800 font-semibold underline text-xs">
              Retry
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isDeveloper={isDeveloper} />

          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">{TAB_TITLES[activeTab]}</h2>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  renderTab()
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
