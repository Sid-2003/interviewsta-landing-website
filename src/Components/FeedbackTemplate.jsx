import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PercentileChart from './Experimental/PercentilePlot';
import RadialGauge from './ResumeAnalysis/RadialGauge';
import { 
  FileText, 
  Users, 
  Code, 
  Target,
  ChevronDown,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  Star,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Brain,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  XCircle,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Zap,
  TrendingDown,
  HelpCircle,
  Calendar,
  Mic
} from 'lucide-react';
import axios from 'axios';
import { useVideoInterview } from '../Contexts/VideoInterviewContext';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  Area,
  AreaChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ComposedChart,
  Cell,
  ReferenceLine
} from 'recharts';
import { Editor } from '@monaco-editor/react';
import { motion } from 'framer-motion';


import api from "../service/api";
const FeedbackTemplate = ({ interview_id = null, interview_type = null }) => {
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [feedbackData,setFeedbackData] =  useState({});
  const {state,dispatch} = useVideoInterview();
  const navigate = useNavigate();
  // const dataPoints = [12,12,14,18,28,11,29,78,52,45];
  // const userScore = 28;
  const interviewTypes = [
    {
      id: 'General Interview',
      name: 'General Interview',
      icon: Target,
      color: 'from-blue-500 to-purple-600',
      description: 'Balanced assessment across all skills',
      categories: ['Communication', 'Technical Skills', 'Cultural Fit'],
      focusAreas: 12,
      sampleScore: 78
    },
    {
      id: 'HR Interview',
      name: 'HR Interview',
      icon: Users,
      color: 'from-green-500 to-teal-600',
      description: 'Focus on communication and cultural fit',
      categories: ['Communication', 'Cultural Fit'],
      focusAreas: 8,
      sampleScore: 85
    },
    {
      id: 'Technical Interview',
      name: 'Technical Interview',
      icon: Code,
      color: 'from-orange-500 to-red-600',
      description: 'Deep dive into technical skills',
      categories: ['Technical Skills', 'Problem Solving'],
      focusAreas: 10,
      sampleScore: 72
    },
    {
      id: 'Case Study Interview',
      name: 'Case Study Interview',
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      description: 'Analytical thinking and problem-solving assessment',
      categories: ['Analytical Skills', 'Business Impact'],
      focusAreas: 8,
      sampleScore: 75
    },
    {
      id: 'Communication Interview',
      name: 'Communication Interview',
      icon: Mic,
      color: 'from-orange-500 to-amber-600',
      description: 'Speaking, comprehension, and vocabulary assessment',
      categories: ['Speaking', 'Comprehension', 'Vocabulary'],
      focusAreas: 6,
      sampleScore: 80
    },
    {
      id: 'Debate Interview',
      name: 'Debate Interview',
      icon: MessageSquare,
      color: 'from-indigo-500 to-blue-600',
      description: 'Argumentation skills and structured thinking assessment',
      categories: ['Analytical Skills', 'Business Impact'],
      focusAreas: 8,
      sampleScore: 75
    },
    {
      id: 'Role-Based Interview',
      name: 'Role-Based Interview',
      icon: Code,
      color: 'from-indigo-500 to-purple-600',
      description: 'Role-specific technical and practical skills assessment',
      categories: ['Technical Skills', 'Problem Solving', 'Role Expertise'],
      focusAreas: 10,
      sampleScore: 75
    }
  ];
  const handleAllScores = (response) => {
    let all_scores = []
    for(let key of Object.keys(response.detailed_scores)){
      for(let factors of Object.keys(response.detailed_scores[key].breakdown)){
        all_scores = [...all_scores,{[factors]:response.detailed_scores[key].breakdown[factors]}]
      }
    }
    return all_scores;
  }
  useEffect(()=>{
    // console.log("***",state.session);
    const fetchFeedbackData = async () => {
        console.log("This is session id here->",state.redixsession);
        try {
                    let response = null;
          if(interview_id && interview_type){
            console.log("[INFO]********** This is the interview id and type ->",interview_id, interview_type);
            response = await api.get('get-session-history/', {
            params: {
              interview_id: interview_id,
              interview_type: interview_type
            }
          });
          } else {
          let session_type = state.session;
          // Normalize "Coding Interview" to "Technical Interview" for backend compatibility
          // The backend stores coding interviews under "Technical Interview" type
          if (session_type === 'Coding Interview') {
            session_type = 'Technical Interview';
          }
          // Keep the session type as-is for other types (HR Interview, Technical Interview, Case Study Interview, etc.)
          response = await api.get('get-session-history/', {
            params: {
              session_id: state.redixsession,
              session_type: session_type
            }
          });
          }
          
          console.log("This is the data fetched ->",response.data);
          
          // Safeguard: Ensure response.data exists and has required structure
          if (!response.data) {
            throw new Error('Invalid response: response.data is missing');
          }
          
          // Safely handle allScores calculation
          try {
          response.data.allScores = handleAllScores(response.data);
          } catch (e) {
            console.warn('Error calculating allScores:', e);
            response.data.allScores = [];
          }
          
          setFeedbackData(response.data);
          console.log("Speech Summary:", response.data.speech_summary);
          
          // Determine the interview type with safeguards
          let interviewType = response.data?.interview_test_details?.interview_mode;
          
          // Check if backend sent interview_type_display (for Communication Interview)
          if (response.data?.interview_type_display) {
            // For Communication Interview, backend sends interview_type_display
            // But we want to show "Communication Interview" in the UI
            if (state.session === 'Communication Interview') {
              interviewType = 'Communication Interview';
            } else {
              interviewType = response.data.interview_type_display;
            }
          }
          // Handle special cases
          else if(interviewType === 'Coding Interview') {
            interviewType = "Technical Interview";
          } 
          // If interview_mode is not a valid string (e.g., it's a number or undefined), use state.session as fallback
          else if (!interviewType || typeof interviewType !== 'string' || !['General Interview', 'HR Interview', 'Technical Interview', 'Case Study Interview', 'Communication Interview', 'Debate Interview', 'Role-Based Interview'].includes(interviewType)) {
            // Fallback to state.session which should have the correct type
            interviewType = state.session || 'General Interview';
            console.log("[INFO] Using state.session as fallback:", interviewType);
          }
          
          // Special handling: If state.session is Communication Interview or Debate Interview, always use that
          if (state.session === 'Communication Interview') {
            interviewType = 'Communication Interview';
          } else if (state.session === 'Debate Interview') {
            interviewType = 'Debate Interview';
          }
          
          setSelectedType(interviewType);
          console.log("This is the selected type -> ", interviewType);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.error("Error fetching feedback data:", err);
        //   setError("Failed to fetch feedback data. Please try again later.");
        //   setLoading(false);
        }
      };
    fetchFeedbackData();
    

},[])
  if(loading){
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="h-96 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedTypeData = interviewTypes.find(type => type.id === selectedType);

  const getTemplateData = (type) => {
    switch (type) {
      case 'General Interview':
        return {
          overallScore: 78,
          categories: [
            { name: 'Communication Skills', score: 85, feedback: 'Excellent verbal communication and clear articulation of ideas.' },
            { name: 'Technical Knowledge', score: 75, feedback: 'Good technical foundation with room for improvement in advanced concepts.' },
            { name: 'Cultural Fit', score: 80, feedback: 'Strong alignment with company values and team dynamics.' }
          ],
          strengths: feedbackData?.feedback_summary?.strengths || [],
          improvements: feedbackData?.feedback_summary?.areas_of_improvements || [],
          recommendations: [
            'Review advanced JavaScript concepts',
            'Practice system design problems',
            'Work on presentation skills'
          ]
        };
      case 'HR Interview':
        return {
          overallScore: Math.trunc(feedbackData?.overall_score || 0),
          categories: feedbackData?.skills_scores || [
            { name: 'Communication Skills', score: 90, feedback: 'Outstanding communication with clear, professional responses.' },
            { name: 'Cultural Fit', score: 80, feedback: 'Good alignment with company culture and values.' }
          ],
          strengths: feedbackData?.feedback_summary?.strengths ?? [],
          improvements: feedbackData?.feedback_summary?.areas_of_improvements ?? [],
          recommendations: [
            'Research company values more deeply',
            'Prepare more STAR method examples',
            'Practice leadership scenario questions'
          ]
        };

      case 'Technical Interview':
        return {
          overallScore: Math.trunc(feedbackData?.overall_score || 0),
          categories: feedbackData?.skills_scores || []
        //   [
        //     { name: 'Technical Skills', score: 70, feedback: 'Solid technical foundation with some gaps in advanced topics.' },
        //     { name: 'Problem Solving', score: 75, feedback: 'Good analytical thinking with room for optimization.' }
        //   ]
          ,
        //   strengths: ["efn","dvs dsk"],
        //   improvements: ["sjkndv","dsjdjsn"],
          strengths: feedbackData?.feedback_summary?.strengths ?? [],
          improvements: feedbackData?.feedback_summary?.areas_of_improvements ?? [],
          recommendations: [
            'Study advanced algorithms and data structures',
            'Practice coding challenges daily',
            'Learn system design patterns',
            'Review code optimization techniques'
          ]
        };
      case 'Role-Based Interview':
        // Role-Based Interview uses the same feedback structure as Technical Interview
        return {
          overallScore: Math.trunc(feedbackData?.overall_score || 0),
          categories: feedbackData?.skills_scores || [],
          strengths: feedbackData?.feedback_summary?.strengths ?? [],
          improvements: feedbackData?.feedback_summary?.areas_of_improvements ?? [],
          recommendations: [
            'Focus on role-specific technical skills',
            'Practice role-relevant coding challenges',
            'Deepen understanding of role-specific tools and frameworks',
            'Work on problem-solving approaches relevant to the role'
          ]
        };
      case 'Communication Interview':
      case 'Debate Interview':
        // Communication and Debate Interviews use the same feedback structure as Case Study (soft skills)
        const communicationAnalyticalScores = [
          { 
            name: 'Problem Understanding', 
            score: Math.trunc(feedbackData?.problem_understanding_score || 0),
            feedback: 'Ability to understand and break down complex problems'
          },
          { 
            name: 'Hypothesis Formation', 
            score: Math.trunc(feedbackData?.hypothesis_score || 0),
            feedback: 'Skill in forming logical hypotheses and assumptions'
          },
          { 
            name: 'Analysis', 
            score: Math.trunc(feedbackData?.analysis_score || 0),
            feedback: 'Depth and quality of analytical thinking'
          },
          { 
            name: 'Synthesis', 
            score: Math.trunc(feedbackData?.synthesis_score || 0),
            feedback: 'Ability to synthesize information and draw conclusions'
          }
        ];
        
        const communicationBusinessScores = [
          { 
            name: 'Business Impact', 
            score: Math.trunc(feedbackData?.business_impact_score || 0),
            feedback: 'Understanding of business implications and impact'
          },
          { 
            name: 'Recommendations', 
            score: Math.trunc(feedbackData?.recommendations_score || 0),
            feedback: 'Quality and feasibility of recommendations'
          }
        ];
        
        return {
          overallScore: Math.trunc(feedbackData?.overall_score || 0),
          categories: [...communicationAnalyticalScores, ...communicationBusinessScores],
          strengths: feedbackData?.feedback_summary?.strengths ?? [],
          improvements: feedbackData?.feedback_summary?.areas_of_improvements ?? [],
          recommendations: [
            'Practice speaking exercises regularly',
            'Work on reading comprehension skills',
            'Expand vocabulary through reading',
            'Focus on clear articulation and pronunciation'
          ]
        };
      case 'Case Study Interview':
        // Case Study has different score structure - analytical and business impact scores
        const analyticalScores = [
          { 
            name: 'Problem Understanding', 
            score: Math.trunc(feedbackData?.problem_understanding_score || 0),
            feedback: 'Ability to understand and break down complex problems'
          },
          { 
            name: 'Hypothesis Formation', 
            score: Math.trunc(feedbackData?.hypothesis_score || 0),
            feedback: 'Skill in forming logical hypotheses and assumptions'
          },
          { 
            name: 'Analysis', 
            score: Math.trunc(feedbackData?.analysis_score || 0),
            feedback: 'Depth and quality of analytical thinking'
          },
          { 
            name: 'Synthesis', 
            score: Math.trunc(feedbackData?.synthesis_score || 0),
            feedback: 'Ability to synthesize information and draw conclusions'
          }
        ];
        const businessImpactScores = [
          { 
            name: 'Business Judgment', 
            score: Math.trunc(feedbackData?.business_judgment_score || 0),
            feedback: 'Understanding of business implications and trade-offs'
          },
          { 
            name: 'Creativity', 
            score: Math.trunc(feedbackData?.creativity_score || 0),
            feedback: 'Innovative thinking and creative problem-solving'
          },
          { 
            name: 'Decision Making', 
            score: Math.trunc(feedbackData?.decision_making_score || 0),
            feedback: 'Quality and speed of decision-making'
          },
          { 
            name: 'Impact Orientation', 
            score: Math.trunc(feedbackData?.impact_orientation_score || 0),
            feedback: 'Focus on high-impact solutions and outcomes'
          }
        ];
        // Calculate overall score - use feedbackData.overall_score if available, otherwise calculate from individual scores
        const allScores = [...analyticalScores, ...businessImpactScores].map(s => s.score);
        const calculatedScore = allScores.length > 0 && allScores.some(s => s > 0)
          ? Math.trunc(allScores.reduce((a, b) => a + b, 0) / allScores.length)
          : 0;
        const overallScore = feedbackData?.overall_score !== undefined && feedbackData?.overall_score !== null
          ? Math.trunc(feedbackData.overall_score)
          : calculatedScore;
        
        return {
          overallScore: overallScore,
          categories: [...analyticalScores, ...businessImpactScores],
          // Case Study uses feedback_summary.strengths and feedback_summary.areas_of_improvements
          strengths: feedbackData?.feedback_summary?.strengths ?? feedbackData?.strengths ?? [],
          improvements: feedbackData?.feedback_summary?.areas_of_improvements ?? feedbackData?.areas_of_improvements ?? [],
          recommendations: [
            'Practice more case studies from different industries',
            'Focus on structured problem-solving frameworks',
            'Improve quantitative analysis skills',
            'Work on presenting recommendations clearly'
          ]
        };
      default:
        return null;
    }
  };

  // Safeguard: Ensure getTemplateData doesn't crash if selectedType is invalid
  const templateData = selectedType ? (() => {
    try {
      return getTemplateData(selectedType);
    } catch (e) {
      console.error('Error getting template data:', e);
      return null;
    }
  })() : null;

  // Enhanced template data with transcripts and detailed analysis
  // ... existing code ...
const getEnhancedTemplateData = (type) => {
  // Safeguard: Ensure feedbackData and interaction_log exist
  if (!feedbackData || !Array.isArray(feedbackData.interaction_log)) {
    return {
      transcript: [],
      detailedAnalysis: null,
      performanceMetrics: null
    };
  }
  
  let transcript_corrected = (feedbackData.interaction_log || []).map((value,index)=>{
      let transcript = {}
      if(!!value.question){
          transcript.speaker = 'Interviewer';
          transcript.text = value.question;
      }
      else{
          // Fix: Add optional chaining before array access and handle the split safely
          const statusLog = feedbackData?.interaction_status_log?.[parseInt(index/2)];
          const answerStatus = statusLog?.answer_status ?? "";
          // Safely split answerStatus - handle undefined/null/empty strings
          const scoreValue = (answerStatus && typeof answerStatus === 'string') 
            ? answerStatus.split(" ")[0] || "" 
            : "";
          console.log("Rhiisdn", scoreValue);
          transcript.speaker = 'Candidate';
          transcript.text = value.answer || "";
          transcript.score = scoreValue;
          transcript.feedback = statusLog?.comment ?? "";
      }
      transcript.id = index;
      transcript.timestamp = value.timestamp;
      return transcript;
  })
// ... existing code ...
        // console.log("This is transcsdvndls",transcript_corrected);
    switch (type) {
      case 'General Interview':
        return {
          transcript: [
            {
              id: 1,
              speaker: 'Interviewer',
              text: "Tell me about yourself and your background in software development.",
              timestamp: '00:30'
            },
            {
              id: 2,
              speaker: 'Candidate',
              text: "I'm a full-stack developer with 5 years of experience. I've worked primarily with React and Node.js, building scalable web applications. In my current role at TechCorp, I lead a team of 3 developers and we've successfully delivered 12 major projects.",
              timestamp: '00:45',
              score: 'correct',
              feedback: 'Excellent response! Clear structure, specific experience mentioned, and quantified achievements.'
            },
            {
              id: 3,
              speaker: 'Interviewer',
              text: "What's your biggest weakness?",
              timestamp: '02:15'
            },
            {
              id: 4,
              speaker: 'Candidate',
              text: "I'm a perfectionist and sometimes spend too much time on details.",
              timestamp: '02:20',
              score: 'partial',
              feedback: 'Generic answer. Better to mention a real weakness and how you\'re actively working to improve it.'
            },
            {
              id: 5,
              speaker: 'Interviewer',
              text: "Describe a challenging project you worked on.",
              timestamp: '04:30'
            },
            {
              id: 6,
              speaker: 'Candidate',
              text: "Well, there was this project... it was difficult.",
              timestamp: '04:45',
              score: 'incorrect',
              feedback: 'Too vague. Use the STAR method: Situation, Task, Action, Result. Provide specific details and quantifiable outcomes.'
            }
          ],
          detailedAnalysis: {
            communicationSkills: {
              score: 85,
              breakdown: {
                clarity: 90,
                confidence: 85,
                structure: 80,
                engagement: 85
              },
              insights: [
                'Strong opening responses with clear structure',
                'Good use of specific examples and metrics',
                'Confident delivery throughout most of the interview',
                'Some responses lacked depth in storytelling'
              ]
            },
            technicalKnowledge: {
              score: 75,
              breakdown: {
                fundamentals: 80,
                frameworks: 85,
                problemSolving: 70,
                bestPractices: 65
              },
              insights: [
                'Solid understanding of React and Node.js',
                'Good grasp of modern development practices',
                'Could improve system design knowledge',
                'Need to demonstrate more complex problem-solving'
              ]
            },
            culturalFit: {
              score: 80,
              breakdown: {
                teamwork: 85,
                leadership: 80,
                adaptability: 75,
                values: 80
              },
              insights: [
                'Shows strong leadership potential',
                'Good examples of team collaboration',
                'Demonstrates company value alignment',
                'Could show more adaptability examples'
              ]
            }
          },
          performanceMetrics: {
            responseTime: { average: 12, ideal: 15, score: 85 },
            wordCount: { average: 45, ideal: 50, score: 90 },
            fillerWords: { count: 8, ideal: 5, score: 70 },
            eyeContact: { percentage: 78, ideal: 80, score: 75 }
          }
        };
        case 'HR Interview':
          // Use actual data from backend instead of hardcoded values
          return {
            transcript: transcript_corrected.length > 0 ? transcript_corrected : [
              {
                id: 1,
                speaker: 'Interviewer',
                text: "Why do you want to work for our company?",
                timestamp: '00:15'
              },
              {
                id: 2,
                speaker: 'Candidate',
                text: "I've researched your company extensively and I'm impressed by your commitment to innovation.",
                timestamp: '00:30',
                score: 'correct',
                feedback: 'Outstanding! Shows research and connects personal goals with company direction.'
              }
            ],
            // Use actual detailed_scores from backend
            detailedAnalysis: feedbackData?.detailed_scores || {
              communicationSkills: {
                score: 85,
                breakdown: {
                  articulation: 90,
                  listening: 85,
                  empathy: 88,
                  persuasion: 87
                }
              },
              culturalFit: {
                score: 80,
                breakdown: {
                  values: 85,
                  teamwork: 80,
                  growth: 75,
                  initiative: 80
                }
              }
            },
            // Use actual performance metrics from backend
            performanceMetrics: {
              enthusiasm: { score: feedbackData?.overall_score || 0, benchmark: 80 },
              preparation: { score: feedbackData?.overall_score || 0, benchmark: 75 },
              professionalism: { score: feedbackData?.overall_score || 0, benchmark: 85 },
              communication: { score: feedbackData?.detailed_scores?.['Communication Skills']?.score || 0, benchmark: 80 }
            }
          };

      case 'Case Study Interview':
      case 'Debate Interview':
        // Use actual transcript from interaction_log
        return {
          transcript: transcript_corrected.length > 0 ? transcript_corrected : [],
          // Case Study and Debate don't have detailedAnalysis or performanceMetrics like Technical/HR
          detailedAnalysis: null,
          performanceMetrics: null
          };

      case 'Technical Interview':
        return {
          transcript: transcript_corrected
        //   [
        //     {
        //       id: 1,
        //       speaker: 'Interviewer',
        //       text: "Can you explain the difference between let, const, and var in JavaScript?",
        //       timestamp: '00:20'
        //     },
        //     {
        //       id: 2,
        //       speaker: 'Candidate',
        //       text: "Sure! var has function scope and is hoisted, let has block scope and is also hoisted but in a temporal dead zone, and const is like let but for constants that can't be reassigned. However, objects and arrays declared with const can still be mutated.",
        //       timestamp: '00:35',
        //       score: 'correct',
        //       feedback: 'Excellent technical explanation! Covers all key differences including hoisting, scope, and mutability nuances.'
        //     },
        //     {
        //       id: 3,
        //       speaker: 'Interviewer',
        //       text: "How would you optimize a React component that re-renders frequently?",
        //       timestamp: '03:15'
        //     },
        //     {
        //       id: 4,
        //       speaker: 'Candidate',
        //       text: "I would use React.memo to prevent unnecessary re-renders.",
        //       timestamp: '03:25',
        //       score: 'partial',
        //       feedback: 'Good start but incomplete. Also mention useMemo, useCallback, proper state structure, and component splitting strategies.'
        //     },
        //     {
        //       id: 5,
        //       speaker: 'Interviewer',
        //       text: "Write a function to reverse a string.",
        //       timestamp: '05:40'
        //     },
        //     {
        //       id: 6,
        //       speaker: 'Candidate',
        //       text: "function reverse(str) { return str.reverse(); }",
        //       timestamp: '05:50',
        //       score: 'incorrect',
        //       feedback: 'Incorrect! Strings don\'t have a reverse() method. Use str.split(\'\').reverse().join(\'\') or a for loop.'
        //     }
        //   ]
          ,
          detailedAnalysis: feedbackData?.detailed_scores || {}
        //   {
        //     technicalSkills: {
        //       score: 70,
        //       breakdown: {
        //         javascript: 75,
        //         react: 70,
        //         algorithms: 60,
        //         systemDesign: 65
        //       },
        //       insights: [
        //         'Strong JavaScript fundamentals',
        //         'Good React knowledge but needs depth',
        //         'Algorithm skills need improvement',
        //         'Basic system design understanding'
        //       ]
        //     },
        //     problemSolving: {
        //       score: 75,
        //       breakdown: {
        //         approach: 80,
        //         optimization: 70,
        //         debugging: 75,
        //         testing: 70
        //       },
        //       insights: [
        //         'Good problem-solving methodology',
        //         'Needs to consider edge cases more',
        //         'Decent debugging approach',
        //         'Should mention testing strategies'
        //       ]
        //     }
        //   }
          ,
          performanceMetrics: {
            codingSpeed: { wpm: 45, ideal: 40, score: 85 },
            accuracy: { percentage: 72, ideal: 80, score: 70 },
            explanation: { clarity: 75, ideal: 80, score: 75 },
            optimization: { score: 65, benchmark: 70 }
          }
        };
      default:
        return null;
    }
  };

  const enhancedData = selectedType ? getEnhancedTemplateData(selectedType) : null;

  const getScoreColor = (score) => {
    switch (score) {
      case 'correct answer': return 'text-green-600 bg-green-50 border-green-200';
      case 'cross-question answer': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'incorrect': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreIcon = (score) => {
    switch (score) {
      case 'correct answer': return <CheckCircle className="h-4 w-4" />;
      case 'cross-question answer': return <AlertCircle className="h-4 w-4" />;
      case 'incorrect': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  // Helper function to generate performance trend data (sparkline)
  const generatePerformanceTrend = () => {
    if (enhancedData?.transcript) {
      const responses = enhancedData.transcript.filter(entry => entry.score);
      const trend = [];
      responses.forEach((entry, index) => {
        const score = entry.score === 'correct' ? 85 : entry.score === 'partial' ? 60 : 40;
        trend.push({ index, score, timestamp: entry.timestamp });
      });
      return trend.length > 0 ? trend : [{ index: 0, score: templateData?.overallScore || 70, timestamp: '00:00' }];
    }
    return [
      { index: 0, score: (templateData?.overallScore || 70) - 10, timestamp: '00:00' },
      { index: 1, score: (templateData?.overallScore || 70) - 5, timestamp: '05:00' },
      { index: 2, score: templateData?.overallScore || 70, timestamp: '10:00' },
      { index: 3, score: (templateData?.overallScore || 70) + 5, timestamp: '15:00' },
      { index: 4, score: templateData?.overallScore || 70, timestamp: '20:00' }
    ];
  };

  // Helper function to calculate timeline data from transcript
  const generateTimelineData = () => {
    if (!enhancedData?.transcript) return [];
    const responses = enhancedData.transcript.filter(entry => entry.score && entry.timestamp);
    return responses.map((entry, index) => {
      const score = entry.score === 'correct' ? 85 : entry.score === 'partial' ? 60 : 40;
      // Safely parse timestamp - handle undefined/null/empty strings
      let timeInMinutes = 0;
      if (entry.timestamp && typeof entry.timestamp === 'string') {
        try {
          const parts = entry.timestamp.split(':');
          if (parts.length >= 2) {
            const minutes = Number(parts[0]) || 0;
            const seconds = Number(parts[1]) || 0;
            timeInMinutes = minutes + (seconds / 60);
          }
        } catch (e) {
          console.warn('Error parsing timestamp:', entry.timestamp, e);
        }
      }
      return {
        time: timeInMinutes,
        score,
        quality: score,
        response: (entry.text && typeof entry.text === 'string') ? entry.text.substring(0, 50) + '...' : '',
        feedback: entry.feedback || '',
        status: entry.score || ''
      };
    });
  };

  // Calculate average percentile from sub_scores
  const calculateAveragePercentile = () => {
    if (!feedbackData?.sub_scores) return 0;
    const percentiles = Object.values(feedbackData.sub_scores)
      .map(item => item.percentile || 0)
      .filter(p => p > 0);
    return percentiles.length > 0 
      ? Math.round(percentiles.reduce((a, b) => a + b, 0) / percentiles.length)
      : 0;
  };

  // Rule Engine: Deterministic coaching feedback based on rulebook psychology
  // All coaching is detailed (2-3 sentences) with psychological and practical guidance
  const getRuleFeedback = (metric, value) => {
    const numValue = Number(value) || 0;
    
    switch (metric.toLowerCase()) {
      case 'eye contact':
      case 'gaze':
        if (numValue >= 80) {
          return {
            meaning: 'Excellent eye contact demonstrates confidence and engagement.',
            suggestion: 'You have developed a strong habit of maintaining eye contact, which creates a powerful psychological connection with your interviewer. Continue reinforcing this behavior as it signals attentiveness and professionalism. This consistent gaze pattern builds trust and shows you are fully present in the conversation.'
          };
        } else if (numValue >= 60) {
          return {
            meaning: 'Moderate eye contact shows room for improvement in gaze stability.',
            suggestion: 'Work on maintaining a steady gaze throughout your full answer, not just at the beginning. Practice looking directly at the camera lens for 3-5 seconds at a time before briefly glancing away. This creates the perception of confidence and helps the interviewer feel more connected to your responses.'
          };
        } else {
          return {
            meaning: 'Very low eye contact can negatively impact how confident you appear.',
            suggestion: 'Place a sticky note with a smiley face or a small dot directly on your webcam as an anchor point to remind you to look at the camera. This simple visual cue helps train your brain to maintain eye contact. Remember that consistent eye contact significantly improves how interviewers perceive your confidence and engagement level.'
          };
        }
      
      case 'confidence':
        if (numValue >= 80) {
          return {
            meaning: 'High confidence level demonstrates strong self-assurance.',
            suggestion: 'You are projecting calm authority through your tone and presence. Maintain this confident demeanor by continuing to speak at a measured pace and using deliberate pauses. This psychological state of confidence not only makes you feel more capable but also signals to interviewers that you are a reliable and competent candidate.'
          };
        } else if (numValue >= 60) {
          return {
            meaning: 'Moderate confidence can be enhanced with strategic communication techniques.',
            suggestion: 'Incorporate strategic pauses between your thoughts to give yourself time to formulate responses and appear more composed. These pauses create space for reflection and demonstrate that you are thinking carefully about your answers. Practice taking a breath before responding to complex questions, which helps regulate your nervous system and projects confidence.'
          };
        } else {
          return {
            meaning: 'Low confidence can be improved through physical and vocal adjustments.',
            suggestion: 'Slow down your speaking pace significantly - rushing through answers signals anxiety. Focus on relaxing your shoulders and maintaining an open posture, which physically signals confidence to both yourself and the interviewer. Practice deep breathing exercises before the interview to activate your parasympathetic nervous system, which naturally reduces stress and allows your confident self to emerge.'
          };
        }
      
      case 'nervousness':
        if (numValue >= 80) {
          return {
            meaning: 'Calm demeanor shows excellent emotional regulation.',
            suggestion: 'You are maintaining a composed and professional presence throughout the interview. Continue reinforcing this calm behavior by staying aware of your body language and breathing patterns. This psychological state of composure not only helps you think more clearly but also projects professionalism and reliability to your interviewer.'
          };
        } else if (numValue >= 60) {
          return {
            meaning: 'Mild nervousness can be managed with grounding techniques.',
            suggestion: 'Practice hand grounding techniques by placing your hands flat on your desk or resting them in a stable position. This physical anchor helps reduce fidgeting and creates a sense of stability. When you feel nervous energy building, take a moment to press your feet firmly into the floor and feel the connection to the ground, which helps regulate your nervous system.'
          };
        } else {
          return {
            meaning: 'High nervousness requires active relaxation techniques.',
            suggestion: 'Implement deep breathing exercises: inhale for 4 counts, hold for 4, and exhale for 6 counts. This activates your parasympathetic nervous system and reduces the fight-or-flight response. Practice progressive muscle relaxation by tensing and releasing muscle groups, starting from your toes and working up to your shoulders. This physical technique helps release stored tension and creates a calmer psychological state.'
          };
        }
      
      case 'engagement':
        if (numValue >= 80) {
          return {
            meaning: 'High engagement demonstrates strong active listening and presence.',
            suggestion: 'You are showing excellent attentiveness through your body language and responses. Continue maintaining this level of engagement by staying fully present in each moment of the conversation. This psychological state of active engagement not only helps you understand questions better but also signals to interviewers that you are genuinely interested and invested in the opportunity.'
          };
        } else if (numValue >= 60) {
          return {
            meaning: 'Moderate engagement can be enhanced with expressive communication.',
            suggestion: 'Increase your facial expressiveness by allowing your natural reactions to show - smile when appropriate, raise your eyebrows to show interest, and nod to acknowledge understanding. These micro-expressions create a more dynamic and engaging presence. Practice mirroring the interviewer\'s energy level slightly, which builds rapport and demonstrates that you are actively participating in the conversation.'
          };
        } else {
          return {
            meaning: 'Low engagement can be improved through physical presence techniques.',
            suggestion: 'Lean slightly forward in your chair to show active interest and engagement. This physical positioning signals that you are fully present and listening. Practice nodding naturally when the interviewer speaks, which demonstrates understanding and creates a positive feedback loop. Make a conscious effort to maintain eye contact and avoid looking away, as this shows you are fully invested in the conversation.'
          };
        }
      
      case 'distraction':
        if (numValue >= 80) {
          return {
            meaning: 'Focused attention demonstrates strong mental discipline.',
            suggestion: 'You are maintaining excellent focus and discipline throughout the interview. Continue reinforcing this behavior by staying committed to being fully present. This psychological state of focused attention not only helps you perform better but also signals to interviewers that you have the mental discipline required for the role.'
          };
        } else if (numValue >= 60) {
          return {
            meaning: 'Slight distraction can be minimized with stability techniques.',
            suggestion: 'Stabilize your gaze by finding a fixed point on your screen to return to when you feel your attention drifting. Keep your hands in a stable, comfortable position to reduce fidgeting and create a sense of groundedness. Practice mindfulness techniques before the interview to train your brain to return to the present moment when distractions arise.'
          };
        } else {
          return {
            meaning: 'High distraction requires environmental and mental control.',
            suggestion: 'Remove all potential distractions from your environment - turn off phone notifications, close unnecessary browser tabs, and ensure your interview space is clean and organized. Create a dedicated interview zone that signals to your brain that it\'s time to focus. Practice the "5-4-3-2-1" grounding technique: identify 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste, which helps bring your attention back to the present moment.'
          };
        }
      
      case 'grammar':
        if (numValue >= 85) {
          return {
            meaning: 'Strong grammar demonstrates excellent language proficiency and attention to detail.',
            suggestion: 'You are maintaining proper sentence structure and grammatical accuracy throughout your responses. Continue reinforcing this by speaking in complete, well-formed sentences. This level of grammatical precision not only makes your communication clearer but also signals professionalism and attention to detail, which are highly valued in professional settings.'
          };
        } else if (numValue >= 70) {
          return {
            meaning: 'Minor grammar issues can be improved with deliberate speaking pace.',
            suggestion: 'Slow down your speaking pace to give yourself time to form complete sentences before speaking. This allows your brain to process grammar rules more effectively and reduces errors. Practice pausing briefly before responding to questions, which gives you time to structure your thoughts grammatically. Focus on using full sentences rather than fragments, which naturally improves grammatical accuracy.'
          };
        } else {
          return {
            meaning: 'Weak grammar can significantly impact how professional you appear.',
            suggestion: 'Focus on speaking in complete, full sentences with proper subject-verb agreement. Practice grammar exercises specifically designed for spoken English, such as recording yourself and reviewing for grammatical errors. Consider working with a language coach or using grammar practice apps to strengthen your foundation. Remember that clear, grammatically correct speech is essential for professional communication and demonstrates your attention to detail.'
          };
        }
      
      case 'fluency':
        if (numValue >= 85) {
          return {
            meaning: 'High fluency shows smooth and natural speech flow.',
            suggestion: 'You are maintaining an excellent rhythm and flow in your speech. Continue reinforcing this by speaking at a natural, comfortable pace. This level of fluency not only makes your communication more engaging but also demonstrates confidence and ease with the language, which creates a positive impression on interviewers.'
          };
        } else if (numValue >= 70) {
          return {
            meaning: 'Moderate fluency can be enhanced with smoother transitions.',
            suggestion: 'Work on creating smoother transitions between your ideas by using connecting phrases like "furthermore," "additionally," or "building on that point." Practice linking your thoughts more naturally by thinking about how each sentence flows into the next. This creates a more cohesive narrative and improves the overall fluency of your speech. Record yourself speaking and listen for awkward pauses or abrupt transitions, then practice smoothing them out.'
          };
        } else {
          return {
            meaning: 'Low fluency can make communication feel choppy and less professional.',
            suggestion: 'Engage in timed mock interview drills where you practice speaking continuously for 2-3 minutes on various topics. This builds your ability to maintain flow under pressure. Practice reading aloud daily to improve your natural speech rhythm and pacing. Focus on reducing long pauses and "um" sounds by planning your thoughts before speaking. Consider working with a speech coach to develop techniques for maintaining fluency even when you need to think on your feet.'
          };
        }
      
      case 'fillers':
        // For fillers, backend sends frequency (higher = more fillers = worse)
        // Rule thresholds are for control score (higher = better control = fewer fillers)
        // Convert frequency to control score: control = 100 - frequency
        const fillersControlScore = 100 - numValue;
        
        if (fillersControlScore >= 85) {
          return {
            meaning: 'Clean speech with minimal filler words demonstrates strong communication control.',
            suggestion: 'You are maintaining excellent flow without relying on filler words. Continue reinforcing this by staying aware of your speech patterns. This level of verbal control not only makes your communication more professional but also demonstrates confidence and preparation. Practice maintaining this clean speech pattern in all your professional interactions.'
          };
        } else if (fillersControlScore >= 70) {
          return {
            meaning: 'Occasional fillers can be reduced with strategic pausing techniques.',
            suggestion: 'Replace filler words like "um," "uh," and "like" with intentional pauses. These pauses actually make you appear more thoughtful and composed. Practice the technique of taking a breath when you need a moment to think, rather than filling the silence with words. This creates a more professional speaking pattern and gives you time to formulate your next thought clearly.'
          };
        } else {
          return {
            meaning: 'Frequent fillers can undermine your professional presence and clarity.',
            suggestion: 'Consciously replace filler words with strategic pauses - when you feel a filler word coming, stop and take a breath instead. Practice recording yourself speaking and identify your most common filler words, then create mental triggers to pause instead. Work with a speech coach or use filler word tracking apps to build awareness. Remember that well-placed pauses actually make you sound more confident and thoughtful than filler words do.'
          };
        }
      
      case 'clarity':
        if (numValue >= 85) {
          return {
            meaning: 'High clarity demonstrates excellent communication precision and structure.',
            suggestion: 'You are maintaining excellent clarity in your responses with well-structured communication. Continue reinforcing this by organizing your thoughts before speaking. This level of clarity not only ensures your message is understood but also demonstrates your ability to think systematically and communicate complex ideas effectively, which is highly valued in professional settings.'
          };
        } else if (numValue >= 70) {
          return {
            meaning: 'Decent clarity can be enhanced with better structure and organization.',
            suggestion: 'Maintain clear structure in your responses by organizing your thoughts into logical sequences. Practice outlining your answer mentally before speaking - identify your main point, supporting details, and conclusion. This mental organization helps you communicate more clearly and ensures your message is easily understood. Focus on one idea at a time rather than jumping between multiple points.'
          };
        } else {
          return {
            meaning: 'Low clarity can make it difficult for interviewers to understand your points.',
            suggestion: 'Use the STAR structure (Situation, Task, Action, Result) to organize your responses, which provides a clear framework for communicating complex ideas. Practice breaking down your answers into distinct sections: context, your role, specific actions, and outcomes. This structure helps both you and the interviewer follow your narrative. Before speaking, take a moment to identify your main point and ensure every sentence supports that central message.'
          };
        }
      
      default:
        return {
          meaning: 'This metric requires assessment to provide specific coaching guidance.',
          suggestion: 'Practice and review your performance to identify areas for improvement. Consider working with a coach or mentor to develop specific strategies tailored to your communication style and goals.'
        };
    }
  };

  // Extract KPI metrics
  const getKPIMetrics = () => {
    const performanceMetrics = enhancedData?.performanceMetrics || {};
    return {
      accuracy: performanceMetrics.accuracy?.percentage || templateData?.overallScore || 0,
      speed: performanceMetrics.codingSpeed?.score || 75,
      confidence: performanceMetrics.explanation?.clarity || 75
    };
  };

  // Prepare radar chart data from categories
  const prepareRadarData = () => {
    if (!templateData?.categories || templateData.categories.length === 0) return [];
    const categoryMap = {
      'Technical Skills': 'Technical Skill',
      'Technical Skill': 'Technical Skill',
      'Problem Solving': 'Problem Solving',
      'Communication': 'Communication',
      'Optimization': 'Optimization',
      'Debugging': 'Debugging'
    };
    const radarCategories = ['Technical Skill', 'Problem Solving', 'Communication', 'Optimization', 'Debugging'];
    return radarCategories.map(cat => {
      const found = templateData.categories.find(c => 
        categoryMap[c.name] === cat || c.name === cat
      );
      return {
        category: cat,
        score: found?.score || 0,
        fullName: found?.name || cat
      };
    });
  };

  // Semi-circular Gauge Component for Percentile Display
  const SemiCircularGauge = ({ percentile, label, rank, total, confidenceBand = 'medium' }) => {
    const [animatedPercentile, setAnimatedPercentile] = useState(0);
    const size = 200;
    const radius = 70;
    const circumference = Math.PI * radius;
    const maxPercentile = 100;

    useEffect(() => {
      const duration = 1500;
      const steps = 60;
      const stepValue = percentile / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= percentile) {
          setAnimatedPercentile(percentile);
          clearInterval(timer);
        } else {
          setAnimatedPercentile(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [percentile]);

    const offset = circumference - (animatedPercentile / maxPercentile) * circumference;
    const angle = (animatedPercentile / maxPercentile) * 180 - 90;

    const getConfidenceColor = () => {
      if (confidenceBand === 'high') return '#10b981';
      if (confidenceBand === 'medium') return '#3b82f6';
      return '#f59e0b';
    };

    return (
      <div className="relative flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
          <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`} className="overflow-visible">
            {/* Background arc */}
            <path
              d={`M ${size / 2 - radius} ${size / 2} A ${radius} ${radius} 0 0 1 ${size / 2 + radius} ${size / 2}`}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <motion.path
              d={`M ${size / 2 - radius} ${size / 2} A ${radius} ${radius} 0 0 1 ${size / 2 + radius} ${size / 2}`}
              fill="none"
              stroke={getConfidenceColor()}
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animatedPercentile / maxPercentile }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            {/* Needle */}
            <motion.line
              x1={size / 2}
              y1={size / 2}
              x2={size / 2 + radius * Math.cos((angle * Math.PI) / 180)}
              y2={size / 2 + radius * Math.sin((angle * Math.PI) / 180)}
              stroke="#6b7280"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
            {/* Needle center dot */}
            <circle cx={size / 2} cy={size / 2} r="6" fill="#6b7280" />
          </svg>
          {/* Percentile value */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-3xl font-bold text-gray-900">{Math.round(animatedPercentile)}</div>
            <div className="text-sm text-gray-500">percentile</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <h4 className="font-semibold text-gray-900">{label}</h4>
          <p className="text-sm text-gray-600">Rank {rank} of {total}</p>
        </div>
      </div>
    );
  };

  // Generate bell curve data for distribution chart
  const generateDistributionData = (dataPoints = [], userScore = 0) => {
    if (!dataPoints || dataPoints.length === 0) return { curve: [], mean: 0, stdDev: 0, userScore };
    
    const sorted = [...dataPoints].sort((a, b) => a - b);
    const min = Math.min(...sorted);
    const max = Math.max(...sorted);
    const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
    const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sorted.length;
    const stdDev = Math.sqrt(variance);
    
    // Generate points for bell curve
    const points = [];
    const range = max - min;
    const step = range / 50;
    
    for (let x = min - range * 0.2; x <= max + range * 0.2; x += step) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) * 100;
      points.push({ score: x, density: y });
    }
    
    return { curve: points, mean, stdDev, userScore };
  };

  // Map strength categories
  const getStrengthCategory = (strength) => {
    const lower = strength.toLowerCase();
    if (lower.includes('logic') || lower.includes('algorithm') || lower.includes('reasoning')) return 'Logic';
    if (lower.includes('clear') || lower.includes('explain') || lower.includes('communication')) return 'Clarity';
    if (lower.includes('efficient') || lower.includes('optimiz') || lower.includes('performance')) return 'Efficiency';
    if (lower.includes('debug') || lower.includes('troubleshoot') || lower.includes('problem')) return 'Problem Solving';
    return 'Technical';
  };

  const renderPerformanceChart = (data, title) => {
    const maxValue = Math.max(...Object.values(data).map((item) => item.score || item));
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span>{title}</span>
        </h4>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <div className="flex items-center space-x-3 flex-1 ml-4">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((value.score || value) / maxValue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {value.score || value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  

  // Metric Card Component matching teacher portal style
  const MetricCard = ({ label, value, icon: Icon, bgColor }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} rounded-3xl p-6 border border-white/20 relative overflow-hidden group shadow-lg`}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-white/20 rounded-full" />
      
      <div className="flex items-center justify-between mb-4 relative">
        <p className="text-sm font-bold text-white/90 uppercase tracking-wide">{label}</p>
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <p className="text-5xl font-bold text-white relative">{value}</p>
    </motion.div>
  );

  // Format date from feedbackData
  const formatDate = () => {
    if (feedbackData?.created_at) {
      const date = new Date(feedbackData.created_at);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header - All in one div */}
              {selectedTypeData && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 sm:px-6 lg:px-8 pt-8 pb-6"
        >
          {/* Go Back Button */}
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </motion.button>

          {/* Title, Date, and Tag */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${selectedTypeData.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <selectedTypeData.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{selectedTypeData.name}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{formatDate()}</span>
                  </div>
                  <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    Video Interview
                  </span>
                </div>
            </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content - Full Screen */}
      {templateData && (selectedType === 'Technical Interview' || selectedType === 'Case Study Interview' || selectedType === 'HR Interview' || selectedType === 'Communication Interview' || selectedType === 'Debate Interview') ? (
        // REDESIGNED DASHBOARD - Teacher Portal Design Language
        <div className="space-y-8 px-4 sm:px-6 lg:px-8 pb-8">
                {/* ROW 1: Metric Cards - Matching Teacher Portal Style */}
                  <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  <MetricCard
                          label="Overall Score"
                    value={`${templateData.overallScore}%`}
                    icon={Target}
                    bgColor="bg-gradient-to-br from-orange-600 via-orange-700 to-pink-600"
                  />
                  <MetricCard
                    label="Rank Percentile"
                    value={`${calculateAveragePercentile()}th`}
                    icon={TrendingUp}
                    bgColor="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600"
                  />
                  {(() => {
                    const kpis = getKPIMetrics();
                    return (
                      <>
                        <MetricCard
                          label="Accuracy"
                          value={`${kpis.accuracy}%`}
                          icon={Award}
                          bgColor="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600"
                        />
                        <MetricCard
                          label="Confidence"
                          value={`${kpis.confidence}%`}
                          icon={Star}
                          bgColor="bg-gradient-to-br from-green-600 via-green-700 to-emerald-600"
                        />
                      </>
                    );
                  })()}
                </motion.div>

                {/* ROW 2: Percentile Rankings - Beautiful Card Design */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative"
                >
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                  
                  <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 rounded-[2.5rem] shadow-2xl border-2 border-purple-200/50 p-10 relative overflow-hidden backdrop-blur-sm">
                    {/* Animated gradient orbs */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-orange-400/30 to-red-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    
                    {/* Glass morphism header */}
                    <div className="relative mb-10">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50" />
                          <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <TrendingUp className="text-white" size={28} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                            Percentile Rankings
                          </h3>
                          <p className="text-gray-600 text-base mt-1 font-medium">Your performance compared to peers worldwide</p>
                          </div>
                        </div>
                        </div>

                    {/* Alternate Design: Card-based with Progress Bars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                      {Object.keys(feedbackData?.sub_scores ?? {}).slice(0, 2).map((key, index) => {
                        const subScore = feedbackData.sub_scores[key];
                        const percentile = subScore?.percentile ?? 0;
                        const rank = subScore?.rank ?? index + 1;
                        const total = subScore?.total_participants ?? 100;
                        const getPercentileColor = (p) => {
                          if (p >= 75) return 'from-green-500 to-emerald-500';
                          if (p >= 50) return 'from-yellow-500 to-amber-500';
                          return 'from-red-500 to-rose-500';
                        };
                        const getPercentileBg = (p) => {
                          if (p >= 75) return 'from-green-50 to-emerald-50';
                          if (p >= 50) return 'from-yellow-50 to-amber-50';
                          return 'from-red-50 to-rose-50';
                        };
                        const getPercentileBorder = (p) => {
                          if (p >= 75) return 'border-green-200/50';
                          if (p >= 50) return 'border-yellow-200/50';
                          return 'border-red-200/50';
                        };
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="group relative"
                          >
                            {/* Glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${getPercentileColor(percentile)} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                            
                            {/* Card */}
                            <div className={`relative bg-gradient-to-br ${getPercentileBg(percentile)} backdrop-blur-md rounded-3xl p-8 border-2 ${getPercentileBorder(percentile)} shadow-xl transform group-hover:scale-[1.02] transition-all duration-300`}>
                              {/* Header */}
                              <div className="flex items-center justify-between mb-6">
                        <div>
                                  <h4 className="text-2xl font-bold text-gray-900 mb-1">{key}</h4>
                                  <p className="text-sm text-gray-600">Rank {rank} of {total}</p>
                                </div>
                                <div className={`text-5xl font-extrabold bg-gradient-to-br ${getPercentileColor(percentile)} bg-clip-text text-transparent`}>
                                  {Math.round(percentile)}
                                </div>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-gray-700">Percentile</span>
                                  <span className={`text-lg font-bold bg-gradient-to-br ${getPercentileColor(percentile)} bg-clip-text text-transparent`}>
                                    {Math.round(percentile)}th
                                  </span>
                          </div>
                                <div className="relative h-4 bg-white/60 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                                    animate={{ width: `${percentile}%` }}
                                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                                    className={`h-full bg-gradient-to-r ${getPercentileColor(percentile)} rounded-full shadow-lg`}
                                  />
                        </div>
                      </div>

                              {/* Stats */}
                              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/50">
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Your Rank</p>
                                  <p className="text-xl font-bold text-gray-900">#{rank}</p>
                              </div>
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Total Participants</p>
                                  <p className="text-xl font-bold text-gray-900">{total}</p>
                            </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      </div>
                    </div>
                  </motion.div>

                {/* ROW 3: AI Performance Summary - Stunning Design */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[2.5rem] blur-3xl -z-10 animate-pulse" />
                  
                  <div className="bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/30 rounded-[2.5rem] shadow-2xl border-2 border-indigo-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                    {/* Floating particles effect */}
                    <div className="absolute top-10 right-10 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-20 right-32 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-10 left-10 w-2.5 h-2.5 bg-indigo-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }} />
                    
                    {/* Header with glass effect */}
                    <div className="relative mb-10">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                          <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                            <Brain className="text-white" size={28} />
                              </div>
                            </div>
                        <div>
                          <h3 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            AI Performance Summary
                    </h3>
                          <p className="text-gray-700 text-base mt-1 font-semibold">Comprehensive AI-driven assessment metrics</p>
                      </div>
                    </div>
                    </div>
                    
                    {/* Gauges with enhanced card design */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
                      {/* Interview Confidence */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/40 to-indigo-400/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 border-2 border-purple-200/50 shadow-xl transform group-hover:scale-105 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center">
                        <RadialGauge 
                          score={getKPIMetrics().confidence} 
                          label="Interview Confidence"
                          subLabel="AI Assessment"
                          color="#8b5cf6"
                              size={160}
                        />
                      </div>
                        </div>
                      </motion.div>

                      {/* Hiring Readiness */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="group relative"
                      >
                        {(() => {
                          const readiness = Math.min(templateData.overallScore + 10, 95);
                          return (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-br from-green-400/40 to-emerald-400/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 border-2 border-green-200/50 shadow-xl transform group-hover:scale-105 transition-all duration-300">
                                <div className="flex flex-col items-center justify-center">
                            <RadialGauge 
                              score={readiness} 
                              label="Hiring Readiness"
                              subLabel="Company Fit Score"
                              color="#10b981"
                                    size={160}
                            />
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>

                      {/* Company Readiness */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="group relative"
                      >
                        {(() => {
                          const companyReadiness = Math.min(templateData.overallScore + 5, 90);
                          return (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/40 to-amber-400/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 border-2 border-orange-200/50 shadow-xl transform group-hover:scale-105 transition-all duration-300">
                                <div className="flex flex-col items-center justify-center">
                            <RadialGauge 
                              score={companyReadiness} 
                              label="Company Readiness"
                              subLabel="Estimated Match"
                              color="#f59e0b"
                                    size={160}
                            />
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>
                      </div>
                    </div>
                  </motion.div>

                {/* ROW 4: Response Analysis - Beautiful Design */}
                {enhancedData?.transcript && enhancedData.transcript.filter(entry => entry.score).length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="relative"
                  >
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                    
                    <div className="bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/30 rounded-[2.5rem] shadow-2xl border-2 border-blue-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                      {/* Animated background circles */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-300/20 to-blue-300/20 rounded-full blur-3xl" />
                      
                      {/* Header */}
                      <div className="relative mb-8">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                              <BarChart3 className="text-white" size={28} />
                          </div>
                    </div>
                          <div>
                            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                              Response Analysis
                            </h3>
                            <p className="text-gray-700 text-base mt-1 font-semibold">Breakdown of your interview responses</p>
                          </div>
                        </div>
                </div>

                      {/* Response cards with beautiful design */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        {(() => {
                          const responses = enhancedData.transcript.filter(entry => entry.score);
                          const correct = responses.filter(r => r.score === 'correct answer').length;
                          const partial = responses.filter(r => r.score === 'cross-question answer').length;
                          const incorrect = responses.filter(r => r.score === 'incorrect').length;
                          const total = responses.length;
                          
                          const responseTypes = [
                            {
                              label: 'Excellent',
                              count: correct,
                              percentage: total > 0 ? Math.round((correct/total)*100) : 0,
                              icon: CheckCircle,
                              gradient: 'from-green-500 to-emerald-500',
                              bgGradient: 'from-green-50 to-emerald-50',
                              borderColor: 'border-green-300/50',
                              textColor: 'text-green-700',
                              iconBg: 'bg-green-500'
                            },
                            {
                              label: 'Cross Question',
                              count: partial,
                              percentage: total > 0 ? Math.round((partial/total)*100) : 0,
                              icon: AlertCircle,
                              gradient: 'from-yellow-500 to-amber-500',
                              bgGradient: 'from-yellow-50 to-amber-50',
                              borderColor: 'border-yellow-300/50',
                              textColor: 'text-yellow-700',
                              iconBg: 'bg-yellow-500'
                            },
                            {
                              label: 'Incorrect',
                              count: incorrect,
                              percentage: total > 0 ? Math.round((incorrect/total)*100) : 0,
                              icon: XCircle,
                              gradient: 'from-red-500 to-rose-500',
                              bgGradient: 'from-red-50 to-rose-50',
                              borderColor: 'border-red-300/50',
                              textColor: 'text-red-700',
                              iconBg: 'bg-red-500'
                            }
                          ];
                          
                          return responseTypes.map((type, index) => {
                            const Icon = type.icon;
                          return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="group relative"
                              >
                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                                
                                {/* Card */}
                                <div className={`relative bg-gradient-to-br ${type.bgGradient} backdrop-blur-md rounded-3xl p-6 border-2 ${type.borderColor} shadow-xl transform group-hover:scale-105 transition-all duration-300`}>
                                  <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${type.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                                      <Icon className="text-white" size={24} />
                                </div>
                                    <div className="text-right">
                                      <div className={`text-3xl font-extrabold ${type.textColor}`}>{type.count}</div>
                                      <div className={`text-sm font-semibold ${type.textColor} opacity-80`}>responses</div>
                              </div>
                                </div>
                                  <div className="mb-3">
                                    <div className={`text-lg font-bold ${type.textColor} mb-1`}>{type.label}</div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${type.percentage}%` }}
                                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                          className={`h-full bg-gradient-to-r ${type.gradient} rounded-full`}
                                        />
                              </div>
                                      <span className={`text-sm font-bold ${type.textColor}`}>{type.percentage}%</span>
                                </div>
                              </div>
                                </div>
                              </motion.div>
                          );
                          });
                        })()}
                      </div>
                      </div>
                    </motion.div>
                  )}

                {/* ROW 5: Category Breakdown - Full Width with Pentagon and Scores Side by Side */}
                {selectedType === 'Technical Interview' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative"
                  >
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                    
                    <div className="bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30 rounded-[2.5rem] shadow-2xl border-2 border-orange-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                      {/* Animated background */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300/20 to-amber-300/20 rounded-full blur-3xl" />
                      
                      {/* Header */}
                      <div className="relative mb-8">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                              <BarChart3 className="text-white" size={28} />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                              Category Breakdown
                            </h3>
                            <p className="text-gray-700 text-base mt-1 font-semibold">Performance across different skill categories</p>
                        </div>
                    </div>
                </div>

                    {(() => {
                      const radarData = prepareRadarData();
                      const CustomTooltip = ({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                              <p className="font-semibold text-gray-900">{payload[0].payload.fullName || payload[0].payload.category}</p>
                              <p className="text-sm text-gray-600">Score: {payload[0].value}%</p>
                            </div>
                          );
                        }
                        return null;
                      };
                      return radarData.length > 0 ? (
                          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left: Radar Chart (Pentagon) */}
                            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border-2 border-orange-200/30 flex items-center justify-center">
                              <ResponsiveContainer width="100%" height={400}>
                          <RadarChart data={radarData}>
                                  <PolarGrid stroke="#fbbf24" strokeDasharray="3 3" strokeOpacity={0.3} />
                            <PolarAngleAxis 
                              dataKey="category" 
                                    tick={{ fontSize: 13, fill: '#92400e', fontWeight: 600 }}
                            />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                              name="Score"
                              dataKey="score"
                                    stroke="#f97316"
                                    fill="#f97316"
                                    fillOpacity={0.7}
                                    strokeWidth={3}
                                  />
                                  <RechartsTooltip 
                                    content={<CustomTooltip />}
                                    contentStyle={{
                                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                      border: '2px solid #f97316',
                                      borderRadius: '12px',
                                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                    }}
                                  />
                          </RadarChart>
                        </ResponsiveContainer>
                            </div>
                            
                            {/* Right: Score Percentages */}
                            <div className="space-y-4">
                              {radarData.map((item, index) => {
                                const getColor = (score) => {
                                  if (score >= 80) return { bg: 'from-green-500 to-emerald-500', text: 'text-green-700', border: 'border-green-200' };
                                  if (score >= 60) return { bg: 'from-yellow-500 to-amber-500', text: 'text-yellow-700', border: 'border-yellow-200' };
                                  return { bg: 'from-red-500 to-rose-500', text: 'text-red-700', border: 'border-red-200' };
                                };
                                const colors = getColor(item.score);
                                
                                return (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="group relative"
                                  >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                                    <div className={`relative bg-white/90 backdrop-blur-md rounded-2xl p-6 border-2 ${colors.border}/50 shadow-lg transform group-hover:scale-105 transition-all duration-300`}>
                                      <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-lg font-bold text-gray-900">{item.fullName || item.category}</h5>
                                        <div className={`text-3xl font-extrabold ${colors.text}`}>
                                          {item.score}%
                                        </div>
                                      </div>
                                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${item.score}%` }}
                                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                          className={`h-full bg-gradient-to-r ${colors.bg} rounded-full`}
                                        />
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-500 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-orange-200/30">
                            <div className="text-lg font-semibold">No category data available</div>
                          </div>
                      );
                    })()}
                    </div>
                  </motion.div>
                )}

                {/* ROW 6: Behavioral Analysis - Full Width */}
                  {(() => {
                    try {
                      const softSkillData = localStorage.getItem("soft_skill_summary");
                      
                      // Default to mid-range values (65-75) if data is missing - ALWAYS show coaching
                      const defaultSummary = {
                        gaze: 70,
                        confidence: 70,
                        nervousness: 30, // Inverted: 30 means 70% calm
                        engagement: 70,
                        distraction: 30, // Inverted: 30 means 70% focused
                        duration: 0
                      };
                      
                      const summary = softSkillData ? JSON.parse(softSkillData) : defaultSummary;
                      
                      const getVerdict = (value, inverse = false) => {
                        // For inverse metrics (nervousness, distraction), invert the value
                        const displayValue = inverse ? 100 - value : value;
                        
                        if (displayValue >= 90) {
                          return { label: 'Excellent', color: 'green', bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-200', fill: '#22C55E' };
                        } else if (displayValue >= 70) {
                          return { label: 'Good', color: 'yellow', bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-200', fill: '#F59E0B' };
                        } else {
                          return { label: 'Needs Improvement', color: 'red', bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', fill: '#EF4444' };
                        }
                      };

                      const metrics = [
                        { key: 'gaze', label: 'Eye Contact', inverse: false },
                        { key: 'confidence', label: 'Confidence', inverse: false },
                        { key: 'nervousness', label: 'Nervousness', inverse: true },
                        { key: 'engagement', label: 'Engagement', inverse: false },
                        { key: 'distraction', label: 'Distraction', inverse: true },
                      ];

                      // Prepare data for vertical bar chart
                      const chartData = [];
                      
                      metrics.forEach((metric) => {
                        const value = summary[metric.key] ?? (metric.inverse ? 30 : 70);
                        const displayValue = metric.inverse ? 100 - value : value;
                        const verdict = getVerdict(value, metric.inverse);
                        
                        chartData.push({
                          name: metric.label,
                          value: Math.round(displayValue),
                          fill: verdict.fill
                        });
                      });

                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.35 }}
                          className="relative"
                        >
                          {/* Glowing background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-fuchsia-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                          
                          <div className="bg-gradient-to-br from-white via-pink-50/40 to-rose-50/30 rounded-[2.5rem] shadow-2xl border-2 border-pink-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                            {/* Animated background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-fuchsia-300/20 to-pink-300/20 rounded-full blur-3xl" />
                            
                            {/* Header */}
                            <div className="relative mb-8">
                              <div className="flex items-center gap-4 mb-3">
                                <div className="relative group">
                                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                                  <div className="relative w-14 h-14 bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                    <Brain className="text-white" size={28} />
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    Behavioral Analysis
                          </h3>
                                  <p className="text-gray-700 text-base mt-1 font-semibold">AI-powered behavioral and soft skill assessment</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Compact Card-based Design Instead of Large Graph */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10 mb-6">
                              {chartData.map((metric, index) => {
                                const getVerdictLabel = (val) => {
                                  if (val >= 90) return 'Excellent';
                                  if (val >= 70) return 'Good';
                                  return 'Needs Work';
                                };
                                
                              return (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="group relative"
                                  >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" style={{ backgroundColor: metric.fill }} />
                                    
                                    {/* Card */}
                                    <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 border-2 border-pink-200/30 shadow-lg transform group-hover:scale-105 transition-all duration-300">
                                      {/* Icon and Value */}
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: metric.fill + '20' }}>
                                          <Brain className="text-pink-600" size={20} />
                                    </div>
                                        <div className="text-right">
                                          <div className="text-3xl font-extrabold" style={{ color: metric.fill }}>
                                            {metric.value}
                                          </div>
                                          <div className="text-xs font-semibold text-gray-500">%</div>
                                        </div>
                                      </div>
                                      
                                      {/* Label */}
                                      <div className="mb-3">
                                        <h5 className="text-sm font-bold text-gray-900 mb-1">{metric.name}</h5>
                                        <p className="text-xs text-gray-600">{getVerdictLabel(metric.value)}</p>
                                      </div>
                                      
                                      {/* Compact Progress Bar */}
                                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${metric.value}%` }}
                                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                          className="h-full rounded-full"
                                          style={{ backgroundColor: metric.fill }}
                                        />
                          </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                            
                            {/* Footer with enhanced styling */}
                            <div className="relative z-10 bg-gradient-to-r from-pink-100/50 to-rose-100/50 backdrop-blur-sm rounded-2xl p-4 border-2 border-pink-200/30">
                              <p className="text-sm font-semibold text-gray-700 text-center">
                                Analysis based on <span className="text-pink-600 font-bold">{summary.duration ? Math.round(summary.duration / 1000) : 0}</span> seconds of video telemetry data
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    } catch (e) {
                      console.error('Error loading soft skill summary:', e);
                      // Even on error, show default coaching
                      const defaultSummary = {
                        gaze: 70,
                        confidence: 70,
                        nervousness: 30,
                        engagement: 70,
                        distraction: 30,
                        duration: 0
                      };
                      
                      const metrics = [
                        { key: 'gaze', label: 'Eye Contact', inverse: false },
                        { key: 'confidence', label: 'Confidence', inverse: false },
                        { key: 'nervousness', label: 'Nervousness', inverse: true },
                        { key: 'engagement', label: 'Engagement', inverse: false },
                        { key: 'distraction', label: 'Distraction', inverse: true },
                      ];
                      
                      // Prepare data for vertical bar chart
                      const chartData = [];
                      
                      metrics.forEach((metric) => {
                        const value = defaultSummary[metric.key];
                        const displayValue = metric.inverse ? 100 - value : value;
                        const verdict = displayValue >= 90 ? 
                          { fill: '#22C55E' } : displayValue >= 70 ? 
                          { fill: '#F59E0B' } : 
                          { fill: '#EF4444' };
                        
                        chartData.push({
                          name: metric.label,
                          value: Math.round(displayValue),
                          fill: verdict.fill
                        });
                      });
                      
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.35 }}
                          className="relative"
                        >
                          {/* Glowing background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-fuchsia-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                          
                          <div className="bg-gradient-to-br from-white via-pink-50/40 to-rose-50/30 rounded-[2.5rem] shadow-2xl border-2 border-pink-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                            {/* Animated background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-3xl" />
                            
                            {/* Header */}
                            <div className="relative mb-8">
                              <div className="flex items-center gap-4 mb-3">
                                <div className="relative group">
                                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                                  <div className="relative w-14 h-14 bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                    <Brain className="text-white" size={28} />
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    Behavioral Analysis
                          </h3>
                                  <p className="text-gray-700 text-base mt-1 font-semibold">AI-powered behavioral and soft skill assessment</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Compact Card-based Design */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10 mb-6">
                              {chartData.map((metric, index) => {
                                const getVerdictLabel = (val) => {
                                  if (val >= 90) return 'Excellent';
                                  if (val >= 70) return 'Good';
                                  return 'Needs Work';
                                };
                                
                              return (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="group relative"
                                  >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" style={{ backgroundColor: metric.fill }} />
                                    
                                    {/* Card */}
                                    <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 border-2 border-pink-200/30 shadow-lg transform group-hover:scale-105 transition-all duration-300">
                                      {/* Icon and Value */}
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: metric.fill + '20' }}>
                                          <Brain className="text-pink-600" size={20} />
                                      </div>
                                        <div className="text-right">
                                          <div className="text-3xl font-extrabold" style={{ color: metric.fill }}>
                                            {metric.value}
                                          </div>
                                          <div className="text-xs font-semibold text-gray-500">%</div>
                                        </div>
                                      </div>
                                      
                                      {/* Label */}
                                      <div className="mb-3">
                                        <h5 className="text-sm font-bold text-gray-900 mb-1">{metric.name}</h5>
                                        <p className="text-xs text-gray-600">{getVerdictLabel(metric.value)}</p>
                                      </div>
                                      
                                      {/* Compact Progress Bar */}
                                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${metric.value}%` }}
                                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                          className="h-full rounded-full"
                                          style={{ backgroundColor: metric.fill }}
                                        />
                                    </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                            
                            {/* Footer */}
                            <div className="relative z-10 bg-gradient-to-r from-pink-100/50 to-rose-100/50 backdrop-blur-sm rounded-2xl p-4 border-2 border-pink-200/30">
                              <p className="text-sm font-semibold text-gray-700 text-center">
                                Analysis based on <span className="text-pink-600 font-bold">{defaultSummary.duration ? Math.round(defaultSummary.duration / 1000) : 0}</span> seconds of video telemetry data
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  })()}

                {/* ROW 7: Single full-width card - Big-5 personality radar left + trait bars right */}
                  {(() => {
                    try {
                      const big5Data = localStorage.getItem("big5_features");
                      if (!big5Data) return null;
                      
                      const features = JSON.parse(big5Data);
                      
                      // Map behavioral features to Big-5 traits (0-100 scale)
                      const openness = Math.round(
                        (features.engagement * 0.5) + 
                        (features.confidence * 0.3) + 
                        ((100 - features.distraction) * 0.2)
                      );
                      
                      const conscientiousness = Math.round(
                        (features.confidence * 0.4) + 
                        (features.headStability * 0.4) + 
                        ((100 - features.distraction) * 0.2)
                      );
                      
                      const extraversion = Math.round(
                        (features.engagement * 0.4) + 
                        (features.gaze * 0.3) + 
                        (features.confidence * 0.3)
                      );
                      
                      const agreeableness = Math.round(
                        (features.gaze * 0.4) + 
                        (features.engagement * 0.3) + 
                        ((100 - features.nervousness) * 0.3)
                      );
                      
                      const neuroticism = Math.round(
                        (features.nervousness * 0.5) + 
                        ((100 - features.headStability) * 0.3) + 
                        (features.distraction * 0.2)
                      );
                      
                      const radarData = [
                        { trait: 'Creativity', value: Math.max(0, Math.min(100, openness)), fullName: 'Creativity (Openness)' },
                        { trait: 'Work Ethic', value: Math.max(0, Math.min(100, conscientiousness)), fullName: 'Work Ethic (Conscientiousness)' },
                        { trait: 'Confidence & Sociability', value: Math.max(0, Math.min(100, extraversion)), fullName: 'Confidence & Sociability (Extraversion)' },
                        { trait: 'Team Friendliness', value: Math.max(0, Math.min(100, agreeableness)), fullName: 'Team Friendliness (Agreeableness)' },
                        { trait: 'Stress Stability', value: Math.max(0, Math.min(100, neuroticism)), fullName: 'Stress Stability (Neuroticism)' },
                      ];
                      
                      const traitExplanations = {
                        'Creativity': 'Reflects creativity, curiosity, and willingness to explore new ideas. High scores indicate adaptability and intellectual curiosity.',
                        'Work Ethic': 'Shows organization, self-discipline, and reliability. High scores suggest methodical thinking and strong work ethic.',
                        'Confidence & Sociability': 'Indicates sociability, assertiveness, and energy. High scores show outgoing behavior and comfort in social settings.',
                        'Team Friendliness': 'Reflects trust, cooperation, and empathy. High scores indicate collaborative and harmonious interpersonal style.',
                        'Stress Stability': 'Measures emotional stability and stress response. Lower scores indicate calmness and resilience under pressure.',
                      };
                      
                      const CustomRadarTooltip = ({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                              <p className="font-semibold text-gray-900">{data.fullName}</p>
                              <p className="text-sm text-gray-600">Score: {data.value}%</p>
                            </div>
                          );
                        }
                        return null;
                      };
                      
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="relative"
                        >
                          {/* Glowing background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                          
                          <div className="bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/30 rounded-[2.5rem] shadow-2xl border-2 border-indigo-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                            {/* Animated background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl" />
                            
                            {/* Header */}
                            <div className="relative mb-8">
                              <div className="flex items-center gap-4 mb-3">
                                <div className="relative group">
                                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                                  <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                    <Brain className="text-white" size={28} />
                                  </div>
                                </div>
                          <div>
                                  <h3 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Personality Profile (Big-5 Traits)
                                  </h3>
                                  <p className="text-gray-700 text-base mt-1 font-semibold">Psychological assessment based on interview behavior</p>
                                </div>
                              </div>
                          </div>
                          
                            {/* Radar Chart (Pentagon) + Trait Descriptions - Better Layout */}
                            <div className="relative z-10">
                              {/* Top: Radar Chart (Pentagon) - Centered and Compact */}
                              <div className="mb-8">
                                <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-6 border-2 border-indigo-200/30 shadow-xl max-w-2xl mx-auto">
                            <ResponsiveContainer width="100%" height={350}>
                                    <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                                      <PolarGrid 
                                        stroke="#a78bfa" 
                                        strokeDasharray="3 3" 
                                        strokeOpacity={0.3}
                                      />
                                <PolarAngleAxis 
                                  dataKey="trait" 
                                        tick={{ fontSize: 11, fill: '#4f46e5', fontWeight: 600 }}
                                      />
                                      <PolarRadiusAxis 
                                        angle={90} 
                                        domain={[0, 100]} 
                                        tick={false} 
                                        axisLine={false} 
                                      />
                                <Radar
                                  name="Big-5 Score"
                                  dataKey="value"
                                        stroke="#6366f1"
                                        fill="#6366f1"
                                        fillOpacity={0.7}
                                        strokeWidth={3}
                                      />
                                      <RechartsTooltip 
                                        content={<CustomRadarTooltip />}
                                        contentStyle={{
                                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                          border: '2px solid #6366f1',
                                          borderRadius: '12px',
                                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                        }}
                                      />
                              </RadarChart>
                            </ResponsiveContainer>
                                </div>
                          </div>
                          
                              {/* Bottom: Trait Cards in Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {radarData.map((trait, index) => {
                                  const getTraitColor = (val) => {
                                    if (val >= 70) return { 
                                      bg: 'bg-green-500', 
                                      text: 'text-green-700',
                                      border: 'border-green-300',
                                      cardBg: 'from-green-50 to-emerald-50'
                                    };
                                    if (val >= 40) return { 
                                      bg: 'bg-yellow-500', 
                                      text: 'text-yellow-700',
                                      border: 'border-yellow-300',
                                      cardBg: 'from-yellow-50 to-amber-50'
                                    };
                                    return { 
                                      bg: 'bg-red-500', 
                                      text: 'text-red-700',
                                      border: 'border-red-300',
                                      cardBg: 'from-red-50 to-rose-50'
                                    };
                                  };
                                  
                                  const colors = getTraitColor(trait.value);
                                  
                                  return (
                                    <motion.div
                                      key={trait.trait}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.5 + index * 0.1 }}
                                      className="group relative"
                                    >
                                      {/* Glow effect */}
                                      <div className={`absolute inset-0 ${colors.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                                      
                                      {/* Card */}
                                      <div className={`relative bg-gradient-to-br ${colors.cardBg} backdrop-blur-sm rounded-2xl p-5 border-2 ${colors.border}/50 shadow-lg transform group-hover:scale-105 transition-all duration-300`}>
                                        {/* Score Badge */}
                                        <div className="flex justify-center mb-3">
                                          <div className={`${colors.bg} text-white text-3xl font-extrabold w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}>
                                            {trait.value}
                                </div>
                                        </div>
                                        
                                        {/* Trait Name */}
                                        <h5 className="text-sm font-bold text-gray-900 mb-3 text-center leading-tight">
                                          {trait.trait}
                                        </h5>
                                        
                                        {/* Progress Bar */}
                                        <div className="w-full bg-white/60 rounded-full h-2 mb-3 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${trait.value}%` }}
                                            transition={{ duration: 1, ease: "easeOut", delay: 0.6 + index * 0.1 }}
                                            className={`h-full rounded-full ${colors.bg}`}
                                  />
                                </div>
                                        
                                        {/* Description - Compact */}
                                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                          {traitExplanations[trait.trait]}
                                        </p>
                              </div>
                                    </motion.div>
                                  );
                                })}
                              </div>
                          </div>
                          </div>
                        </motion.div>
                      );
                    } catch (e) {
                      console.error('Error loading Big-5 features:', e);
                      return null;
                    }
                  })()}

                {/* ROW 6: Single full-width card - 5 horizontal donut gauges for speech quality */}
                  {(() => {
                    // Default to mid-range values (65-75) if missing - ALWAYS show coaching
                    const defaultSummary = {
                      grammar: 70,
                      clarity: 70,
                      fillers: 30, // Inverted: 30 means 70% control
                    fluency: 70,
                    confidence: 70 // Add confidence as 5th metric
                    };

                    // Read from backend payload: feedbackData.speech_summary, use defaults if missing
                    const speechSummary = feedbackData?.speech_summary || defaultSummary;

                    // Color logic: >=85 → green, 70-84 → yellow, <70 → red
                    const getMetricColor = (value) => {
                      if (value >= 85) return '#22C55E'; // green
                      if (value >= 70) return '#F59E0B'; // yellow/orange
                      return '#EF4444'; // red
                    };

                    // Map backend fields to display metrics - 5: Grammar, Fluency, Fillers, Clarity, Confidence
                    // Use defaults if values are missing or 0
                    const metrics = [
                      { 
                        key: 'grammar', 
                        label: 'Grammar',
                        value: speechSummary.grammar ?? defaultSummary.grammar
                      },
                      { 
                        key: 'fluency', 
                        label: 'Fluency',
                        value: speechSummary.fluency ?? defaultSummary.fluency
                      },
                      { 
                        key: 'fillers', 
                        label: 'Fillers',
                        value: speechSummary.fillers ?? defaultSummary.fillers,
                        inverse: true // Lower fillers = higher control score
                      },
                      { 
                        key: 'clarity', 
                        label: 'Clarity',
                        value: speechSummary.clarity ?? defaultSummary.clarity
                      },
                      { 
                        key: 'confidence', 
                        label: 'Confidence',
                        value: speechSummary.confidence ?? defaultSummary.confidence
                      }
                    ];

                    // Prepare donut chart data and collect all coaching feedback
                    const donutData = [];
                    const coachingStatements = [];
                    
                    metrics.forEach((metric) => {
                            // For fillers, invert the value (lower fillers = higher control score)
                            const displayValue = metric.inverse 
                              ? Math.max(0, 100 - (metric.value || 0))
                              : (metric.value || 0);
                      const color = getMetricColor(displayValue);
                            
                            // Get rule-based feedback - ALWAYS returns meaning and suggestion
                            // For fillers, the rule engine handles the conversion internally
                            // For all metrics, use displayValue which represents the "goodness" score
                            const feedback = getRuleFeedback(metric.key, metric.inverse ? metric.value : displayValue);
                      
                      donutData.push({
                        label: metric.label,
                        value: Math.round(displayValue),
                        color: color
                      });
                      
                      coachingStatements.push({
                        metric: metric.label,
                        meaning: feedback.meaning,
                        suggestion: feedback.suggestion
                      });
                    });
                            
                            return (
                                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.45 }}
                                className="relative"
                              >
                                {/* Glowing background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-blue-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                                
                                <div className="bg-gradient-to-br from-white via-cyan-50/40 to-teal-50/30 rounded-[2.5rem] shadow-2xl border-2 border-cyan-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                                  {/* Animated background */}
                                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-teal-300/20 rounded-full blur-3xl" />
                                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl" />
                                  
                                  {/* Header */}
                                  <div className="relative mb-8">
                                    <div className="flex items-center gap-4 mb-3">
                                      <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                                        <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                          <Volume2 className="text-white" size={28} />
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                                          Speech & Communication Quality
                        </h3>
                                        <p className="text-gray-700 text-base mt-1 font-semibold">AI-powered analysis of your speech patterns and clarity</p>
                                      </div>
                                    </div>
                                  </div>
                        
                                  {/* Compact Card-based Design for Metrics */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10 mb-8">
                            {donutData.map((item, index) => (
                                      <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        className="group relative"
                                      >
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" style={{ backgroundColor: item.color }} />
                                        
                                        {/* Card */}
                                        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 border-2 border-cyan-200/30 shadow-lg transform group-hover:scale-105 transition-all duration-300">
                                          {/* Compact Gauge */}
                                          <div className="flex flex-col items-center justify-center mb-4">
                                <RadialGauge 
                                  score={item.value} 
                                  label={item.label}
                                              subLabel=""
                                  color={item.color}
                                              size={120}
                                />
                              </div>
                                        </div>
                                      </motion.div>
                            ))}
                                </div>
                                
                                  {/* Coaching Feedback - Beautiful Design */}
                                  <div className="relative z-10 bg-gradient-to-br from-cyan-50/50 to-teal-50/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-cyan-200/30">
                                    <div className="flex items-center gap-3 mb-6">
                                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                                        <Lightbulb className="text-white" size={20} />
                                      </div>
                                      <h4 className="text-2xl font-bold text-gray-900">Coaching Feedback</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {coachingStatements.map((coaching, index) => (
                                        <motion.div
                                          key={index}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.6 + index * 0.1 }}
                                          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-cyan-100/50 shadow-lg"
                                        >
                                          <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full" />
                                            <span className="text-base font-bold text-gray-900">{coaching.metric}</span>
                                </div>
                                          <div className="space-y-3">
                                            <div>
                                              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wide">Meaning:</span>
                                              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{coaching.meaning}</p>
                                  </div>
                                            <div>
                                              <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">Coaching:</span>
                                              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{coaching.suggestion}</p>
                                  </div>
                                </div>
                                        </motion.div>
                            ))}
                                    </div>
                              </div>
                        </div>
                      </motion.div>
                    );
                  })()}

                  {/* 4. INTERVIEW TIMELINE INTELLIGENCE */}
                  {/* {enhancedData?.transcript && generateTimelineData().length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <span>Interview Timeline Intelligence</span>
                      </h3>
                      {(() => {
                        const timelineData = generateTimelineData();
                        const CustomTimelineTooltip = ({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
                                <p className="font-semibold text-gray-900 mb-2">{data.time.toFixed(1)} min</p>
                                <p className="text-sm text-gray-600 mb-2">Score: {data.score}%</p>
                                <p className="text-xs text-gray-500 mb-2">{data.response}</p>
                                {data.feedback && (
                                  <p className="text-xs text-blue-600 italic">{data.feedback}</p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        };
                        return (
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={timelineData}>
                              <defs>
                                <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="time" 
                                label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5 }}
                                stroke="#6b7280"
                              />
                              <YAxis 
                                label={{ value: 'Score Quality', angle: -90, position: 'insideLeft' }}
                                domain={[0, 100]}
                                stroke="#6b7280"
                              />
                              <RechartsTooltip content={<CustomTimelineTooltip />} />
                              <Area 
                                type="monotone" 
                                dataKey="quality" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                fill="url(#timelineGradient)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        );
                      })()}
                    </motion.div>
                  )} */}

                {/* ROW 7: Transcript - Beautiful Design */}
                  {enhancedData?.transcript && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="relative"
                  >
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                    
                    <div className="bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 rounded-[2.5rem] shadow-2xl border-2 border-blue-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                      {/* Animated background */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl" />
                      
                      {/* Header */}
                      <div className="relative mb-8">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                              <MessageSquare className="text-white" size={28} />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              Interview Transcript
                      </h3>
                            <p className="text-gray-700 text-base mt-1 font-semibold">Complete conversation log with AI feedback</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Transcript Content - Beautiful Scrollable Area */}
                      <div className="relative z-10 bg-white/60 backdrop-blur-md rounded-3xl p-6 border-2 border-blue-200/30 shadow-xl">
                        <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
                          {enhancedData.transcript.map((entry, index) => (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.05 }}
                              className={`relative pl-6 ${
                                entry.speaker === 'Interviewer' 
                                  ? 'border-l-4 border-purple-400' 
                                  : 'border-l-4 border-blue-400'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                                    entry.speaker === 'Interviewer'
                                      ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                                      : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                  }`}>
                                    {entry.speaker === 'Interviewer' ? (
                                      <Users className="text-white" size={18} />
                                    ) : (
                                      <MessageSquare className="text-white" size={18} />
                                    )}
                                  </div>
                                  <div>
                                    <span className={`text-sm font-bold ${
                                      entry.speaker === 'Interviewer' ? 'text-purple-700' : 'text-blue-700'
                                }`}>
                                  {entry.speaker}
                                </span>
                                    <span className="text-xs text-gray-500 ml-2">{entry.timestamp}</span>
                                  </div>
                              </div>
                              {entry.score && (
                                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 shadow-sm ${getScoreColor(entry.score)}`}>
                                  {getScoreIcon(entry.score)}
                                  <span className="capitalize">{entry.score}</span>
                                </div>
                              )}
                            </div>
                              
                              {/* Message Content */}
                              <div className={`ml-14 rounded-2xl p-4 shadow-md ${
                                entry.speaker === 'Interviewer'
                                  ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200/50'
                                  : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200/50'
                              }`}>
                            {entry.speaker === "Interviewer" ? (
                                  <p className="text-gray-800 leading-relaxed">{entry.text}</p>
                              ) : (
                                (() => {
                                    const textToSplit = (entry.text && typeof entry.text === 'string') ? entry.text : '';
                                    const parts = textToSplit.split("[CODE INPUT]");
                                    const spokenPart = parts[0]?.trim() || '';
                                    const codePart = parts[1]?.trim() || '';

                                  return (
                                      <div className="space-y-4">
                                      {spokenPart && (
                                          <p className="text-gray-800 leading-relaxed">{spokenPart}</p>
                                      )}

                                      {codePart && (
                                          <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                                          <Editor
                                            height="200px"
                                            defaultLanguage="python"
                                            theme="vs-light"
                                            value={codePart}
                                            options={{
                                              minimap: { enabled: false },
                                              readOnly: true,
                                              fontSize: 14,
                                              scrollBeyondLastLine: false,
                                              automaticLayout: true,
                                              wordWrap: "on",
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()
                              )}

                            {entry.feedback && (
                                  <div className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200/50">
                                    <div className="flex items-start gap-2">
                                      <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-xs font-bold text-amber-800 mb-1">AI Feedback</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{entry.feedback}</p>
                                      </div>
                                    </div>
                              </div>
                            )}
                          </div>
                            </motion.div>
                        ))}
                        </div>
                      </div>
                      </div>
                  </motion.div>
                  )}

                {/* ROW 8: Single full-width card - Dual vertical bar skill breakdown charts - Only for Technical Interview */}
                {selectedType === 'Technical Interview' && enhancedData?.detailedAnalysis && Object.keys(enhancedData.detailedAnalysis).length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="relative"
                  >
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                    
                    <div className="bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/30 rounded-[2.5rem] shadow-2xl border-2 border-indigo-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                      {/* Animated background */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl" />
                      
                      {/* Header */}
                      <div className="relative mb-8">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                              <BarChart3 className="text-white" size={28} />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                              Detailed Performance Analysis
                    </h3>
                            <p className="text-gray-700 text-base mt-1 font-semibold">Comprehensive breakdown of your skills</p>
                          </div>
                        </div>
                      </div>
                    
                    {/* Two-column comparison grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                      {/* LEFT COLUMN: Technical Skills */}
                      {(() => {
                        const technicalData = enhancedData.detailedAnalysis.technicalSkills || enhancedData.detailedAnalysis[Object.keys(enhancedData.detailedAnalysis)[0]];
                        if (!technicalData?.breakdown) return null;
                        
                        const breakdownEntries = Object.entries(technicalData.breakdown);
                        const chartData = breakdownEntries.map(([skill, score]) => ({
                          skill: skill.replace(/([A-Z])/g, ' $1').trim(),
                          current: score,
                          target: 80,
                          average: 65,
                          percentile: Math.min(score + 10, 95)
                        }));
                        
                        // Calculate consistent height based on max entries
                        const maxEntries = Math.max(
                          breakdownEntries.length,
                          Object.entries(enhancedData.detailedAnalysis.problemSolving?.breakdown || enhancedData.detailedAnalysis[Object.keys(enhancedData.detailedAnalysis)[1]]?.breakdown || {}).length
                        );
                        const chartHeight = maxEntries * 80 + 50;
                        
                        return (
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border-2 border-indigo-200/40 shadow-xl">
                              <div className="mb-4">
                                <h4 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                  Technical Skills
                            </h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-3xl font-extrabold text-indigo-600">{technicalData.score}%</span>
                                  <span className="text-gray-600 font-semibold">Overall</span>
                                </div>
                              </div>
                            <ResponsiveContainer width="100%" height={chartHeight}>
                                <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 110, bottom: 10 }}>
                                  <defs>
                                    <linearGradient id="currentGradient" x1="0" y1="0" x2="1" y2="0">
                                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="targetGradient" x1="0" y1="0" x2="1" y2="0">
                                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="averageGradient" x1="0" y1="0" x2="1" y2="0">
                                      <stop offset="0%" stopColor="#e5e7eb" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#d1d5db" stopOpacity={0.8} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" strokeOpacity={0.5} />
                                  <XAxis type="number" domain={[0, 100]} stroke="#1e40af" tick={{ fontSize: 12, fill: '#1e40af', fontWeight: 600 }} />
                                  <YAxis dataKey="skill" type="category" stroke="#1e40af" width={100} tick={{ fontSize: 12, fill: '#1e40af', fontWeight: 600 }} />
                                  <Legend wrapperStyle={{ fontWeight: 700, fontSize: '13px' }} iconType="circle" />
                                <RechartsTooltip 
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length && payload[0]) {
                                      const data = payload[0].payload;
                                      return (
                                          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border-2 border-indigo-300">
                                            <p className="font-bold text-gray-900 mb-3 text-base border-b-2 border-indigo-100 pb-2">{data.skill}</p>
                                            <div className="space-y-2">
                                              {payload.map((entry, idx) => {
                                                const getColor = (key) => {
                                                  if (key === 'current') return 'text-blue-600 bg-blue-50 border-blue-200';
                                                  if (key === 'target') return 'text-green-600 bg-green-50 border-green-200';
                                                  return 'text-gray-600 bg-gray-50 border-gray-200';
                                                };
                                                return (
                                                  <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border-2 ${getColor(entry.dataKey)}`}>
                                                    <span className="font-semibold text-gray-700">{entry.dataKey === 'current' ? 'Current' : entry.dataKey === 'target' ? 'Target' : 'Average'}:</span>
                                                    <span className="text-lg font-bold">{entry.value}%</span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                            <p className="text-xs text-purple-600 mt-2 font-semibold">Percentile: {data.percentile}th</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                  <Bar dataKey="average" fill="url(#averageGradient)" radius={[0, 8, 8, 0]} name="Average" stroke="#9ca3af" strokeWidth={2} />
                                  <Bar dataKey="target" fill="url(#targetGradient)" radius={[0, 8, 8, 0]} name="Target" stroke="#059669" strokeWidth={2} />
                                  <Bar dataKey="current" fill="url(#currentGradient)" radius={[0, 8, 8, 0]} name="Current" stroke="#2563eb" strokeWidth={2} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      })()}

                      {/* RIGHT COLUMN: Problem Solving */}
                      {(() => {
                        const problemData = enhancedData.detailedAnalysis.problemSolving || enhancedData.detailedAnalysis[Object.keys(enhancedData.detailedAnalysis)[1]] || enhancedData.detailedAnalysis[Object.keys(enhancedData.detailedAnalysis)[0]];
                        if (!problemData?.breakdown) return null;
                        
                        const breakdownEntries = Object.entries(problemData.breakdown);
                        const chartData = breakdownEntries.map(([skill, score]) => ({
                          skill: skill.replace(/([A-Z])/g, ' $1').trim(),
                          current: score,
                          target: 80,
                          average: 65,
                          percentile: Math.min(score + 10, 95)
                        }));
                        
                        // Calculate consistent height based on max entries
                        const technicalEntries = Object.entries(enhancedData.detailedAnalysis.technicalSkills?.breakdown || enhancedData.detailedAnalysis[Object.keys(enhancedData.detailedAnalysis)[0]]?.breakdown || {}).length;
                        const maxEntries = Math.max(technicalEntries, breakdownEntries.length);
                        const chartHeight = maxEntries * 80 + 50;
                        
                        return (
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border-2 border-purple-200/40 shadow-xl">
                              <div className="mb-4">
                                <h4 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                  Problem Solving
                            </h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-3xl font-extrabold text-purple-600">{problemData.score}%</span>
                                  <span className="text-gray-600 font-semibold">Overall</span>
                                </div>
                              </div>
                            <ResponsiveContainer width="100%" height={chartHeight}>
                                <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 110, bottom: 10 }}>
                                  <defs>
                                    <linearGradient id="currentGradient2" x1="0" y1="0" x2="1" y2="0">
                                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="targetGradient2" x1="0" y1="0" x2="1" y2="0">
                                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="averageGradient2" x1="0" y1="0" x2="1" y2="0">
                                      <stop offset="0%" stopColor="#e5e7eb" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#d1d5db" stopOpacity={0.8} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" strokeOpacity={0.5} />
                                  <XAxis type="number" domain={[0, 100]} stroke="#7c3aed" tick={{ fontSize: 12, fill: '#7c3aed', fontWeight: 600 }} />
                                  <YAxis dataKey="skill" type="category" stroke="#7c3aed" width={100} tick={{ fontSize: 12, fill: '#7c3aed', fontWeight: 600 }} />
                                  <Legend wrapperStyle={{ fontWeight: 700, fontSize: '13px' }} iconType="circle" />
                                <RechartsTooltip 
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length && payload[0]) {
                                      const data = payload[0].payload;
                                      return (
                                          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border-2 border-purple-300">
                                            <p className="font-bold text-gray-900 mb-3 text-base border-b-2 border-purple-100 pb-2">{data.skill}</p>
                                            <div className="space-y-2">
                                              {payload.map((entry, idx) => {
                                                const getColor = (key) => {
                                                  if (key === 'current') return 'text-blue-600 bg-blue-50 border-blue-200';
                                                  if (key === 'target') return 'text-green-600 bg-green-50 border-green-200';
                                                  return 'text-gray-600 bg-gray-50 border-gray-200';
                                                };
                                                return (
                                                  <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border-2 ${getColor(entry.dataKey)}`}>
                                                    <span className="font-semibold text-gray-700">{entry.dataKey === 'current' ? 'Current' : entry.dataKey === 'target' ? 'Target' : 'Average'}:</span>
                                                    <span className="text-lg font-bold">{entry.value}%</span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                            <p className="text-xs text-purple-600 mt-2 font-semibold">Percentile: {data.percentile}th</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                  <Bar dataKey="average" fill="url(#averageGradient2)" radius={[0, 8, 8, 0]} name="Average" stroke="#9ca3af" strokeWidth={2} />
                                  <Bar dataKey="target" fill="url(#targetGradient2)" radius={[0, 8, 8, 0]} name="Target" stroke="#059669" strokeWidth={2} />
                                  <Bar dataKey="current" fill="url(#currentGradient2)" radius={[0, 8, 8, 0]} name="Current" stroke="#2563eb" strokeWidth={2} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      })()}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ROW 9: Benchmark comparison - Beautiful Design */}
                  {feedbackData?.allScores && feedbackData.allScores.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="relative"
                    >
                      {/* Glowing background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                      
                      <div className="bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 rounded-[2.5rem] shadow-2xl border-2 border-blue-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                        {/* Animated background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl" />
                        
                        {/* Header */}
                        <div className="relative mb-8">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="relative group">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                <BarChart3 className="text-white" size={28} />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Benchmark Comparison
                      </h3>
                              <p className="text-gray-700 text-base mt-1 font-semibold">Your performance compared to peers and targets</p>
                            </div>
                          </div>
                        </div>
                        {/* Enhanced Chart Container with Beautiful Design */}
                        <div className="relative z-10">
                          {/* Chart Wrapper with Glass Morphism */}
                          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border-2 border-blue-200/40 shadow-2xl relative overflow-hidden">
                            {/* Decorative gradient overlay */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                            
                            {/* Floating particles */}
                            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse" />
                            <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
                            
                      {(() => {
                        const benchmarkData = feedbackData.allScores.map((key, index) => {
                          const metric = Object.keys(key)[0];
                          const userScore = key[metric];
                          return {
                            skill: metric.replace(/([A-Z])/g, ' $1').trim(),
                            userScore: userScore,
                            targetScore: 80,
                            classAverage: 65 + (index * 2)
                          };
                        });
                        
                        return (
                                <ResponsiveContainer width="100%" height={500}>
                                  <BarChart 
                                    data={benchmarkData} 
                                    margin={{ top: 30, right: 40, left: 30, bottom: 60 }}
                                    barCategoryGap="20%"
                                  >
                                    <defs>
                                      {/* Gradient for Your Score */}
                                      <linearGradient id="userScoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                                      </linearGradient>
                                      {/* Gradient for Target Score */}
                                      <linearGradient id="targetScoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                      </linearGradient>
                                      {/* Gradient for Class Average */}
                                      <linearGradient id="classAverageGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#e5e7eb" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#d1d5db" stopOpacity={0.8} />
                                      </linearGradient>
                                    </defs>
                                    
                                    <CartesianGrid 
                                      strokeDasharray="3 3" 
                                      stroke="#dbeafe" 
                                      strokeOpacity={0.5}
                                      vertical={false}
                                    />
                                    
                              <XAxis 
                                dataKey="skill" 
                                      stroke="#1e40af"
                                      tick={{ fontSize: 13, fill: '#1e40af', fontWeight: 600 }}
                                angle={-45}
                                textAnchor="end"
                                      height={120}
                                      tickLine={{ stroke: '#3b82f6', strokeWidth: 2 }}
                              />
                                    
                              <YAxis 
                                domain={[0, 100]}
                                      stroke="#1e40af"
                                      tick={{ fontSize: 13, fill: '#1e40af', fontWeight: 600 }}
                                      tickLine={{ stroke: '#3b82f6', strokeWidth: 2 }}
                                      ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                                      label={{ 
                                        value: 'Score (%)', 
                                        angle: -90, 
                                        position: 'insideLeft',
                                        style: { fill: '#1e40af', fontWeight: 700, fontSize: 14 }
                                      }}
                                    />
                                    
                              <RechartsTooltip 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-2xl border-2 border-blue-300">
                                              <p className="font-bold text-gray-900 mb-3 text-lg border-b-2 border-blue-100 pb-2">
                                                {payload[0].payload.skill}
                                              </p>
                                              <div className="space-y-2">
                                                {payload.map((entry, idx) => {
                                                  const getColor = (name) => {
                                                    if (name === 'Your Score') return 'text-blue-600';
                                                    if (name === 'Target Score') return 'text-green-600';
                                                    return 'text-gray-600';
                                                  };
                                                  const getBgColor = (name) => {
                                                    if (name === 'Your Score') return 'bg-blue-50 border-blue-200';
                                                    if (name === 'Target Score') return 'bg-green-50 border-green-200';
                                                    return 'bg-gray-50 border-gray-200';
                                                  };
                                                  return (
                                                    <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border-2 ${getBgColor(entry.name)}`}>
                                                      <span className="font-semibold text-gray-700">{entry.name}:</span>
                                                      <span className={`text-lg font-bold ${getColor(entry.name)}`}>
                                                        {entry.value}%
                                                      </span>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                                    
                                    <Legend 
                                      wrapperStyle={{ 
                                        fontWeight: 700, 
                                        paddingTop: '20px',
                                        paddingBottom: '0px',
                                        marginBottom: '0px',
                                        fontSize: '14px'
                                      }}
                                      iconType="circle"
                                    />
                                    
                                    <Bar 
                                      dataKey="classAverage" 
                                      fill="url(#classAverageGradient)" 
                                      name="Class Average" 
                                      radius={[12, 12, 0, 0]}
                                      stroke="#9ca3af"
                                      strokeWidth={2}
                                    />
                                    <Bar 
                                      dataKey="targetScore" 
                                      fill="url(#targetScoreGradient)" 
                                      name="Target Score" 
                                      radius={[12, 12, 0, 0]}
                                      stroke="#059669"
                                      strokeWidth={2}
                                    />
                                    <Bar 
                                      dataKey="userScore" 
                                      fill="url(#userScoreGradient)" 
                                      name="Your Score" 
                                      radius={[12, 12, 0, 0]}
                                      stroke="#2563eb"
                                      strokeWidth={2}
                                    />
                            </BarChart>
                          </ResponsiveContainer>
                        );
                      })()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                {/* ROW 10: Strengths and Improvements - Stunning Design */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Strengths */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="relative"
                  >
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                    
                    <div className="bg-gradient-to-br from-white via-green-50/40 to-emerald-50/30 rounded-[2.5rem] shadow-2xl border-2 border-green-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                      {/* Animated background */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-3xl" />
                      
                      {/* Header */}
                      <div className="relative mb-8">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                              <CheckCircle className="text-white" size={28} />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                              Key Strengths
                      </h3>
                            <p className="text-gray-700 text-base mt-1 font-semibold">Areas where you excelled</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Strengths Cards */}
                      <div className="space-y-4 relative z-10">
                        {templateData.strengths.map((strength, index) => (
                            <motion.div
                              key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="group relative"
                          >
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Card */}
                            <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 border-2 border-green-200/50 shadow-lg transform group-hover:scale-[1.02] transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                  <CheckCircle className="text-white" size={20} />
                                </div>
                                <p className="text-gray-800 text-base leading-relaxed font-medium flex-1">{strength}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Right: Areas for Improvement */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.65 }}
                    className="relative"
                  >
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 rounded-[2.5rem] blur-3xl -z-10" />
                    
                    <div className="bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30 rounded-[2.5rem] shadow-2xl border-2 border-orange-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
                      {/* Animated background */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300/20 to-amber-300/20 rounded-full blur-3xl" />
                      
                      {/* Header */}
                      <div className="relative mb-8">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                              <Lightbulb className="text-white" size={28} />
                            </div>
                          </div>
                            <div>
                            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                              Areas for Improvement
                            </h3>
                            <p className="text-gray-700 text-base mt-1 font-semibold">Focus areas to enhance your performance</p>
                                    </div>
                        </div>
                      </div>
                      
                      {/* Improvement Cards */}
                      <div className="space-y-4 relative z-10">
                        {templateData.improvements.map((improvement, index) => (
                                  <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.65 + index * 0.1 }}
                            className="group relative"
                          >
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-amber-400/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Card */}
                            <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 border-2 border-orange-200/50 shadow-lg transform group-hover:scale-[1.02] transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                  <Lightbulb className="text-white" size={20} />
                                </div>
                                <p className="text-gray-800 text-base leading-relaxed font-medium flex-1">{improvement}</p>
                                </div>
                              </div>
                            </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                      </div>
            ) : templateData ? (
              // ORIGINAL RENDERING FOR NON-TECHNICAL INTERVIEWS
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {enhancedData?.performanceMetrics && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <PieChart className="h-5 w-5 text-blue-600" />
                        <span>Performance Metrics</span>
                      </h3>
                      <div className="grid-cols-2 md:grid-cols-2 gap-6 space-y-8">
                        {/* 1. Benchmark Chart - Grouped Bar Chart */}
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        >
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <span>Benchmark Comparison</span>
                          </h4>
                          {(() => {
                            if (!feedbackData.allScores || feedbackData.allScores.length === 0) {
                              return <div className="text-center py-8 text-gray-500">No benchmark data available</div>;
                            }
                            const benchmarkData = feedbackData.allScores.map((key, index) => {
                              const metric = Object.keys(key)[0];
                              const userScore = key[metric];
                              return {
                                skill: metric.replace(/([A-Z])/g, ' $1').trim(),
                                userScore: userScore,
                                targetScore: 80,
                                classAverage: 65 + (index * 2) // Mock average
                              };
                            });
                            
                            return (
                              <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis 
                                    dataKey="skill" 
                                    stroke="#6b7280"
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    tick={{ fontSize: 12 }}
                                  />
                                  <YAxis 
                                    domain={[0, 100]}
                                    stroke="#6b7280"
                                    label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                                  />
                                  <RechartsTooltip 
                                    content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                        return (
                                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                            <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.skill}</p>
                                            {payload.map((entry, idx) => (
                                              <p key={idx} className={`text-sm ${entry.color === '#3b82f6' ? 'text-blue-600' : entry.color === '#10b981' ? 'text-green-600' : 'text-gray-600'}`}>
                                                {entry.name}: {entry.value}%
                                              </p>
                                            ))}
                                          </div>
                                        );
                                      }
                                      return null;
                                    }}
                                  />
                                  <Legend />
                                  <Bar dataKey="classAverage" fill="#e5e7eb" name="Class Average" radius={[4, 4, 0, 0]} />
                                  <Bar dataKey="targetScore" fill="#10b981" name="Target Score" radius={[4, 4, 0, 0]} />
                                  <Bar dataKey="userScore" fill="#3b82f6" name="Your Score" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            );
                          })()}
                        </motion.div>

                        {/* 2. Percentile Gauges - Semi-circular meters */}
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 pb-13"
                        >
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span>Percentile Rankings</span>
                          </h4>
                          <div className="grid grid-cols-2 gap-6">
                            {Object.keys(feedbackData?.sub_scores ?? {}).slice(0, 2).map((key, index) => {
                              const subScore = feedbackData.sub_scores[key];
                              const percentile = subScore?.percentile ?? 0;
                              const rank = subScore?.rank ?? index + 1;
                              const total = subScore?.total_participants ?? 100;
                              const confidenceBand = percentile >= 75 ? 'high' : percentile >= 50 ? 'medium' : 'low';
                              
                              return (
                                <div key={index} className="flex justify-center">
                                  <SemiCircularGauge
                                    percentile={percentile}
                                    label={key}
                                    rank={rank}
                                    total={total}
                                    confidenceBand={confidenceBand}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      </div>

                      {/* 3. Performance Distribution - Bell Curve */}
                      {Object.keys(feedbackData?.scores_data_points ?? {}).length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        >
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                            <Activity className="h-5 w-5 text-purple-600" />
                            <span>Performance Distribution</span>
                          </h4>
                          {(() => {
                            const firstKey = Object.keys(feedbackData.scores_data_points)[0];
                            const dataPoints = feedbackData.scores_data_points[firstKey] || [];
                            const userScore = feedbackData?.skills_scores?.[0]?.score ?? 0;
                            const distData = generateDistributionData(dataPoints, userScore);
                            
                            if (distData.curve.length === 0) {
                              return <div className="text-center py-8 text-gray-500">No distribution data available</div>;
                            }
                            
                            return (
                              <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={distData.curve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                  <defs>
                                    <linearGradient id="distributionGradient" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis 
                                    dataKey="score" 
                                    stroke="#6b7280"
                                    label={{ value: 'Score', position: 'insideBottom', offset: -5 }}
                                  />
                                  <YAxis 
                                    stroke="#6b7280"
                                    label={{ value: 'Density', angle: -90, position: 'insideLeft' }}
                                  />
                                  <RechartsTooltip 
                                    content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                            <p className="font-semibold text-gray-900">Score: {data.score.toFixed(1)}</p>
                                            <p className="text-sm text-gray-600">Mean: {distData.mean.toFixed(1)}</p>
                                            <p className="text-sm text-purple-600">Your Score: {userScore}</p>
                                          </div>
                                        );
                                      }
                                      return null;
                                    }}
                                  />
                                  <Area 
                                    type="monotone" 
                                    dataKey="density" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={2}
                                    fill="url(#distributionGradient)"
                                  />
                                  {/* User score marker */}
                                  <ReferenceLine 
                                    x={userScore} 
                                    stroke="#ef4444" 
                                    strokeWidth={2}
                                    strokeDasharray="3 3"
                                    label={{ value: "Your Score", position: "top", fill: "#ef4444", fontSize: 12 }}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            );
                          })()}
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Recommendations */}
                  {/* <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <span>Recommendations</span>
                    </h3>
                    <div className="space-y-3">
                      {templateData.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div> */}

                  {/* Action Button */}
                  {/* <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Get Personalized Coaching</span>
                    </button>
                    <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2">
                      <RotateCcw className="h-5 w-5" />
                      <span>Retake Interview</span>
                    </button>
                  </div> */}
                </div>
              </div>
            ) : templateData ? (
              // ORIGINAL RENDERING FOR NON-TECHNICAL INTERVIEWS
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Overall Score */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 relative">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${templateData.overallScore * 2.51} 251`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900">{templateData.overallScore}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Overall Score</h3>
                      <p className="text-gray-600">Based on interview performance</p>
                    </div>
                  </div>

                  {/* Category Breakdown - Only show for Technical Interview */}
                  {selectedType === 'Technical Interview' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
                    <div className="space-y-4">
                      {templateData.categories.map((category, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{category.name}</h4>
                            <span className="text-2xl font-bold text-blue-600">{category.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${category.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Interview Transcript - Show for all interview types including HR */}
                  {enhancedData?.transcript && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Volume2 className="h-5 w-5 text-blue-600" />
                        <span>Interview Transcript Analysis</span>
                      </h3>
                          {enhancedData.transcript.map((entry, index) => (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.05 }}
                              className={`relative pl-6 ${
                                entry.speaker === 'Interviewer' 
                                  ? 'border-l-4 border-purple-400' 
                                  : 'border-l-4 border-blue-400'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                                    entry.speaker === 'Interviewer'
                                      ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                                      : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                  }`}>
                                    {entry.speaker === 'Interviewer' ? (
                                      <Users className="text-white" size={18} />
                                    ) : (
                                      <MessageSquare className="text-white" size={18} />
                                    )}
                                  </div>
                                  <div>
                                    <span className={`text-sm font-bold ${
                                      entry.speaker === 'Interviewer' ? 'text-purple-700' : 'text-blue-700'
                                }`}>
                                  {entry.speaker}
                                </span>
                                    <span className="text-xs text-gray-500 ml-2">{entry.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                              {entry.score && (
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getScoreColor(entry.score)}`}>
                                  {getScoreIcon(entry.score)}
                                  <span className="capitalize">{entry.score}</span>
                                </div>
                              )}
                              <p className="text-gray-700 mb-2 mt-3">{entry.text}</p>
                            {entry.feedback && (
                              <div className="bg-gray-50 rounded-lg p-3 mt-2">
                                <p className="text-sm text-gray-600">
                                  <strong>Feedback:</strong> {entry.feedback}
                                </p>
                              </div>
                            )}
                            </motion.div>
                        ))}
                    </div>
                  )}

                  {/* Detailed Performance Analysis - Only for Technical Interviews */}
                  {selectedType === 'Technical Interview' && enhancedData?.detailedAnalysis && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <span>Detailed Performance Analysis</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(enhancedData.detailedAnalysis).map(([category, data]) => (
                          <div key={category} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                              {category.replace(/([A-Z])/g, ' $1')}
                            </h4>
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Overall Score</span>
                                <span>{data.score}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${data.score}%` }}
                                ></div>
                              </div>
                            </div>
                            {data.breakdown && (
                              <div className="space-y-2 mb-4">
                                {Object.entries(data.breakdown).map(([skill, score]) => (
                                  <div key={skill} className="flex justify-between text-xs">
                                    <span className="text-gray-600 capitalize">{skill}</span>
                                    <span className="font-medium">{score}%</span>
                                  </div>
                                ))}
                              </div>
                            )}
                                </div>
                              ))}
                      </div>
                    </div>
                  )}

                  {/* Performance Metrics Charts */}
                  {enhancedData?.performanceMetrics && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <PieChart className="h-5 w-5 text-blue-600" />
                        <span>Performance Metrics</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                            <span>Performance vs Average</span>
                          </h4>
                          <div className="space-y-4">
                            {feedbackData.allScores?.map((key,index) =>{
                              const metric = Object.keys(key)[0];
                              const data =  key[metric];
                              return (
                              <div key={metric} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-700 capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="font-medium">{data}%</span>
                                </div>
                                <div className="flex space-x-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${Math.min((data), 100)}%` }}
                                    ></div>
                                  </div>
                                    <span className="text-xs text-gray-500">Target: 80</span>
                                </div>
                              </div>
                            )})}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span>Performance vs Percentile</span>
                          </h4>
                          <div className='space-y-4'>
                          {Object.keys(feedbackData?.sub_scores ?? {}).map((key,index) => {
                            return (
                              <div key={index} className="bg-white rounded-xl p-6 pt-15 pb-15 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-semibold text-gray-900">{key}</h3>
                                  <Star className="h-4 w-4 text-yellow-500" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{feedbackData?.sub_scores?.[key].percentile ?? "N/A"}%ile</div>
                                <div className="text-sm text-gray-600">Out of {feedbackData?.sub_scores?.[key].total_participants ?? "N/A"}</div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${feedbackData?.sub_scores?.[key].percentile ?? 0}%` }}
                                  ></div>
                                </div>
                              </div>
                              )})}
                          {Object.keys(feedbackData?.scores_data_points ?? {}).map((key,index) => {
                            return (
                            <div key={index} className="space-y-4 border border-gray-100 rounded-lg p-4">
                              <h1 className="!text-md font-semibold">{key}</h1>
                              <PercentileChart 
                                dataPoints={feedbackData?.scores_data_points?.[key] ?? []}
                                userScore={feedbackData?.skills_scores?.[index]?.score ?? 0}
                              />
                            </div>
                            )
                          })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Analysis - Strengths and Improvements */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden group"
                    >
                      {/* Decorative element */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/30 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                      
                      <div className="mb-6 relative">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={20} />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">Strengths</h3>
                      </div>
                        <p className="text-gray-600 text-sm mt-2">Areas where you excelled</p>
                    </div>
                      <div className="space-y-4">
                        {templateData.strengths.map((strength, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + index * 0.1 }}
                            className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl border border-green-100"
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700 text-sm leading-relaxed">{strength}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Areas for Improvement */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden group"
                    >
                      {/* Decorative element */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/30 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                      
                      <div className="mb-6 relative">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <TrendingUp className="text-orange-600" size={20} />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">Areas for Improvement</h3>
                      </div>
                        <p className="text-gray-600 text-sm mt-2">Focus areas to enhance your performance</p>
                    </div>
                      <div className="space-y-4">
                        {templateData.improvements.map((improvement, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.45 + index * 0.1 }}
                            className="flex items-start space-x-3 p-4 bg-orange-50 rounded-xl border border-orange-100"
                          >
                            <Lightbulb className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700 text-sm leading-relaxed">{improvement}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Transcript Summary */}
                  {enhancedData?.transcript && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden group"
                    >
                      {/* Decorative element */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                      
                      <div className="mb-6 relative">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <BarChart3 className="text-blue-600" size={20} />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">Response Analysis</h3>
                        </div>
                        <p className="text-gray-600 text-sm mt-2">Breakdown of your interview responses</p>
                      </div>
                      <div className="space-y-3">
                        {(() => {
                          const responses = enhancedData.transcript.filter(entry => entry.score);
                          const correct = responses.filter(r => r.score === 'correct').length;
                          const partial = responses.filter(r => r.score === 'partial').length;
                          const incorrect = responses.filter(r => r.score === 'incorrect').length;
                          
                          return (
                            <>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-gray-700">Excellent</span>
                                </div>
                                <span className="font-semibold text-green-600">{correct}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                  <span className="text-gray-700">Needs Work</span>
                                </div>
                                <span className="font-semibold text-yellow-600">{partial}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span className="text-gray-700">Incorrect</span>
                                </div>
                                <span className="font-semibold text-red-600">{incorrect}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </motion.div>
                  )}
                        </div>
                    </div>
            ) : null}
    </div>
  );
};

export default FeedbackTemplate;
