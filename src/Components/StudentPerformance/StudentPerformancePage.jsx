import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import api from '../../service/api';
import PerformanceOverviewCards from './PerformanceOverviewCards';
import PerformanceTrendChart from './PerformanceTrendChart';
import PerformanceByTypeBreakdown from './PerformanceByTypeBreakdown';

export default function StudentPerformancePage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('student/performance-analysis/');
        setData(res.data);
      } catch (err) {
        console.error('Student performance analysis:', err);
        setError(err.response?.status === 401 ? 'Please sign in' : 'Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
          </div>
          <p className="text-gray-600 font-medium">Loading your performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasAnySessions = data?.overall?.total_sessions > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Interview performance
          </h1>
          <p className="text-gray-600">
            Averages and trends across Technical, HR, Communication, Case Study, and Debate interviews
          </p>
        </motion.div>

        {!hasAnySessions ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-white border border-gray-100 shadow-sm p-12 text-center"
          >
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No interviews yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Complete Technical, HR, Communication, Case Study, or Debate interviews to see your averages and performance trends here.
            </p>
            <button
              onClick={() => navigate('/video-interview')}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              Start an interview
            </button>
          </motion.div>
        ) : (
          <div className="space-y-10">
            <PerformanceOverviewCards byType={data.by_type} overall={data.overall} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PerformanceTrendChart
                trend={data.overall?.trend}
                title="Overall performance trend"
                height={280}
              />
              <PerformanceByTypeBreakdown byType={data.by_type} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
