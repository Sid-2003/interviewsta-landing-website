import React, { lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResumeAnalysis from "./ResumeAnalysis";
import { ArrowLeft, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const FeedbackRouter = lazy(() => import("./FeedbackTemplates/FeedbackRouter"));

const FeedbackTemp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    type = "",
    resume_id = "",
    interview_id = "",
    interview_type = "",
    fileName = "",
    title = "",
    date = "",
    back = "",
  } = location.state ?? {};

  console.log("location state", location.state);
  console.log("type", type);

  return (
    <>
      {type === "resume-analysis" ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full px-2 sm:px-4"
          >
            {/* Header */}
            <div className="mb-8">
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => navigate(back)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </motion.button>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {fileName}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {date}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      Resume Analysis
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <ResumeAnalysis input_session_id={resume_id} />
          </motion.div>
        </div>
      ) : (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500" /></div>}>
          <FeedbackRouter
            interview_id={interview_id}
            interview_type={interview_type}
          />
        </Suspense>
      )}
    </>
    // <div className="absolute top-20 inset-0 min-h-screen bg-gray-50 py-10 px-6 lg:px-12">
    //   <div className="flex items-center justify-between mb-8">
    //     <div>
    //       <h1 className="text-3xl font-bold text-gray-900">
    //         Feedback
    //       </h1>
    //       <p className="text-gray-600">Review your feedback</p>
    //     </div>
    //     <button
    //       className="text-blue-600 hover:text-blue-700 font-medium text-sm"
    //       onClick={() => navigate(back)}
    //     >
    //       ← Back
    //     </button>
    //   </div>
    //   {type === "resume-analysis" ? (
    //     <ResumeAnalysis input_session_id={resume_id} />
    //   ) : (
    //     <FeedbackTemplate
    //       interview_id={interview_id}
    //       interview_type={interview_type}
    //     />
    //   )}
    // </div>
  );
};

export default FeedbackTemp;
