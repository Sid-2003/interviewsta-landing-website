import React from 'react';
import { X, Zap, Star, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RazorpayButton from './RazorpayButton';

const UpgradeModal = ({ isOpen, onClose, currentTier, context = 'interview', onSuccess }) => {
  const plans = [
    {
      key: 'pro',
      name: 'Pro',
      price: '₹830',
      credits: 20,
      icon: Zap,
      color: 'blue',
      description: '20 credits — 10 interviews or 20 resume analyses',
      hidden: currentTier >= 1,
    },
    {
      key: 'pro_plus',
      name: 'Pro Plus',
      price: '₹1,660',
      credits: 60,
      icon: Star,
      color: 'purple',
      description: '60 credits — 30 interviews or 60 resume analyses',
      hidden: currentTier >= 2,
    },
  ].filter((p) => !p.hidden);

  const creditPacks = [
    { key: 'pack_10', label: '10 Credits', price: '₹415', credits: 10 },
    { key: 'pack_25', label: '25 Credits', price: '₹830', credits: 25 },
  ];

  const handleSuccess = (data) => {
    onSuccess?.(data);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 text-white">
              <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold">Upgrade Your Plan</h2>
              <p className="text-sm text-white/80 mt-1">
                You've run out of {context === 'interview' ? 'interview' : 'resume'} credits.
              </p>
            </div>

            <div className="p-6 space-y-5">
              {plans.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Upgrade Plan</p>
                  <div className="space-y-3">
                    {plans.map((plan) => {
                      const Icon = plan.icon;
                      const colorMap = {
                        blue: 'border-blue-200 bg-blue-50 hover:border-blue-400',
                        purple: 'border-purple-200 bg-purple-50 hover:border-purple-400',
                      };
                      const btnMap = {
                        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
                        purple: 'bg-purple-600 hover:bg-purple-700 text-white',
                      };
                      return (
                        <div key={plan.key} className={`rounded-xl border-2 p-4 transition-colors ${colorMap[plan.color]}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${plan.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                                <Icon className={`h-5 w-5 ${plan.color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{plan.name}</p>
                                <p className="text-xs text-gray-500">{plan.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{plan.price}</p>
                              <RazorpayButton
                                type="plan"
                                plan={plan.key}
                                label={`Upgrade to ${plan.name}`}
                                onSuccess={handleSuccess}
                                className={`mt-1 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${btnMap[plan.color]}`}
                              >
                                Upgrade
                              </RazorpayButton>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Buy Credits</p>
                <div className="grid grid-cols-2 gap-3">
                  {creditPacks.map((pack) => (
                    <div key={pack.key} className="rounded-xl border border-gray-200 p-4 text-center hover:border-blue-300 transition-colors">
                      <CreditCard className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="font-semibold text-gray-900">{pack.label}</p>
                      <p className="text-sm text-gray-500 mb-3">{pack.price}</p>
                      <RazorpayButton
                        type="credits"
                        pack={pack.key}
                        label={pack.label}
                        onSuccess={handleSuccess}
                        className="w-full py-1.5 rounded-lg text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                      >
                        Buy
                      </RazorpayButton>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;
