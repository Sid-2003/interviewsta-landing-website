import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Zap, 
  Crown, 
  Star,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

const PricingPage = ({ onSelectPlan, showCreditsExhausted = false }) => {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' or 'annual'
  const [selectedPlan, setSelectedPlan] = useState('pro'); // 'standard', 'pro', or 'max'

  const plans = {
    monthly: {
      standard: { price: 500, name: 'Standard' },
      pro: { price: 750, name: 'Pro' },
      max: { price: 1000, name: 'Max' }
    },
    annual: {
      standard: { price: 5000, name: 'Standard' },
      pro: { price: 7500, name: 'Pro' },
      max: { price: 10000, name: 'Max' }
    }
  };

  const planFeatures = {
    standard: [
      'AI Powered Learning',
      'Specialized Subject Prep (3)',
      'Case Study (15)',
      'Resume Analysis (10)',
      'Teacher & Admin Portal',
      'Test papers (15)'
    ],
    pro: [
      'AI Powered Learning',
      'Specialized Subject Prep (6)',
      'Case Study (20)',
      'Resume Analysis + Generation (10)',
      'Teacher & Admin Portal',
      'Test papers (25)',
      'Technical Interviews (10)',
      'Company Based Interview Prep'
    ],
    max: [
      'AI Powered Learning',
      'Specialized Subject Prep (9)',
      'Case Study (30)',
      'Resume Analysis + Generation (15)',
      'Teacher & Admin Portal',
      'Test papers (40)',
      'Technical Interviews (15)',
      'Company Based Interview Prep'
    ]
  };

  const currentPlans = plans[billingCycle];

  // Calculate savings percentage for annual plans
  const calculateSavings = (planType) => {
    const monthlyTotal = plans.monthly[planType].price * 12;
    const annualPrice = plans.annual[planType].price;
    const savings = ((monthlyTotal - annualPrice) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  const handlePlanSelect = (planType) => {
    setSelectedPlan(planType);
    if (onSelectPlan) {
      onSelectPlan({
        type: planType,
        billingCycle,
        price: currentPlans[planType].price
      });
    }
  };

  // Helper function to render pricing card
  const renderPricingCard = (planType, icon, iconColor, badgeText = null) => {
    const isSelected = selectedPlan === planType;
    const monthlyPrice = plans.monthly[planType].price;
    const annualPrice = plans.annual[planType].price;
    const currentPrice = billingCycle === 'monthly' ? monthlyPrice : annualPrice;
    const savings = calculateSavings(planType);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: planType === 'standard' ? 0.1 : planType === 'pro' ? 0.2 : 0.3 }}
        onClick={() => handlePlanSelect(planType)}
        className={`rounded-2xl shadow-2xl border-2 p-8 relative cursor-pointer transition-all duration-300 ${
          isSelected
            ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-400 scale-105 md:scale-110 ring-4 ring-purple-300 z-10'
            : 'bg-white border-gray-200 hover:shadow-xl hover:border-gray-300'
        }`}
      >
        {/* Badge */}
        {badgeText && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className={`px-4 py-1 rounded-full text-xs font-bold ${
              isSelected ? 'bg-yellow-400 text-gray-900' : 'bg-yellow-400 text-gray-900'
            }`}>
              {badgeText}
            </span>
          </div>
        )}

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Check className="h-5 w-5 text-purple-600" />
          </div>
        )}

        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 transition-colors ${
            isSelected ? 'bg-white/20' : iconColor
          }`}>
            {React.createElement(icon, {
              className: `h-6 w-6 ${isSelected ? 'text-white' : `text-${iconColor.split('-')[1]}-600`}`
            })}
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
            {plans.monthly[planType].name}
          </h3>
          
          {/* Price Display */}
          <div className="mb-2">
            <div className="flex items-center justify-center space-x-2">
              {billingCycle === 'annual' && (
                <>
                  <span className={`text-2xl font-semibold line-through ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                    ₹{monthlyPrice * 12}
                  </span>
                  <span className={`text-4xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    ₹{currentPrice}
                  </span>
                </>
              )}
              {billingCycle === 'monthly' && (
                <span className={`text-4xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  ₹{currentPrice}
                </span>
              )}
            </div>
            <span className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
              /student/{billingCycle === 'monthly' ? 'month' : 'year'}
            </span>
          </div>

          {/* Savings Badge */}
          {billingCycle === 'annual' && (
            <div className="mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Save {savings}%
              </span>
            </div>
          )}
        </div>

        <ul className={`space-y-3 mb-8 ${isSelected ? 'text-white' : 'text-gray-700'}`}>
          {planFeatures[planType].map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${
                isSelected ? 'text-white' : 'text-green-500'
              }`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlanSelect(planType);
          }}
          className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
            isSelected
              ? 'bg-white text-purple-600 hover:bg-gray-100'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          <span>{isSelected ? 'Selected' : 'Get Started'}</span>
          {isSelected ? (
            <Check className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Pricing
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Choose the perfect plan for your interview preparation journey
            </p>

            {/* Credits Exhausted Message */}
            {showCreditsExhausted && (
              <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 text-orange-800 px-4 py-2 rounded-lg mb-6">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">Your credits have been exhausted. Upgrade to continue!</span>
              </div>
            )}

            {/* Billing Toggle - No movement */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  billingCycle === 'annual' ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
              </span>
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {renderPricingCard('standard', Zap, 'bg-blue-100')}
          {renderPricingCard('pro', Star, 'bg-purple-100', 'MOST POPULAR')}
          {renderPricingCard('max', Crown, 'bg-amber-100')}
        </div>

        {/* Perks Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100"
        >
          <div className="text-center mb-6">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold mb-6 hover:bg-purple-700 transition-colors">
              Get Perks like:
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-gray-700">Dedicated team for technical issues.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-gray-700">
                  Minimum 2-3 intern hiring based on test and interviews and further performance based PPOs.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Crown className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-gray-700">
                  Quarterly talk with Industry People from Companies like Microsoft, Google, Amazon, Mercedes, BlackRock, Capital One, Sony R&D, De Shaw, Wells Fargo, KPMG etc.
                </p>
              </div>
            </div>
          </div>
        </motion.div> */}
      </div>
    </div>
  );
};

export default PricingPage;