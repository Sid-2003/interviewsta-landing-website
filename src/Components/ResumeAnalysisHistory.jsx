import React, { useMemo, useState, useEffect } from 'react';
import { FileText, Eye, Download, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVideoInterview } from "../Contexts/VideoInterviewContext";


import api from "../service/api";
const ITEMS_PER_PAGE = 8;

const ResumeAnalysisHistory = ( ) => {
  const {state,dispatch} = useVideoInterview();
  const [currentPage, setCurrentPage] = useState(1);
  const auth = state.auth;

  const navigate = useNavigate();
  const location = useLocation();

  const {resumeAnalysisReports: initialResumeReports = []} = location.state || {};
  const [resumeReports, setResumeReports] = useState(initialResumeReports);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchCached(key, fetchFn, ttl = 10 * 60 * 1000) { // 10 minutes TTL
      const cachedItem = localStorage.getItem(key);
      if (cachedItem) {
        console.log("cached");
        try {
          const { value, timestamp } = JSON.parse(cachedItem);
          const isExpired = Date.now() - timestamp > ttl;
          if (!isExpired) return value;
        } catch {
          // Invalid cache, ignore and fetch new
        }
      }
      console.log("not cached");
      const value = await fetchFn();
      localStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
      return value;
    }

    const fetchData = async () => {
      if (resumeReports.length === 0) {
        console.log("vndsvkbiusbivudsbvsiodvbo", auth.user);
        const user = auth.user;
        if (!user) return;
        setLoading(true);
        try {
                  //   console.log("This is the token",token);
          const getJSON = (url) =>
            api.get(url.replace(import.meta.env.VITE_BACKEND_URL, ''))
              .then(res => res.data)
              .catch(error => {
                console.error("API error:", error);
                throw new Error("Failed to fetch");
              });

          // Assuming API endpoint returns { videoReports: [...], resumeReports: [...] }
          const [response2] = await Promise.all([
            fetchCached(
            "resumeProgress",
            () => getJSON("http://localhost:8000/api/get-resume-progress")
            )
            ]);
          console.log("Repsvlknsdl",response2);
        setResumeReports(response2.map(item => ({
            id: item.id,
            fileName: item.resume_name,
            date: new Date(item.created_at).toLocaleDateString(),
            overallScore: item.overall_score,
            jobMatchScore: item.job_match_score,
            targetRole: item.role,
            company: item.company,
            keyStrengths: item.strengths,
            improvements: item.weaknesses
        })));
        } catch (error) {
          console.error("Error fetching fallback data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
    console.log("These are the resume reports", resumeReports);
  }, []);

//   setResumeReports(response2.map(item => ({
//             id: item.id,
//             fileName: item.resume_name,
//             date: new Date(item.created_at).toLocaleDateString(),
//             overallScore: item.overall_score,
//             jobMatchScore: item.job_match_score,
//             targetRole: item.role,
//             company: item.company,
//             keyStrengths: item.strengths,
//             improvements: item.weaknesses
//         })));

//   const resumeReports = [
//     {
//       id: '1',
//       fileName: 'Sarah_Johnson_Resume_v3.pdf',
//       date: '2024-01-15',
//       overallScore: 85,
//       jobMatchScore: 78,
//       targetRole: 'Senior Frontend Developer',
//       company: 'Google',
//       keyStrengths: ['Strong technical skills', 'Quantified achievements', 'ATS optimized'],
//       improvements: ['Add more leadership examples', 'Include cloud technologies']
//     },
//     {
//       id: '2',
//       fileName: 'Sarah_Johnson_Resume_v2.pdf',
//       date: '2024-01-10',
//       overallScore: 72,
//       jobMatchScore: 65,
//       targetRole: 'Full Stack Developer',
//       company: 'Meta',
//       keyStrengths: ['Good project descriptions', 'Relevant experience'],
//       improvements: ['Add more keywords', 'Improve formatting', 'Add certifications']
//     }
//   ];

  const onBack = () => navigate('/manage');

  const sortedReports = useMemo(
    () => [...resumeReports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [resumeReports]
  );

  const totalPages = Math.ceil(sortedReports.length / ITEMS_PER_PAGE);
  const pagedReports = sortedReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleClickReport = (report) => {
    navigate('/feedback-view',{
      state:{
      type: 'resume-analysis',
      resume_id: report.id,
      fileName: report.fileName,
      date: report.date,
      back: '/resume-analysis-reports'
    }
    });
  };

  const handleDownload = (report, e) => {
    e.stopPropagation();
    console.log('Download report:', report.id);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-10 px-6 lg:px-12">
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
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </motion.button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Resume Analysis History
            </h1>
            <p className="text-gray-600 mt-2">Review all your past resume analyses</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Analyses</p>
            <p className="text-3xl font-bold text-gray-900">{sortedReports.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-600" />
                All Analyses
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
                  <th className="py-4 px-6 text-left font-semibold">File Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Date</th>
                  <th className="py-4 px-6 text-left font-semibold">Target Role</th>
                  <th className="py-4 px-6 text-left font-semibold">Company</th>
                  <th className="py-4 px-6 text-left font-semibold">Overall Score</th>
                  <th className="py-4 px-6 text-left font-semibold">Job Match</th>
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
                    className="border-b hover:bg-purple-50 transition-colors cursor-pointer"
                    onClick={() => handleClickReport(report)}
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">{report.fileName}</td>
                    <td className="py-4 px-6 text-gray-700">{report.date}</td>
                    <td className="py-4 px-6 text-gray-700">{report.targetRole}</td>
                    <td className="py-4 px-6 text-gray-700">{report.company || '-'}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(
                          report.overallScore
                        )}`}
                      >
                        {report.overallScore}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(
                          report.jobMatchScore
                        )}`}
                      >
                        {report.jobMatchScore}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
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
                {pagedReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No resume analysis reports available</p>
                      <p className="text-gray-400 text-sm mt-2">Upload your first resume to see results here</p>
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

export default ResumeAnalysisHistory;
