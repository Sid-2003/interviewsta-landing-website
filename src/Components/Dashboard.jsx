import React, {useState,useEffect,useRef} from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Award, 
  Target, 
  // stat,
  Calendar, 
  BarChart3, 
  CheckCircle,
  PlayCircle,
  FileText,
  Users,
  Star,
  Eye,
  Download,
  Filter,
  ChevronRight,
  ArrowRight,
  Medal,
  Zap
} from 'lucide-react';
import axios from 'axios';
import DashboardSkeleton from './DashboardSkeleton';
import interviewTypes from '../Data/interviewTypes.json';
import { duration } from '@mui/material/styles';
import FeedbackTemp from './FeedbackTemp';
// import ComingSoonOverlay from './Experimental/ComingSoonOverlay';
import { useNavigate, Navigate } from 'react-router-dom';
import { useVideoInterview } from '../Contexts/VideoInterviewContext';
import LearningProgressSection from './Dashboard/LearningProgressSection';
import PerformanceOverviewCards from './StudentPerformance/PerformanceOverviewCards';
import PerformanceTrendChart from './StudentPerformance/PerformanceTrendChart';
import PerformanceByTypeBreakdown from './StudentPerformance/PerformanceByTypeBreakdown';

import api from "../service/api";
const Dashboard = ({ onSectionChange }) => {
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [recentActivity, setRecentActivity] = useState([
  ])
  const [toggleInterviewFeedback, setToggleInterviewFeedback] = useState(false);
  const navigate = useNavigate();
  
  const MAX_DISPLAY = 1;

  const { state, dispatch } = useVideoInterview();

function renderTruncatedList(items, maxWidth = 300) { // default 320px; adjust as needed
  if (!items || items.length === 0) return null;
  const displayItems = Array.isArray(items) ? items.slice(0, MAX_DISPLAY) : [items];
  const remaining = Array.isArray(items) ? items.length - MAX_DISPLAY : 0;
  return (
    <>
    <span style={{
      display: 'inline-block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: maxWidth,
      verticalAlign: 'bottom',
      fontSize: '12px'
    }}>
      {displayItems.join(', ')}
    </span>
    <span style={{fontSize: '12px'}}>{remaining > 0 && ` ... +${remaining} more`} </span>
    </>
  );
}

useEffect(() => {
    const user = state.auth.user;
    // console.log("This is the user -> ", user.displayName);
}
, []);


  const [videoInterviewReports, setVideoInterviewReports] = useState([]);
  const [resumeAnalysisReports, setResumeAnalysisReports] = useState([]);
  const [performanceAnalysis, setPerformanceAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [classroomStats, setClassroomStats] = useState({ classesJoined: 0, upcomingSlots: 0, assignments: 0 });

  useEffect (() => {
    // console.log("Recent Activity updated:", recentActivity);
  }, [recentActivity]);

  const recentTests = [
    {
      id: '1',
      testName: 'JavaScript Fundamentals',
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      completedAt: new Date('2024-01-15'),
      category: 'Technical'
    },
    {
      id: '2',
      testName: 'System Design Basics',
      score: 78,
      totalQuestions: 15,
      correctAnswers: 12,
      completedAt: new Date('2024-01-14'),
      category: 'Technical'
    }
  ];

  const recentInterviews= [
    {
      id: '1',
      title: 'Frontend Developer Interview',
      duration: 45,
      questions: 8,
      difficulty: 'medium',
      completedAt: new Date('2024-01-16'),
      score: 82
    }
  ];

  const peerRankingData = {
    currentRank: 23,
    totalUsers: 1247,
    percentile: 98,
    rankChange: +5,
    category: 'Frontend Development',
    topSkills: [
      { skill: 'React', rank: 15, percentile: 99 },
      { skill: 'JavaScript', rank: 28, percentile: 97 },
      { skill: 'System Design', rank: 45, percentile: 94 }
    ]
  };

  const FALLBACK_INTERVIEW_TYPE = { 
    title: 'N/A', 
    category: 'N/A', 
    difficulty: 'N/A', 
    topics: ['N/A'],
    questions: null,
    duration: null 
};
  const analyticsData = {
    weeklyProgress: [
      { day: 'Mon', interviews: 2, tests: 1, studyTime: 3.5 },
      { day: 'Tue', interviews: 1, tests: 2, studyTime: 2.8 },
      { day: 'Wed', interviews: 3, tests: 1, studyTime: 4.2 },
      { day: 'Thu', interviews: 1, tests: 3, studyTime: 3.1 },
      { day: 'Fri', interviews: 2, tests: 2, studyTime: 3.8 },
      { day: 'Sat', interviews: 1, tests: 1, studyTime: 2.5 },
      { day: 'Sun', interviews: 0, tests: 1, studyTime: 1.8 }
    ],
    monthlyTrends: {
      interviewScoreImprovement: 15,
      testAccuracyImprovement: 12,
      studyTimeIncrease: 8,
      skillsImproved: 7
    }
  };

  // const allSkills = [
  //   { 
  //     skill: 'JavaScript & React', 
  //     current: 85, 
  //     previous: 72, 
  //     change: +13,
  //     color: 'blue',
  //     interviews: 8,
  //     tests: 12
  //   },
  //   { 
  //     skill: 'System Design', 
  //     current: 78, 
  //     previous: 65, 
  //     change: +13,
  //     color: 'purple',
  //     interviews: 5,
  //     tests: 7
  //   },
  //   { 
  //     skill: 'Data Structures & Algorithms', 
  //     current: 82, 
  //     previous: 75, 
  //     change: +7,
  //     color: 'green',
  //     interviews: 6,
  //     tests: 15
  //   },
  //   { 
  //     skill: 'Behavioral Questions', 
  //     current: 88, 
  //     previous: 80, 
  //     change: +8,
  //     color: 'orange',
  //     interviews: 10,
  //     tests: 5
  //   },
  //   { 
  //     skill: 'Database Management', 
  //     current: 75, 
  //     previous: 68, 
  //     change: +7,
  //     color: 'indigo',
  //     interviews: 3,
  //     tests: 8
  //   },
  //   { 
  //     skill: 'Operating Systems', 
  //     current: 73, 
  //     previous: 65, 
  //     change: +8,
  //     color: 'red',
  //     interviews: 4,
  //     tests: 9
  //   },
  //   { 
  //     skill: 'Computer Networks', 
  //     current: 70, 
  //     previous: 62, 
  //     change: +8,
  //     color: 'cyan',
  //     interviews: 3,
  //     tests: 6
  //   },
  //   { 
  //     skill: 'Machine Learning', 
  //     current: 68, 
  //     previous: 58, 
  //     change: +10,
  //     color: 'pink',
  //     interviews: 2,
  //     tests: 7
  //   }
  // ];

  async function fetchCached(key, fetchFn, ttl = 10 * 60 * 1000) { // default TTL: 10 minutes
      const cachedItem = localStorage.getItem(key);
      if (cachedItem) {
        // console.log(cachedItem);
        const { value, timestamp } = JSON.parse(cachedItem);
        const isExpired = Date.now() - timestamp > ttl;
        if (!isExpired) return value;
      }

      const value = await fetchFn();
      localStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
      return value;
    }


  useEffect(() => {
  const fetchData = async () => {
    try {
      if (state.auth.loading) return;
      const user = state.auth.user;
      if (!user) return;

      // Clear cache when returning from interview feedback so new interview appears
      const shouldRefresh = sessionStorage.getItem('refreshDashboard');
      if (shouldRefresh === 'true') {
        localStorage.removeItem('latestStats');
        localStorage.removeItem('resumeProgress');
        sessionStorage.removeItem('refreshDashboard');
      }

      // Helper to make authenticated GET requests using api instance (auto-attaches token)
      const getJSON = (endpoint) => api.get(endpoint)
        .then(res => res.data)
        .catch(error => {
          console.log("API error:", error);
          navigate("/oops-something-wrong");
        });

      // Cache each API response
      const [data2, data3] = await Promise.all([
        fetchCached('latestStats', () => getJSON('latest-stats')),
        fetchCached('resumeProgress', () => getJSON('get-resume-progress')),
      ]);
      setIsLoading(false);
      

      setVideoInterviewReports(Array.isArray(data2) ? data2.map(item => 
        {
          const index = interviewTypes.findIndex(element => element["id"] === item["interview_id"]);

    // 2. Determine the correct interview type object
          const interviewType = index !== -1 
              ? interviewTypes[index]
              : FALLBACK_INTERVIEW_TYPE; // Use fallback if not found
          
          // Determine display type - prioritize company/subject names for specificity
          let displayType = item.interview_type || interviewType.category;
          
          // For company/subject interviews, show the specific name
          if (item.company) {
            displayType = item.company; // "Amazon", "Google", etc.
          } else if (item.subject) {
            displayType = item.subject; // "Arrays", "Trees", etc.
          }
          
        return {
        id: item.id,
        type: displayType,
        title: item.title || interviewType.title,
        date: new Date(item.created_at).toLocaleDateString(),
        duration: item.duration || 0,
        score: item.overall_score,
        status: 'completed',
        difficulty: interviewType.difficulty,
        topics: interviewType.topics,
        interviewType: item.interview_type,
        company: item.company,
        subject: item.subject
       }}) : []);
      setResumeAnalysisReports(Array.isArray(data3) ? data3.map(item => ({
        id: item.id,
        fileName: item.resume_name,
        date: new Date(item.created_at).toLocaleDateString(),
        overallScore: item.overall_score,
        jobMatchScore: item.job_match_score,
        targetRole: item.role,
        company: item.company,
        keyStrengths: item.strengths,
        improvements: item.weaknesses
      })) : []);

      const combined = [
        ...(Array.isArray(data2) ? data2 : []),
        ...(Array.isArray(data3) ? data3 : [])
      ];

      // console.log("Combined before sort:", combined);
      combined.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));



      setRecentActivity(combined.slice(0,3).map((item,index) => {
        const ind = item.interview_id ? interviewTypes.findIndex(element => element["id"] === item["interview_id"]) : -1;
        const interviewType = item.interview_id ? ind !== -1 
        ? interviewTypes[ind]
        : FALLBACK_INTERVIEW_TYPE : {};
        return {
        id: index,
        title: interviewType.title ? interviewType.title : item.resume_name,
        questions: interviewType.questions ? interviewType.questions : null,
        difficulty: interviewType.difficulty ? interviewType.difficulty : null,
        score: item.overall_score,
        duration: interviewType.duration ? interviewType.duration : null,
        completedAt: new Date(item.created_at).toLocaleDateString()
      }}));



      

      const perfRes = await api.get('student/performance-analysis/').catch(() => ({ data: null }));
      if (perfRes?.data) setPerformanceAnalysis(perfRes.data);

      // { 
  //     skill: 'Machine Learning', 
  //     current: 68, 
  //     previous: 58, 
  //     change: +10,
  //     color: 'pink',
  //     interviews: 2,
  //     tests: 7
  //   }
      

      console.log("This is data2:", data2);
      console.log("This is data3:", data3);
      // for(const d of data2){
      //   console.log(interviewTypes[interviewTypes.findIndex(element => element["id"] === d["interview_id"])])
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/oops-something-wrong");
    }
  };

  fetchData();
}, [state.auth.user, state.auth.loading]);

// Fetch classroom stats
useEffect(() => {
  const fetchClassroomStats = async () => {
    try {
      const [classesRes, slotsRes, assignRes] = await Promise.all([
        api.get('classes/'),
        api.get('time-slots/'),
        api.get('assignments/')
      ]);
      
      const classes = classesRes.data.results || classesRes.data || [];
      const slots = slotsRes.data.results || slotsRes.data || [];
      const assignments = assignRes.data.results || assignRes.data || [];
      
      // Filter to only show classes the student is enrolled in
      const enrolledClasses = Array.isArray(classes) ? classes.filter(c => c.is_student) : [];
      
      setClassroomStats({
        classesJoined: enrolledClasses.length,
        upcomingSlots: Array.isArray(slots) ? slots.filter(s => s.status === 'available').length : 0,
        assignments: Array.isArray(assignments) ? assignments.length : 0
      });
    } catch (error) {
      console.error('Error fetching classroom stats:', error);
    }
  };
  
  fetchClassroomStats();
}, []);

const handleViewAll = () => {
  navigate("/video-interview-reports", {
      state: { videoInterviewReports },
  });
}

const handleResumeViewAll = () => {
  navigate("/resume-analysis-reports", {
      state: { resumeAnalysisReports },
  });
}

const handleInteviewClick = (p) => {
  console.log("[INFO] Video Interview clicked:", p);
    navigate('/feedback-view',{
      state:{
      type: 'video-interview',
      interview_id: p.id,
      interview_type: p.interviewType,
      title: p.title,
      date: p.date,
      back: '/manage'
    }
    });
}

const handleResumeReportClick = (p) => {
  console.log("[INFO] Resume Report clicked:", p);
  navigate('/feedback-view',{
      state:{
      type: 'resume-analysis',
      fileName: p.fileName,
      date: p.date,
      resume_id: p.id,
      back: '/manage'
    }
    });
    
    // navigate('/resume-feedback-view',{
    //   state:{
    //   report_id: p.id,
    //   back: '/manage'
    // }
    // });
}

  // Calculate average resume score
  const avgResumeScore = resumeAnalysisReports.length > 0
    ? Math.round(resumeAnalysisReports.reduce((sum, r) => sum + (r.overallScore || 0), 0) / resumeAnalysisReports.length)
    : 0;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 backdrop-blur-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {state.auth.user?.displayName || state.auth.user?.email || "User"}
                </span>
                !
              </h1>
              <p className="text-gray-600 text-base md:text-lg">
                Here's your interview preparation progress
              </p>
            </div>

            {/* Start interview CTA */}
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/video-interview")}
              className="relative inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm md:text-base text-white overflow-hidden group"
            >
              {/* Glow */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 blur-xl group-hover:opacity-80 transition-opacity duration-300" />
              {/* Solid gradient */}
              <span className="absolute inset-[1px] rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />
              <span className="relative z-10 flex items-center gap-2.5">
                <span>Start interview</span>
                <ArrowRight className="h-4.5 w-4.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* My Classroom Card - Hidden for trial */}
        {/* <div className="mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">My Classroom</h3>
                  </div>
                  <p className="text-sm text-gray-600">Structured learning from your instructor</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">{classroomStats.classesJoined}</div>
                  <div className="text-xs text-gray-600">Classes Joined</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{classroomStats.upcomingSlots}</div>
                  <div className="text-xs text-gray-600">Upcoming Slots</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{classroomStats.assignments}</div>
                  <div className="text-xs text-gray-600">Assignments</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/student/classes')}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>View Classroom</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Interview performance – averages & trends by type */}
        {performanceAnalysis != null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8"
          >
            <div className="space-y-8">
              <PerformanceOverviewCards byType={performanceAnalysis.by_type} overall={performanceAnalysis.overall} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PerformanceTrendChart trend={performanceAnalysis.overall?.trend} title="Overall performance trend" height={280} />
                <PerformanceByTypeBreakdown byType={performanceAnalysis.by_type} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Peer Ranking Section */}
        {/* <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Peer Ranking & Performance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Medal className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+{peerRankingData.rankChange}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">#{peerRankingData.currentRank}</div>
                <div className="text-sm text-gray-600">out of {peerRankingData.totalUsers.toLocaleString()}</div>
                <div className="text-purple-600 font-medium mt-1">{peerRankingData.percentile}th percentile</div>
              </div>
            </div> */}

            {/* Top Skills Ranking */}
            {/* {peerRankingData.topSkills.map((skill, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{skill.skill}</h3>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">#{skill.rank}</div>
                <div className="text-sm text-gray-600">{skill.percentile}th percentile</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.percentile}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Reports Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
        <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Past Reports & Analysis</h2>
            <p className="text-gray-600">Review your interview performance and resume insights</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Interview Reports - styled like Performance components */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden min-h-[320px] flex flex-col"
            >
              <div className="p-5 border-b border-gray-100 bg-blue-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm">
                      <PlayCircle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Video Interview Reports</h3>
                  </div>
                  <button
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    onClick={() => handleViewAll()}
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1">
                {videoInterviewReports.length > 0 ? (
                  <div className="space-y-3">
                    {videoInterviewReports.slice(0, 3).map((report, idx) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + idx * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleInteviewClick(report)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 mb-1.5 text-sm truncate">{report.title}</h4>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-600 mb-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-lg">
                                {report.type}
                              </span>
                              <span className="hidden sm:inline">{report.date}</span>
                              <span className="hidden sm:inline">{report.duration} min</span>
                              <span className={`px-2 py-0.5 rounded-lg ${
                                report.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                report.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {report.difficulty}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs mb-2 line-clamp-2">{report.feedback}</p>
                            <div className="flex flex-wrap gap-1">
                              {report.topics.slice(0, 2).map((topic, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs">
                                  {topic}
                                </span>
                              ))}
                              {report.topics.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs">
                                  +{report.topics.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xl font-bold text-gray-900">{report.score}%</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8 text-center min-h-[200px] flex items-center justify-center">
                    <p className="text-gray-500 font-medium">No video interview reports yet</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Resume Analysis Reports - styled like Performance components, max 3 shown */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden min-h-[320px] flex flex-col"
            >
              <div className="p-5 border-b border-gray-100 bg-violet-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Resume Analysis Reports</h3>
                  </div>
                  <button
                    className="text-violet-600 hover:text-violet-700 text-sm font-medium"
                    onClick={() => handleResumeViewAll()}
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1">
                {resumeAnalysisReports.length > 0 ? (
                  <div className="space-y-3">
                    {resumeAnalysisReports.slice(0, 3).map((report, idx) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.65 + idx * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleResumeReportClick(report)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 mb-1.5 text-sm truncate">{report.fileName}</h4>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-600 mb-3">
                              <span className="hidden sm:inline">{report.date}</span>
                              <span className="bg-violet-100 text-violet-800 px-2 py-0.5 rounded-lg">
                                {report.targetRole}
                              </span>
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg">
                                {report.company}
                              </span>
                            </div>
                            <div className="flex gap-4">
                              <div>
                                <span className="text-xs text-gray-500 block">Overall</span>
                                <span className="text-lg font-bold text-gray-900">{report.overallScore}%</span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 block">Job Match</span>
                                <span className="text-lg font-bold text-gray-900">{report.jobMatchScore}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8 text-center min-h-[200px] flex items-center justify-center">
                    <p className="text-gray-500 font-medium">No resume analysis reports yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Learning Progress Section - Hidden for trial */}
        {/* <div className="mb-6">
          <LearningProgressSection />
        </div> */}

      </div>
      
    </div>
    
  );
};

export default Dashboard;