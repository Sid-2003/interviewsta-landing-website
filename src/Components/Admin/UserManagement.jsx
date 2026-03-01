import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Trash2, Users, X, ChevronLeft, ChevronRight,
  RefreshCw, AlertCircle, AlertTriangle
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../service/api';
import PurpleDropdown from '../Common/PurpleDropdown';

const TIER_OPTIONS = [
  { value: 0, label: 'Free' },
  { value: 1, label: 'Pro' },
  { value: 2, label: 'Pro Plus' },
  { value: 3, label: 'Organisation' },
  { value: 4, label: 'Developer' },
];

const TIER_BADGE = {
  0: 'bg-gray-100 text-gray-700',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-purple-100 text-purple-700',
  3: 'bg-amber-100 text-amber-700',
  4: 'bg-emerald-100 text-emerald-700',
};

const ROLE_BADGE = {
  student: 'bg-green-100 text-green-700',
  teacher: 'bg-blue-100 text-blue-700',
  admin:   'bg-purple-100 text-purple-700',
};

const SkeletonRow = () => (
  <tr className="border-b">
    {[...Array(8)].map((_, i) => (
      <td key={i} className="py-3 px-6">
        <div className="h-4 bg-gray-100 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

// Confirmation modal
const DeleteConfirmModal = ({ user, onConfirm, onCancel, deleting }) => (
  <AnimatePresence>
    {user && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel}
        />
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.18 }}
        >
          <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-red-50 rounded-2xl mb-4">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Account</h3>
            <p className="text-sm text-gray-500 mb-1">
              You are about to permanently delete:
            </p>
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400 mb-5">{user.email}</p>
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-6 w-full">
              This will delete all their data — interviews, resumes, and billing history. This cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={onCancel}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [updatingTier, setUpdatingTier] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchUsers = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`billing/admin/users/?page=${p}`);
      setUsers(data.results || []);
      setTotalCount(data.count || 0);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(page); }, [page, fetchUsers]);

  const handleTierChange = async (userId, newTier) => {
    setUpdatingTier(userId);
    try {
      const { data } = await api.patch(`billing/admin/users/${userId}/tier/`, { tier: newTier });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, tier: data.tier, tier_name: data.tier_name, total_credits: data.total_credits, remaining_credits: data.remaining_credits }
            : u
        )
      );
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to update tier.');
    } finally {
      setUpdatingTier(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`billing/admin/users/${deleteTarget.id}/delete/`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setTotalCount((c) => c - 1);
      setDeleteTarget(null);
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.app_role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1.5 text-sm">
              Manage accounts and credit tiers — {totalCount} registered users
            </p>
          </div>
          <button
            onClick={() => fetchUsers(page)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <PurpleDropdown
            value={roleFilter}
            onChange={(v) => setRoleFilter(v)}
            placeholder="Filter by role"
            options={[
              { value: 'all',     label: 'All Roles' },
              { value: 'student', label: 'Students' },
              { value: 'teacher', label: 'Teachers' },
              { value: 'admin',   label: 'Admins' },
            ]}
            className="w-full md:w-48"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              All Users
            </h2>
            <span className="text-xs text-gray-500">{filteredUsers.length} shown</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">App Role</th>
                  <th className="px-6 py-3 text-left">Credit Tier</th>
                  <th className="px-6 py-3 text-right">Credits Remaining</th>
                  <th className="px-6 py-3 text-right">Interviews</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-left">Change Tier</th>
                  <th className="px-6 py-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ROLE_BADGE[u.app_role] || 'bg-gray-100 text-gray-700'}`}>
                          {u.app_role}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${TIER_BADGE[u.tier] || 'bg-gray-100 text-gray-700'}`}>
                          {u.tier_name}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-semibold text-gray-800">
                        {u.remaining_credits === -1 ? '∞' : u.remaining_credits}
                      </td>
                      <td className="px-6 py-3 text-right text-gray-700">
                        {u.interview_count ?? 0}
                      </td>
                      <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(u.date_joined).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3">
                        <div className="relative">
                          <select
                            value={u.tier}
                            disabled={updatingTier === u.id}
                            onChange={(e) => handleTierChange(u.id, Number(e.target.value))}
                            className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:border-blue-400 transition-colors"
                          >
                            {TIER_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {updatingTier === u.id && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2">
                              <span className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        user={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => !deleting && setDeleteTarget(null)}
        deleting={deleting}
      />
    </div>
  );
};

export default UserManagement;
