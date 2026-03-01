import React, { useMemo, useState, useEffect } from 'react';
import { PlayCircle, Eye, Download, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
// eslint-disable-next-line no-unused-vars -- used as motion.div, motion.button, etc. in JSX
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVideoInterview } from "../Contexts/VideoInterviewContext";
import interviewTypes from '../Data/interviewTypes.json';

import api from "../service/api";
const ITEMS_PER_PAGE = 8;



const VideoInterviewHistory = () => {
  const { state } = useVideoInterview();
  const [currentPage, setCurrentPage] = useState(1);
  const auth = state.auth;

  const navigate = useNavigate();
  const location = useLocation();

  const {videoInterviewReports: initialVideoReports = []} = location.state || {};
  const [videoReports, setVideoReports] = useState(initialVideoReports);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always fetch fresh list from API (authenticated). Do not rely only on location.state.
    const fetchData = async () => {
      if (state.auth.loading) return;
      const user = auth.user;
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Use authenticated api instance so token is sent (same as Dashboard)
        const response = await api.get('latest-stats');
        const data = response.data;
        if (!Array.isArray(data)) {
          setVideoReports([]);
          return;
        }
        setVideoReports(data.map(item => {
          const index = interviewTypes.findIndex(element => element["id"] === item["interview_id"]);
          const interviewType = index !== -1
            ? interviewTypes[index]
            : {
                title: 'N/A',
                category: 'N/A',
                difficulty: 'N/A',
                topics: ['N/A']
              };
          let displayType = item.interview_type || interviewType.category;
          if (item.company) displayType = item.company;
          else if (item.subject) displayType = item.subject;
          const title = item.company || item.subject || item.title || interviewType.title;
          return {
            id: item.id,
            type: displayType,
            title,
            date: new Date(item.created_at).toLocaleDateString(),
            duration: item.duration || 0,
            score: item.overall_score,
            status: 'completed',
            difficulty: interviewType.difficulty,
            topics: interviewType.topics,
            interviewType: item.interview_type
          };
        }));
      } catch (error) {
        console.error("Error fetching video interview list:", error);
        setVideoReports(initialVideoReports.length > 0 ? initialVideoReports : []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only refetch when auth changes
  }, [auth.user, state.auth.loading]);

  // const videoReports: VideoReport[] = [
  //   {
  //     id: '1',
  //     title: 'Google Software Engineer Interview',
  //     type: 'Company-Specific',
  //     date: '2024-01-16',
  //     duration: 45,
  //     score: 82,
  //     topics: ['Data Structures', 'Algorithms', 'System Design'],
  //     difficulty: 'Hard',
  //     status: 'completed',
  //     interviewType: 'company-specific'
  //   },
  //   {
  //     id: '2',
  //     title: 'Frontend Developer Technical',
  //     type: 'Role-Based',
  //     date: '2024-01-14',
  //     duration: 35,
  //     score: 78,
  //     topics: ['React', 'JavaScript', 'CSS'],
  //     difficulty: 'Medium',
  //     status: 'completed',
  //     interviewType: 'role-based'
  //   },
  //   {
  //     id: '3',
  //     title: 'Operating Systems Fundamentals',
  //     type: 'Subject-Based',
  //     date: '2024-01-12',
  //     duration: 30,
  //     score: 85,
  //     topics: ['Process Management', 'Memory', 'File Systems'],
  //     difficulty: 'Medium',
  //     status: 'completed',
  //     interviewType: 'subject-based'
  //   }
  // ];

  const onBack = () => navigate('/manage');

  const sortedReports = useMemo(
    () => [...videoReports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [videoReports]
  );

  const totalPages = Math.ceil(sortedReports.length / ITEMS_PER_PAGE);
  const pagedReports = sortedReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleClickReport = (report) => {
    navigate('/feedback-view',{
      state:{
      type: 'video-interview',
      interview_id: report.id,
      interview_type: report.interviewType,
      title: report.title,
      date: report.date,
      back: '/video-interview-reports'
    }
    });
  };

  const handleDownload = (report, e) => {
    e.stopPropagation();
    console.log('Download report:', report.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.button
              whileHover={{ x: -5 }}
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </motion.button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Video Interview History
            </h1>
            <p className="text-gray-600 mt-2">Review all your past video interview sessions</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Interviews</p>
            <p className="text-3xl font-bold text-gray-900">{sortedReports.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <PlayCircle className="w-6 h-6 text-blue-600" />
                All Sessions
              </h2>
              <span className="text-sm text-gray-600">
                Showing {pagedReports.length} of {sortedReports.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">Title</th>
                  <th className="py-4 px-6 text-left font-semibold">Type</th>
                  <th className="py-4 px-6 text-left font-semibold">Date</th>
                  <th className="py-4 px-6 text-left font-semibold">Duration</th>
                  <th className="py-4 px-6 text-left font-semibold">Difficulty</th>
                  <th className="py-4 px-6 text-left font-semibold">Score</th>
                  <th className="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedReports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => handleClickReport(report)}
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">{report.title}</td>
                    <td className="py-4 px-6 text-gray-700">{report.type}</td>
                    <td className="py-4 px-6 text-gray-700">{report.date}</td>
                    <td className="py-4 px-6 text-gray-700">{report.duration} min</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-800'
                            : report.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {report.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-lg text-gray-900">{report.score}%</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          aria-label="View report"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDownload(report, e)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="Download report"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <p className="text-gray-500 text-lg">Loading interview list...</p>
                    </td>
                  </tr>
                )}
                {!loading && pagedReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No video interview reports available</p>
                      <p className="text-gray-400 text-sm mt-2">Start your first interview to see results here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-6 border-t border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VideoInterviewHistory;
