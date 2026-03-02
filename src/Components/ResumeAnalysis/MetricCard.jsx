import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, AlertCircle, Zap } from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  type = 'strength', 
  priority = null,
  icon: Icon = null 
}) => {
  const getConfig = () => {
    if (type === 'strength') {
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        icon: Icon || CheckCircle,
        valueBg: 'bg-green-100',
        valueColor: 'text-green-800'
      };
    } else {
      const priorityConfig = {
        high: {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          valueBg: 'bg-red-100',
          valueColor: 'text-red-800',
          label: 'High Priority'
        },
        medium: {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          valueBg: 'bg-orange-100',
          valueColor: 'text-orange-800',
          label: 'Medium Priority'
        },
        low: {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          valueBg: 'bg-yellow-100',
          valueColor: 'text-yellow-800',
          label: 'Low Priority'
        }
      };
      const config = priorityConfig[priority] || priorityConfig.medium;
      return {
        ...config,
        icon: Icon || (priority === 'high' ? AlertCircle : TrendingUp)
      };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  // Calculate percentage if value is a number, otherwise don't show progress bar
  const showProgress = typeof value === 'number';
  const percentage = typeof value === 'number' ? value : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${config.iconBg} rounded-lg flex items-center justify-center`}>
          <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        {priority && (
          <span className={`${config.valueBg} ${config.valueColor} px-2 py-1 rounded-full text-xs font-medium`}>
            {config.label}
          </span>
        )}
      </div>
      <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
        {title}
      </h4>
      {showProgress && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
            <motion.div
              className={`${config.valueBg} h-2 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className={`text-sm font-semibold ${config.valueColor} w-12 text-right`}>
            {percentage}%
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;

