import React from 'react';
import { Zap, Star, Building2, Code2, Gift } from 'lucide-react';

const PLAN_META = {
  Free:         { icon: Gift,     color: 'bg-gray-100 text-gray-700 border-gray-200',          dot: 'bg-gray-400' },
  Pro:          { icon: Zap,      color: 'bg-blue-100 text-blue-700 border-blue-200',           dot: 'bg-blue-500' },
  'Pro Plus':   { icon: Star,     color: 'bg-purple-100 text-purple-700 border-purple-200',     dot: 'bg-purple-500' },
  Organisation: { icon: Building2,color: 'bg-amber-100 text-amber-700 border-amber-200',        dot: 'bg-amber-500' },
  Developer:    { icon: Code2,    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',  dot: 'bg-emerald-500' },
};

const PlanBadge = ({ tier, size = 'md' }) => {
  const meta = PLAN_META[tier] || PLAN_META.Free;
  const Icon = meta.icon;
  const sizeClass = size === 'lg' ? 'px-4 py-1.5 text-sm gap-2' : 'px-2.5 py-1 text-xs gap-1.5';
  const iconSize = size === 'lg' ? 'h-4 w-4' : 'h-3 w-3';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${meta.color} ${sizeClass}`}>
      <Icon className={iconSize} />
      {tier}
    </span>
  );
};

export default PlanBadge;
