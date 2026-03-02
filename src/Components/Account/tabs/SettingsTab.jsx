import React, { useState } from 'react';
import { Bell, Moon, Globe, Shield, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';

const ToggleRow = ({ icon: Icon, label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-50 rounded-lg mt-0.5">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    interviewReminders: true,
    marketingEmails: false,
    darkMode: false,
  });

  const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 px-6 divide-y divide-gray-50">
        <ToggleRow
          icon={Bell}
          label="Email Notifications"
          description="Receive emails about your account activity"
          enabled={settings.emailNotifications}
          onToggle={() => toggle('emailNotifications')}
        />
        <ToggleRow
          icon={Bell}
          label="Interview Reminders"
          description="Get reminded before scheduled interviews"
          enabled={settings.interviewReminders}
          onToggle={() => toggle('interviewReminders')}
        />
        <ToggleRow
          icon={Globe}
          label="Marketing Emails"
          description="Receive tips, updates and product news"
          enabled={settings.marketingEmails}
          onToggle={() => toggle('marketingEmails')}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Danger Zone</h3>
        <button className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
          Delete Account
        </button>
        <p className="text-xs text-gray-400 mt-1">This action is permanent and cannot be undone.</p>
      </div>
    </div>
  );
};

export default SettingsTab;
