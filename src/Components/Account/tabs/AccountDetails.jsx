import React from 'react';
import { User, Mail, Calendar, Shield, Phone, Globe } from 'lucide-react';
import PlanBadge from '../components/PlanBadge';
import { useVideoInterview } from '../../../Contexts/VideoInterviewContext';
import en from 'react-phone-number-input/locale/en.json';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
    <div className="p-2 bg-gray-50 rounded-lg mt-0.5">
      <Icon className="h-4 w-4 text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-900 font-medium mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

const AccountDetails = ({ user, account }) => {
  const { state } = useVideoInterview();
  const profile = state?.auth?.user;
  const phone = profile?.phone || '';
  const countryCode = profile?.country || '';
  const countryLabel = countryCode && en[countryCode] ? en[countryCode] : countryCode || '';

  if (!user) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username;
  const joinDate = user.date_joined
    ? new Date(user.date_joined).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-2">
            <PlanBadge tier={account?.tier_name || 'Free'} size="md" />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100 px-6 divide-y divide-gray-50">
        <InfoRow icon={User}     label="Full Name"       value={fullName} />
        <InfoRow icon={Mail}     label="Email"          value={user.email} />
        <InfoRow icon={Phone}   label="Phone"          value={phone || undefined} />
        <InfoRow icon={Globe}   label="Country / Region" value={countryLabel || undefined} />
        <InfoRow icon={Calendar} label="Member Since"   value={joinDate} />
        <InfoRow icon={Shield}   label="Account ID"   value={`#${user.id}`} />
      </div>
    </div>
  );
};

export default AccountDetails;
