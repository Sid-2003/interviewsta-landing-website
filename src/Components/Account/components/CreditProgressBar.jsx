import React from 'react';

export const CreditProgressBar = ({ used, total, label, color = 'blue' }) => {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const colorMap = {
    blue: { bar: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' },
    purple: { bar: 'bg-purple-500', text: 'text-purple-600', bg: 'bg-purple-50' },
    green: { bar: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50' },
    orange: { bar: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className={`font-semibold ${c.text}`}>{used} / {total}</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export const CircularCreditMeter = ({ remaining, total, tier }) => {
  const isUnlimited = remaining === -1;
  const pct = isUnlimited ? 100 : total > 0 ? Math.min(100, Math.round(((total - remaining) / total) * 100)) : 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const tierColor = {
    Free: '#6b7280',
    Pro: '#3b82f6',
    'Pro Plus': '#8b5cf6',
    Organisation: '#f59e0b',
    Developer: '#10b981',
  }[tier] || '#6b7280';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={tierColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {isUnlimited ? '∞' : remaining}
          </span>
          <span className="text-xs text-gray-500">credits left</span>
        </div>
      </div>
    </div>
  );
};
