import React from 'react';
import { CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

const STATUS_META = {
  success:  { icon: CheckCircle, color: 'text-green-600 bg-green-50',  label: 'Success' },
  pending:  { icon: Clock,       color: 'text-amber-600 bg-amber-50',  label: 'Pending' },
  failed:   { icon: XCircle,     color: 'text-red-600 bg-red-50',      label: 'Failed' },
  refunded: { icon: RefreshCw,   color: 'text-gray-600 bg-gray-50',    label: 'Refunded' },
};

const TransactionTable = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right">Credits</th>
            <th className="px-4 py-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((txn) => {
            const meta = STATUS_META[txn.status] || STATUS_META.pending;
            const Icon = meta.icon;
            return (
              <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {new Date(txn.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3 text-gray-800 font-medium capitalize">
                  {txn.transaction_type_display}
                </td>
                <td className="px-4 py-3 text-right text-gray-800 font-semibold">
                  ₹{Number(txn.amount).toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-right text-blue-600 font-semibold">
                  +{txn.credits_added}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color} mx-auto`}>
                    <Icon className="h-3 w-3" />
                    {meta.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
