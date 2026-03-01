import React, { useState, useEffect } from 'react';
import { Code2, Plus, Trash2, Copy, Check, Key, AlertTriangle } from 'lucide-react';
import api from '../../../service/api';

const DeveloperTab = ({ account }) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState(null);

  const isDeveloper = account?.tier === 4;

  const fetchKeys = async () => {
    if (!isDeveloper) return;
    setLoading(true);
    try {
      const { data } = await api.get('billing/api-keys/');
      setApiKeys(data);
    } catch (e) {
      setError('Failed to load API keys.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKeys(); }, [isDeveloper]);

  const handleCreate = async () => {
    if (!newLabel.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post('billing/api-keys/', { label: newLabel.trim() });
      setApiKeys((prev) => [data, ...prev]);
      setNewLabel('');
    } catch {
      setError('Failed to create API key.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`billing/api-keys/${id}/`);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
    } catch {
      setError('Failed to revoke key.');
    }
  };

  const handleCopy = (key, id) => {
    navigator.clipboard.writeText(key.toString());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isDeveloper) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-amber-50 rounded-2xl mb-4">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Developer Tier Required</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          API key management is available exclusively for Developer tier accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <Code2 className="h-5 w-5 text-emerald-600 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Developer Access Active</p>
          <p className="text-xs text-emerald-600 mt-0.5">Unlimited credits. API keys can be used to authenticate programmatic requests.</p>
        </div>
      </div>

      {/* Create new key */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Key className="h-4 w-4 text-gray-400" />
          Create API Key
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Key label (e.g. Production)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newLabel.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {creating ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Create
          </button>
        </div>
      </div>

      {/* Key list */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No API keys yet.</div>
        ) : (
          apiKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">{key.label}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {key.key.toString().slice(0, 8)}••••••••••••••••••••••••••••••••
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Created {new Date(key.created_at).toLocaleDateString()}
                  {key.last_used_at && ` · Last used ${new Date(key.last_used_at).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(key.key, key.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Copy key"
                >
                  {copiedId === key.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDelete(key.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Revoke key"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}
    </div>
  );
};

export default DeveloperTab;
