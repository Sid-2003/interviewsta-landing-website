import React, { useState } from 'react';
import { Video, FileText, Zap, ShoppingCart } from 'lucide-react';
import { CircularCreditMeter, CreditProgressBar } from '../components/CreditProgressBar';
import PlanBadge from '../components/PlanBadge';
import BuyCreditsModal from '../components/BuyCreditsModal';
import UpgradeModal from '../components/UpgradeModal';

const UsageCredits = ({ account, onRefresh }) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!account) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const isUnlimited = account.tier === 4;
  const tierNum = account.tier;

  const handlePaymentSuccess = () => {
    onRefresh?.();
    setShowBuyModal(false);
    setShowUpgradeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Credit overview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <CircularCreditMeter
            remaining={account.remaining_credits}
            total={account.total_credits}
            tier={account.tier_name}
          />
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Credit Balance</h3>
              <PlanBadge tier={account.tier_name} />
            </div>
            {!isUnlimited && (
              <>
                <CreditProgressBar
                  used={account.used_interview_credits}
                  total={account.total_credits}
                  label="Interview Credits Used"
                  color="blue"
                />
                <CreditProgressBar
                  used={account.used_resume_credits}
                  total={account.total_credits}
                  label="Resume Credits Used"
                  color="purple"
                />
              </>
            )}
            {isUnlimited && (
              <p className="text-sm text-emerald-600 font-medium">
                Unlimited credits — Developer tier
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Credits', value: isUnlimited ? '∞' : account.total_credits, icon: Zap, color: 'blue' },
          { label: 'Remaining', value: isUnlimited ? '∞' : account.remaining_credits, icon: Zap, color: 'green' },
          { label: 'Interviews Used', value: Math.floor(account.used_interview_credits / 2), icon: Video, color: 'purple' },
          { label: 'Resumes Used', value: account.used_resume_credits, icon: FileText, color: 'orange' },
        ].map((stat) => {
          const colorMap = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            orange: 'bg-orange-50 text-orange-600',
          };
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className={`inline-flex p-2 rounded-lg ${colorMap[stat.color]} mb-2`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Credit cost reference */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
        <p className="font-semibold text-gray-700 mb-2">Credit Usage</p>
        <div className="flex items-center gap-2"><Video className="h-4 w-4 text-blue-500" /><span>1 Video Interview = <strong>2 credits</strong></span></div>
        <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-purple-500" /><span>1 Resume Analysis = <strong>1 credit</strong></span></div>
      </div>

      {/* Action buttons */}
      {!isUnlimited && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowBuyModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Buy Credits
          </button>
          {tierNum < 2 && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all"
            >
              <Zap className="h-4 w-4" />
              Upgrade Plan
            </button>
          )}
        </div>
      )}

      <BuyCreditsModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} onSuccess={handlePaymentSuccess} />
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={tierNum}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default UsageCredits;
