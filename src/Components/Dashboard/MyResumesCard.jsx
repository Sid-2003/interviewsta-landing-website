import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyResumesCard = ({ resumes = [], onViewAll }) => {
  const navigate = useNavigate();

  const handleResumeClick = (resume) => {
    navigate('/feedback-view', {
      state: {
        type: 'resume-analysis',
        fileName: resume.fileName,
        date: resume.date,
        resume_id: resume.id,
        back: '/manage'
      }
    });
  };

  const handleViewAll = () => {
    navigate("/resume-analysis-reports", {
      state: { resumeAnalysisReports: resumes },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">My Uploaded Resumes</h3>
          </div>
          {resumes.length > 0 && (
            <button
              onClick={handleViewAll}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        {resumes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">No resumes uploaded yet</p>
            <button
              onClick={() => navigate('/resume-analysis')}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Upload your first resume →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.slice(0, 3).map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleResumeClick(resume)}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate mb-1">{resume.fileName}</h4>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{resume.date}</span>
                      {resume.targetRole && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          {resume.targetRole}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                  {resume.overallScore !== undefined && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{resume.overallScore}%</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  )}
                  <Eye className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyResumesCard;

