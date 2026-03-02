import React, { useState, useEffect } from 'react';
import { CreditCard, ChevronLeft, ChevronRight, ShoppingCart, Zap } from 'lucide-react';
import api from '../../../service/api';
import TransactionTable from '../components/TransactionTable';
import BuyCreditsModal from '../components/BuyCreditsModal';
import UpgradeModal from '../components/UpgradeModal';
import PlanBadge from '../components/PlanBadge';

const PLAN_OPTIONS = [
  {
    key: 'pro',
    name: 'Pro',
    price: '₹830',
    credits: 20,
    features: ['20 credits', '10 video interviews', '20 resume analyses', 'Priority support'],
    color: 'blue',
    tier: 1,
  },
  {
    key: 'pro_plus',
    name: 'Pro Plus',
    price: '₹1,660',
    credits: 60,
    features: ['60 credits', '30 video interviews', '60 resume analyses', 'Priority support', 'Advanced analytics'],
    color: 'purple',
    tier: 2,
    popular: true,
  },
];

const BillingPayments = ({ account, onRefresh }) => {
  const [transactions, setTransactions] = useState([]);
  const [txnLoading, setTxnLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState(null);

  const fetchTransactions = async (p = 1) => {
    setTxnLoading(true);
    try {
      const { data } = await api.get(`billing/transactions/?page=${p}`);
      setTransactions(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 10));
    } catch {
      setTransactions([]);
    } finally {
      setTxnLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(page); }, [page]);

  const handleSuccess = () => {
    onRefresh?.();
    fetchTransactions(1);
    setShowBuyModal(false);
    setShowUpgradeModal(false);
  };

  const currentTier = account?.tier ?? 0;

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Current Plan</h3>
          <PlanBadge tier={account?.tier_name || 'Free'} size="lg" />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-gray-900">{account?.total_credits ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1">Total Credits</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-600">{account?.remaining_credits === -1 ? '∞' : account?.remaining_credits ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1">Remaining</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-gray-900">{account?.used_credits ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1">Used</p>
          </div>
        </div>
      </div>

      {/* Plan upgrade cards */}
      {currentTier < 2 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Available Plans</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {PLAN_OPTIONS.filter((p) => p.tier > currentTier).map((plan) => {
              const colorMap = {
                blue: { border: 'border-blue-200', bg: 'bg-blue-50', btn: 'bg-blue-600 hover:bg-blue-700', text: 'text-blue-600' },
                purple: { border: 'border-purple-200', bg: 'bg-purple-50', btn: 'bg-purple-600 hover:bg-purple-700', text: 'text-purple-600' },
              };
              const c = colorMap[plan.color];
              return (
                <div key={plan.key} className={`relative rounded-2xl border-2 ${c.border} ${c.bg} p-5`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900 text-lg">{plan.name}</h4>
                    <span className={`text-2xl font-bold ${c.text}`}>{plan.price}</span>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className={`h-1.5 w-1.5 rounded-full ${c.text.replace('text', 'bg')}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => { setUpgradeTarget(plan.key); setShowUpgradeModal(true); }}
                    className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-colors ${c.btn}`}
                  >
                    Upgrade to {plan.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Buy credits */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowBuyModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Buy Credits
        </button>
      </div>

      {/* Transaction history */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-gray-400" />
          Transaction History
        </h3>
        <TransactionTable transactions={transactions} loading={txnLoading} />
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <BuyCreditsModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} onSuccess={handleSuccess} />
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={currentTier}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default BillingPayments;
