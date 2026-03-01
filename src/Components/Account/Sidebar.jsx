import React from 'react';
import { User, Zap, CreditCard, Settings, Code2 } from 'lucide-react';

const TABS = [
  { id: 'account',   label: 'Account Details',   icon: User },
  { id: 'usage',     label: 'Usage & Credits',    icon: Zap },
  { id: 'billing',   label: 'Billing & Payments', icon: CreditCard },
  { id: 'settings',  label: 'Settings',           icon: Settings },
  { id: 'developer', label: 'Developer',          icon: Code2, devOnly: true },
];

const Sidebar = ({ activeTab, onTabChange, isDeveloper }) => {
  const visibleTabs = TABS.filter((t) => !t.devOnly || isDeveloper);

  return (
    <aside className="w-full lg:w-56 flex-shrink-0">
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap w-full text-left ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
