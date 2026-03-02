import React, { useEffect, useMemo, useState } from "react";
import { PlayCircle, FileText, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import interviewTypes from '../../Data/interviewTypes.json';
import api from "../../service/api";
const ITEMS_PER_PAGE = 2;

const PastReportsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initial data from location.state fallback to empty arrays
  const {
    videoInterviewReports: initialVideoReports = [],
    resumeAnalysisReports: initialResumeReports = [],
  } = location.state || {};

  // Local states to hold actual data, initialized from location.state
  const [videoReports, setVideoReports] = useState(initialVideoReports);
  const [resumeReports, setResumeReports] = useState(initialResumeReports);
  const [loading, setLoading] = useState(false);

  const onBack = () => navigate("/manage");

  useEffect(() => {
    async function fetchCached(key, fetchFn, ttl = 10 * 60 * 1000) { // 10 minutes TTL
      const cachedItem = localStorage.getItem(key);
      if (cachedItem) {
        console.log("cached");
        try {
          const { value, timestamp } = JSON.parse(cachedItem);
          const isExpired = Date.now() - timestamp > ttl;
          console.log("This is the cached", value);
          console.log("THis is if expired", isExpired);
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
      if (videoReports.length === 0 && resumeReports.length === 0) {
        console.log("vndsvkbiusbivudsbvsiodvbo")
        if (!user) return;
        setLoading(true);
        try {
                    const getJSON = (url) =>
            fetch(url, {}).then((res) => {
              if (!res.ok) throw new Error("Failed to fetch");
              return res.json();
            });

          // Assuming API endpoint returns { videoReports: [...], resumeReports: [...] }
          const [response1, response2] = await Promise.all(
            [fetchCached(
            "latestStats",
            () => getJSON("http://localhost:8000/api/latest-stats")
            ),
            fetchCached(
            "resumeProgress",
            () => getJSON("http://localhost:8000/api/get-resume-progress")
            )
            ]);

          console.log("Repsvlknsdl",response1);
          console.log("Repsvlknsdl",response2);
          setVideoReports(response1.map(item => {
            const index = interviewTypes.findIndex(element => element["id"] === item["interview_id"]);
            const interviewType = index !== -1 
                ? interviewTypes[index]
                : { 
                    title: 'N/A', 
                    category: 'N/A', 
                    difficulty: 'N/A', 
                    topics: ['N/A']
                  };
            return {
                id: item.id,
                type: interviewType.category,
                title: interviewType.title,
                date: new Date(item.created_at).toLocaleDateString(),
                duration: item.duration || 0,
                score: item.overall_score,
                status: 'completed',
                difficulty: interviewType.difficulty,
                topics: interviewType.topics,
                interviewType: item.interview_type
            };
        }));
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
    console.log("These are the video reports", videoReports);
    console.log("These are the resume reports", resumeReports);
  }, []);

  // Sort reports by date descending
  const sortedVideoReports = useMemo(
    () => [...videoReports].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [videoReports]
  );

  const sortedResumeReports = useMemo(
    () => [...resumeReports].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [resumeReports]
  );

  const handleClickReport = (report) => {
    navigate("/feedback-view", {
      state: {
        interview_id: report.id,
        interview_type: report.interviewType,
        back: "/past-reports",
      },
    });
  };

   const handleVideoClickReport = (report) => {
    navigate("/feedback-view", {
      state: {
        resume_id: report.id,
        type: "resume-analysis",
        back: "/past-reports",
      },

    });
  };
  // Pagination state
  const [videoPage, setVideoPage] = useState(1);
  const [resumePage, setResumePage] = useState(1);

  const totalVideoPages = Math.ceil(sortedVideoReports.length / ITEMS_PER_PAGE);
  const totalResumePages = Math.ceil(sortedResumeReports.length / ITEMS_PER_PAGE);

  const pagedVideoReports = sortedVideoReports.slice(
    (videoPage - 1) * ITEMS_PER_PAGE,
    videoPage * ITEMS_PER_PAGE
  );
  const pagedResumeReports = sortedResumeReports.slice(
    (resumePage - 1) * ITEMS_PER_PAGE,
    resumePage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 lg:px-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Past Reports</h1>
          <p className="text-gray-600">Review all your interviews and resume analyses</p>
        </div>
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading && (
        <div className="mb-6 text-center text-gray-600">Loading reports...</div>
      )}

      {/* VIDEO INTERVIEWS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-10">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-blue-600" />
            Video Interview History
          </h2>
          <span className="text-sm text-gray-500">{sortedVideoReports.length} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Type</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Duration</th>
                <th className="py-3 px-6 text-left">Difficulty</th>
                <th className="py-3 px-6 text-left">Score</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedVideoReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => handleClickReport(report)}
                >
                  <td className="py-3 px-6 font-medium text-gray-900">{report.title}</td>
                  <td className="py-3 px-6 text-gray-700">{report.type}</td>
                  <td className="py-3 px-6 text-gray-700">{report.date}</td>
                  <td className="py-3 px-6 text-gray-700">{report.duration} min</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : report.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {report.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-semibold text-gray-900">{report.score}%</td>
                  <td className="py-3 px-6 text-center">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600" aria-label="View report">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-600" aria-label="Download report">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {pagedVideoReports.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500">
                    No video interview reports available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination for Video */}
        {totalVideoPages > 1 && (
          <div className="flex justify-end items-center gap-4 p-4 border-t border-gray-100">
            <button
              onClick={() => setVideoPage((p) => Math.max(p - 1, 1))}
              disabled={videoPage === 1}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-gray-700 text-sm">
              Page {videoPage} of {totalVideoPages}
            </span>
            <button
              onClick={() => setVideoPage((p) => Math.min(p + 1, totalVideoPages))}
              disabled={videoPage === totalVideoPages}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 disabled:opacity-40"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* RESUME ANALYSIS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Resume Analysis History
          </h2>
          <span className="text-sm text-gray-500">{sortedResumeReports.length} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">File</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Target Role</th>
                <th className="py-3 px-6 text-left">Company</th>
                <th className="py-3 px-6 text-left">Overall Score</th>
                <th className="py-3 px-6 text-left">Job Match</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedResumeReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b hover:bg-purple-50 transition-colors cursor-pointer"
                  onClick={() => handleVideoClickReport(report)}
                >
                  <td className="py-3 px-6 font-medium text-gray-900">{report.fileName}</td>
                  <td className="py-3 px-6 text-gray-700">{report.date}</td>
                  <td className="py-3 px-6 text-gray-700">{report.targetRole}</td>
                  <td className="py-3 px-6 text-gray-700">{report.company || "-"}</td>
                  <td className="py-3 px-6 font-semibold text-gray-900">{report.overallScore}%</td>
                  <td className="py-3 px-6 text-gray-900">{report.jobMatchScore}%</td>
                  <td className="py-3 px-6 text-center">
                    <button className="p-1.5 text-gray-400 hover:text-purple-600" aria-label="View report">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-purple-600" aria-label="Download report">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {pagedResumeReports.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500">
                    No resume analysis reports available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination for Resume */}
        {totalResumePages > 1 && (
          <div className="flex justify-end items-center gap-4 p-4 border-t border-gray-100">
            <button
              onClick={() => setResumePage((p) => Math.max(p - 1, 1))}
              disabled={resumePage === 1}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-gray-700 text-sm">
              Page {resumePage} of {totalResumePages}
            </span>
            <button
              onClick={() => setResumePage((p) => Math.min(p + 1, totalResumePages))}
              disabled={resumePage === totalResumePages}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 disabled:opacity-40"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastReportsTable;
