import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  FileUp,
  CheckCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  LucideX,
  Lock,
  Users,
} from "lucide-react";
import useStopReload from "./customHooks/useStopReload";
import axios from "axios";
import { useBlocker } from "react-router-dom";
import { getAuthToken } from "../utils/auth";
// motion import removed - no longer needed
// uuidv4 import removed - no longer needed with FastAPI task_id
import { useVideoInterview } from "../Contexts/VideoInterviewContext";
import RadialGauge from "./ResumeAnalysis/RadialGauge";
import RadarChartSection from "./ResumeAnalysis/RadarChartSection";
import KeywordVisualizations from "./ResumeAnalysis/KeywordVisualizations";
import MultiRingDonut from "./ResumeAnalysis/MultiRingDonut";
import MetricCard from "./ResumeAnalysis/MetricCard";
import StickyInsightBar from "./ResumeAnalysis/StickyInsightBar";
import StepIndicator from "./ResumeAnalysis/StepIndicator";
import EnhancedUploadCard from "./ResumeAnalysis/EnhancedUploadCard";
import SmartTextarea from "./ResumeAnalysis/SmartTextarea";
import StickyAnalyzeButton from "./ResumeAnalysis/StickyAnalyzeButton";
import WhatYoullGet from "./ResumeAnalysis/WhatYoullGet";

const ResumeAnalysis = ({input_session_id}) => {
  const [inputCompleted, setInputCompleted] = useState(!!input_session_id);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summaryView, setSummaryView] = useState(true);
  const [analysisComplete, setAnalysisComplete] = useState(!!input_session_id);
  const [feedbackData, SetFeedbackData] = useState({});
  const [dataLoaded, SetDataLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(true);
  const [draggingFile, setDraggingFile] = useState(false);
  const draggingFileRef = useRef(false);
  const { state } = useVideoInterview();
  const dropdownRef = useRef(null);
  const outerRef = useRef([]);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const analysisSectionRef = useRef(null);
  
  // FastAPI migration - new state variables
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle' | 'pending' | 'processing' | 'completed' | 'failed'
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);
  
  useStopReload();
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (jobDescription || uploadedFile) &&
      currentLocation.pathname !== nextLocation.pathname
  );
  
  function handleSection(value) {
    console.log("heyey");
    return value.map((inp) => {
      inp.name = inp.name
        .split("_")
        .map((x) => x[0].toUpperCase() + x.slice(1))
        .join(" ");
      if (inp.score >= 80) {
        inp.status = "excellent";
      } else if (inp.score >= 70) {
        inp.status = "good";
      } else {
        inp.status = "needs-improvement";
      }
      console.log(inp);
      return inp;
    });
  }

  useEffect(() => {
    console.log(blocker);
  }, [blocker]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // console.log("HMM", feedbackData);
    if (Object.keys(feedbackData).length > 0 && !dataLoaded) {
      // console.log("HMM");
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      SetDataLoaded(true);
      // SetFeedbackData({...feedbackData,sections:handleSection(feedbackData?.sections ?? [])})
    }
    // console.log("FEEDBACK DATA", feedbackData);
  }, [feedbackData, dataLoaded]);
  
  useEffect(() => {
    if (dropdownRef.current) {
      if (draggingFile) { 
        dropdownRef.current.classList.remove("border-gray-300");
        dropdownRef.current.classList.add("border-blue-300","bg-blue-100/90");
      } else {    
        dropdownRef.current.classList.add("border-gray-300");
        dropdownRef.current.classList.remove("border-blue-300","bg-blue-100/90");
      }
    }
  },[draggingFile]);

// const push_el = (element) => {
//   if (element) {
//     // Only push if not already present and only when mounting
//     if (!innerRef.current.includes(element)) {
//       innerRef.current.push(element);
//     }
//   }
// };
// Keep this function for fetching historical analysis results (from Django backend)
  const fetchAnalysisResults = React.useCallback(async (token, session_id = null, resume_id = null) => {
    let response1 = null;
    try {
      const params = resume_id ? { resume_id: resume_id } : { session_id: session_id };
      response1 = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "get-resume-analysis/",
        // Data as second parameter
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't manually set Content-Type for FormData
          },
        }
      );
    } catch (error) {
      console.error("Error fetching resume analysis results:", error);
      setError('Failed to fetch historical analysis results');
    }
    const modifiedData = {
      ...(response1?.data ?? {}),
      sections: handleSection(response1?.data?.sections ?? []),
    };

    console.log("This is data", modifiedData);
    SetFeedbackData(modifiedData ?? {});

    setInputCompleted(true);

  }, []);

  useEffect(() => {
    if (input_session_id) {
      const fetchData = async () => {
        try {
          const token = await getAuthToken();
          await fetchAnalysisResults(token, null, input_session_id);
          setSummaryView(true);
        } catch (err) {
          console.error("[ResumeAnalysis] Not authenticated or token failed:", err);
        }
      };
      fetchData();
    }
  }, [input_session_id, fetchAnalysisResults]);

  useEffect(() => {
    const dragHandler = (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files[0]) {
        handleFileUpload(files[0]);
      }
      dropdownRef.current = 0;
      console.log(files);
    };

    const dragOverHandler = (e) => e.preventDefault(); // store the function in a variable
    
    const dragOverEnterHandler = (e) => {
      e.preventDefault();
      draggingFileRef.current += 1;
      console.log("inner enter -> ", draggingFileRef.current);
      setDraggingFile(true);
    }

    const dragOverLeaveHandler = (e) => {   
      e.preventDefault();
      draggingFileRef.current -= 1;
      console.log("inner leave -> ", draggingFileRef.current);
      if(draggingFileRef.current === 0)
        setDraggingFile(false);
    }
      
    const el = dropdownRef.current;
    // const outerEl = outerRef.current;

    if (el) {
      document.body.addEventListener("dragover", dragOverHandler);
      el.addEventListener("dragenter", dragOverEnterHandler);
      el.addEventListener("dragleave", dragOverLeaveHandler);
      // outerEl.addEventListener("dragenter", dragOverOuterEnterHandler);
      // outerEl.addEventListener("dragleave", dragOverOuterLeaveHandler);
      el.addEventListener("drop", dragHandler);
      // document.body.addEventListener("")


    }

    return () => {
      if (!(el)) return;
      document.body.removeEventListener("dragover", dragOverHandler);
      el.removeEventListener("dragenter", dragOverEnterHandler);
      el.removeEventListener("dragleave", dragOverLeaveHandler);
      // outerEl.removeEventListener("dragenter", dragOverOuterEnterHandler);
      // outerEl.removeEventListener("dragleave", dragOverOuterLeaveHandler);
      el.removeEventListener("drop", dragHandler);
    };
  }, []);

  useEffect(() => {
    if (jobDescription.trim() && uploadedFile) {
      setSubmitted(false);
    }
  }, [jobDescription, uploadedFile]);

  // Scroll detection for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (analysisSectionRef.current) {
        const rect = analysisSectionRef.current.getBoundingClientRect();
        setStickyBarVisible(rect.top < 0 && analysisComplete);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [analysisComplete]);

  // useEffect(() => {
  //   const handlebeforeunload = (e) => {
  //     e.preventDefault();
  //   }
  //   const p = window.addEventListener('beforeunload', handlebeforeunload);
  //   // const c = window.addEventListener('')

  //   return () => {
  //     window.removeEventListener('beforeunload', p);
  //   }
  // },[])

  const handleFileUpload = (file) => {
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
  };


  const analyzeResume = async () => {
    if (!uploadedFile && !jobDescription.trim()) {
      alert("Please upload a resume or enter a job description to analyze.");
      return;
    }
    
    setSubmitted(true);
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);
    setStatus('pending');

    try {
      const token = await getAuthToken();
      
      // Prepare form data for FastAPI
    const formdata = new FormData();
    formdata.append("resume", uploadedFile);
      
      // Backend expects job_description as a FILE, not a string
      // Convert text string to File object
      const jobDescBlob = new Blob([jobDescription.trim()], { type: 'text/plain' });
      const jobDescFile = new File([jobDescBlob], 'job_description.txt', { type: 'text/plain' });
      formdata.append("job_description", jobDescFile);
      
      // Debug: Log what we're sending
      console.log('=== Resume Analysis Submission ===');
      console.log('Resume file:', uploadedFile ? {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type
      } : 'MISSING');
      console.log('Job description:', jobDescription.trim() ? 
        `${jobDescription.trim().substring(0, 50)}... (${jobDescription.trim().length} chars)` : 
        'MISSING'
      );
      console.log('FormData entries:');
      for (let [key, value] of formdata.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
      }
      
      // Submit to FastAPI endpoint
      const API_BASE_URL = import.meta.env.VITE_FASTAPI_BASE_URL || 'http://localhost:8001/api/v1';
      console.log('Posting to:', `${API_BASE_URL}/resume/analyze`);
      console.log('FormData:', formdata);
      
      const response = await axios.post(
        `${API_BASE_URL}/resume/analyze`,
        formdata,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      // Get task_id from response
      const { task_id } = response.data;
      console.log('Resume analysis task submitted:', task_id);

      // Start polling for results
      pollForResults(task_id, token);

    } catch (error) {
      console.error("Error during resume analysis:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      
      // Handle 422 validation errors specifically
      if (error.response?.status === 422) {
        const detail = error.response.data?.detail;
        console.error("Validation error detail:", detail);
        
        if (Array.isArray(detail)) {
          // Pydantic validation errors - show which fields are wrong
          const errors = detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join('; ');
          setError(`Validation error: ${errors}`);
        } else {
          setError(detail || 'Validation error - check request format');
        }
      } else if (error.response?.status === 401) {
        setError('Authentication failed - please login again');
      } else {
        setError(error.response?.data?.detail || error.message || 'Failed to submit resume for analysis');
      }
      
      setIsAnalyzing(false);
      setSubmitted(false);
      setStatus('failed');
    }
  };

  // Poll for analysis results
  const pollForResults = async (taskId, token) => {
    const maxAttempts = 60; // Poll for 5 minutes (60 * 5s)
    let attempts = 0;
    const API_BASE_URL = import.meta.env.VITE_FASTAPI_BASE_URL || 'http://localhost:8001/api/v1';

    const poll = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/resume/${taskId}/status`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        console.log('Response:', response.data);

        const { status, progress, result } = response.data;

        // Update UI with progress
        setProgress(progress || 0);
        setStatus(status);

        console.log(`Task ${taskId} status: ${status}, progress: ${progress}%`);

        if (status === 'completed') {
          // Analysis complete!
          console.log('Analysis completed:', result);
          
          // Backend now returns data in old format, but ensure all fields are present
          const modifiedData = {
            // Scores
            overall_score: result.overall_score || result.section_analysis?.job_match_score || 0,
            job_match_score: result.job_match_score || result.section_analysis?.job_match_score || 0,
            
            // Sections - backend returns underscore names, handleSection will transform them
            sections: handleSection(result.sections || []),
            
            // Strengths and improvements - use direct fields if available
            candidate_strengths: result.candidate_strengths || 
                                result.strengths_and_improvements?.candidate_strengths || [],
            candidates_areas_of_improvements: result.candidates_areas_of_improvements || 
                                            result.strengths_and_improvements?.candidates_areas_of_improvements || [],
            
            // Keywords - backend now returns in correct format
            keywords: result.keywords || {
              found: result.keyword_analysis?.found_keywords || [],
              missing: result.keyword_analysis?.not_found_keywords || [],
              jobSpecific: result.keyword_analysis?.top_3_keywords || [],
              score: result.section_analysis?.keywords_optimization || 0
            },
            
            // Job alignment - use jobalignment if available (old format), otherwise job_alignment
            jobalignment: result.jobalignment || result.job_alignment || {},
            
            // Additional metadata
            company: result.company || '',
            role: result.role || '',
            session_id: result.session_id || taskId,
            resume_name: result.resume_name || uploadedFile?.name || '',
            insights: result.insights || result.job_alignment?.insights || []
          };
          
          console.log('Transformed data:', modifiedData);
          SetFeedbackData(modifiedData);
          setInputCompleted(true);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          SetDataLoaded(true);
          return;
        }

        if (status === 'failed') {
          setError(response.data.error || 'Analysis failed. Please try again.');
          setIsAnalyzing(false);
          setSubmitted(false);
          return;
        }

        // Still processing, poll again
        attempts++;
        if (attempts < maxAttempts) {
          pollingRef.current = setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          setError('Analysis timeout. Please try again.');
          setIsAnalyzing(false);
          setSubmitted(false);
        }

      } catch (error) {
        console.error('Error fetching results:', error);
        setError('Failed to fetch analysis results');
        setIsAnalyzing(false);
        setSubmitted(false);
      }
    };

    poll();
  };

  const getAnalysisResults = () => {
    // Always return data from feedbackData (from API response)
      return {
        overallScore: feedbackData?.overall_score ?? 0,
        matchScore: feedbackData?.job_match_score ?? 0,
        sections: feedbackData?.sections ?? [],
        strengths: feedbackData?.candidate_strengths ?? [],
        improvements: feedbackData?.candidates_areas_of_improvements ?? [],
        keywords: feedbackData?.keywords ?? {
          found: [],
          missing: [],
          jobSpecific: [],
          score: 0,
        },
        jobAlignment: feedbackData?.jobalignment ?? {},
    };
  };

  const analysisResults = getAnalysisResults();

  // if(blocker.state === 'blocked'){
  //   return (<>
  //   poop
  //   <button onClick={()=>blocker.reset()}>sdvsdd</button>
  //   </>)
  // }

  return (
    <div className="relative min-h-screen bg-gray-50 py-8">
      <StickyInsightBar
        overallScore={analysisResults.overallScore}
        matchScore={analysisResults.matchScore}
        missingKeywordsCount={analysisResults.keywords?.missing?.length || 0}
        keywordsScore={analysisResults.keywords?.score || 0}
        isVisible={stickyBarVisible}
      />
      {blocker.state === "blocked" ? (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
            aria-hidden="true"
          />

          {/* Modal Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 z-50 animate-scale-in"
          >
            <div className="text-center">
              <h3
                id="dialog-title"
                className="text-lg font-semibold text-gray-900"
              >
                Unsaved Changes
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to leave? Your progress will be lost.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => blocker.proceed()}
                className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Leave Page
              </button>
              <button
                onClick={() => blocker.reset()}
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Stay
              </button>
            </div>
          </div>
        </>
      ) : null}

            {/* Resume Analysis Progress Popup - single top-level modal */}
            {isAnalyzing && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="analysis-progress-title"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm min-w-[300px] bg-white rounded-2xl shadow-2xl p-6 z-50"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
              <h3
                id="analysis-progress-title"
                className="text-lg font-semibold text-gray-900"
              >
                Analyzing your resume
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {status === "queued" && "Your request is in the queue…"}
                {status === "pending" && "Starting analysis…"}
                {status === "processing" &&
                  "Analyzing your resume against the job description…"}
                {status === "completed" && "Complete!"}
                {status === "failed" && "Something went wrong."}
              </p>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{progress}%</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8" ref={outerRef}>
        {/* Header */}
        {!summaryView && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Resume Analysis</h1>
            <p className="text-gray-600 mt-2">
              Get AI-powered insights to improve your resume
            </p>
          </div>
        )}

        {!inputCompleted ? (
          /* Upload Section - Guided 3-Step Flow */
          <div className="w-full">
            {/* Step Indicator - Hidden on Mobile */}
            <div className="hidden md:block">
              <StepIndicator
                steps={[
                  { label: "Upload Resume" },
                  { label: "Paste Job Description" },
                  { label: "Get Smart Insights" },
                ]}
                currentStep={
                  uploadedFile && jobDescription.trim()
                    ? 3
                    : uploadedFile
                    ? 2
                    : jobDescription.trim()
                    ? 2
                    : 1
                }
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Resume Upload - Enhanced */}
              <EnhancedUploadCard
                uploadedFile={uploadedFile}
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                draggingFile={draggingFile}
                dropzoneRef={dropdownRef}
              />

              {/* Job Description Input - Smart Textarea */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Job Description
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Paste the job description for targeted analysis
                  </p>
                </div>

                <SmartTextarea
                  value={jobDescription}
                  onChange={setJobDescription}
                />
              </div>
            </div>

            {/* Gradient Divider */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Step 3: Get Smart Insights Button */}
            <div className="text-center mb-6">
              <button
                onClick={analyzeResume}
                disabled={submitted || isAnalyzing}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-3 mx-auto hover:scale-102 active:scale-98 ${
                  !submitted && !isAnalyzing
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6" />
                    <span>Get Smart Insights</span>
                  </>
                )}
              </button>
              {!submitted && !isAnalyzing && (
                <p className="text-gray-500 text-sm mt-3">
                  {uploadedFile && jobDescription.trim()
                    ? "Get targeted analysis comparing your resume to the job requirements"
                    : uploadedFile
                    ? "Add a job description for targeted analysis"
                    : jobDescription.trim()
                    ? "Upload your resume for complete analysis"
                    : "Upload a resume and/or enter job description to get started"}
                </p>
              )}
            </div>

            {/* Gradient Divider */}
            <div className="mb-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* What You'll Get Section */}
            <div>
              <WhatYoullGet />
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <span>Your data is private & auto-deleted after analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>Used by 1,000+ students & professionals</span>
              </div>
            </div>
          </div>
        ) : !dataLoaded ? (
          <></>
        ) : (
          /* Analysis Results Section */
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* File and Job Info */}
            {!summaryView && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Analysis Input
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {uploadedFile && (
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {uploadedFile.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}

                  {jobDescription.trim() && (
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Job Description
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {jobDescription.length} characters analyzed
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setJobDescription("");
                      setAnalysisComplete(false);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}


              {/* Error Message */}
              {error && !isAnalyzing && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 mb-1">
                        Analysis Failed
                      </h3>
                      <p className="text-red-700 text-sm">{error}</p>
                      <button
                        onClick={() => {
                          setError(null);
                          setSubmitted(false);
                        }}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {analysisComplete && (
                <>
                  {/* Overall Score - Radial Gauges */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6" ref={analysisSectionRef}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <RadialGauge
                        score={analysisResults.overallScore}
                        label="Overall Score"
                        subLabel="Resume quality assessment"
                        color="#3b82f6"
                        size={140}
                      />
                      {analysisResults.matchScore && (
                        <RadialGauge
                          score={analysisResults.matchScore}
                          label="Job Match"
                          subLabel="Alignment with job requirements"
                          color="#8b5cf6"
                          size={140}
                        />
                      )}
                    </div>
                  </div>

                  {/* Section Scores - Radar Chart + Progress Bars */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Section Analysis
                    </h3>
                    {analysisResults.sections.length > 0 ? (
                      <RadarChartSection sections={analysisResults.sections} />
                    ) : (
                      <p className="text-gray-500 text-center py-8">No section data available</p>
                    )}
                  </div>

                  {/* Keywords Analysis - Donut + Bubble Cloud */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Keywords Analysis
                    </h3>
                    <KeywordVisualizations keywords={analysisResults.keywords} />
                  </div>

                  {/* Job Alignment Analysis - Multi-Ring Donut */}
                  {analysisResults.jobAlignment && Object.keys(analysisResults.jobAlignment).length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        <span>Job Alignment Analysis</span>
                      </h3>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <MultiRingDonut jobAlignment={analysisResults.jobAlignment} />
                        <div className="flex items-center">
                          <div className="w-full p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-medium text-purple-900 mb-3">
                              Job Match Insights
                            </h4>
                            <div className="space-y-2 text-sm text-purple-800">
                              {(feedbackData?.insights ?? []).map(
                                (value, index) => (
                                  <p key={index}>• {value}</p>
                                )
                              )}
                              {(!feedbackData?.insights || feedbackData.insights.length === 0) && (
                                <p className="text-purple-600">No additional insights available</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Analysis Type Indicator */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Analysis Type
                </h3>
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      uploadedFile
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <FileText
                      className={`h-5 w-5 ${
                        uploadedFile ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={
                        uploadedFile
                          ? "text-blue-700 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Resume Analysis
                    </span>
                    {uploadedFile && (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      jobDescription.trim()
                        ? "bg-purple-50 border border-purple-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <Target
                      className={`h-5 w-5 ${
                        jobDescription.trim()
                          ? "text-purple-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={
                        jobDescription.trim()
                          ? "text-purple-700 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Job Matching
                    </span>
                    {jobDescription.trim() && (
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                </div>
              </div>

              {analysisComplete && (
                <>
                  {/* Strengths - Metric Cards */}
                  {analysisResults.strengths.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Strengths</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {analysisResults.strengths.map((strength, index) => (
                          <MetricCard
                            key={index}
                            title={strength}
                            type="strength"
                            value={85 - index * 5}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvements - Metric Cards */}
                  {analysisResults.improvements.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        <span>Improvements</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {analysisResults.improvements.map((improvement, index) => {
                          // Assign priority based on position (first items are higher priority)
                          const priority = index < 2 ? 'high' : index < 4 ? 'medium' : 'low';
                          return (
                            <MetricCard
                              key={index}
                              title={improvement}
                              type="improvement"
                              priority={priority}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Enhanced Quick Stats */}
              {/* <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Analysis Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Resumes Analyzed Today
                    </span>
                    <span className="font-semibold text-gray-900">247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg. Improvement</span>
                    <span className="font-semibold text-gray-900">23%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-gray-900">94%</span>
                  </div>
                  {jobDescription.trim() && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Job Matches Today</span>
                      <span className="font-semibold text-gray-900">89</span>
                    </div>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>
      {stickyBarVisible && <div className="h-16" />}
    </div>
  );
};

export default ResumeAnalysis;
