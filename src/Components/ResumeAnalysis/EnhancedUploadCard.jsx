import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, FileUp, X, CheckCircle } from 'lucide-react';

const EnhancedUploadCard = ({ uploadedFile, onFileUpload, onFileRemove, draggingFile, dropzoneRef }) => {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Upload Your Resume
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Upload your resume in PDF or Word format for AI analysis
        </p>

        <AnimatePresence mode="wait">
          {uploadedFile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative"
            >
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10"
              >
                <CheckCircle className="h-5 w-5 text-white" />
              </motion.div>

              {/* File Preview */}
              <div className="relative flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {uploadedFile.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
                <button
                  onClick={onFileRemove}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Replace Button */}
              <button
                onClick={() => document.getElementById('resume-upload-hidden').click()}
                className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Replace file
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <motion.div
                ref={dropzoneRef}
                animate={{
                  borderColor: draggingFile ? '#3b82f6' : '#d1d5db',
                  backgroundColor: draggingFile ? '#eff6ff' : '#ffffff',
                }}
                className={`border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
                  draggingFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => onFileUpload(e.target.files[0])}
                  className="hidden"
                  id="resume-upload-hidden"
                />
                <label
                  htmlFor="resume-upload-hidden"
                  className="cursor-pointer block"
                >
                  <motion.div
                    animate={{
                      scale: draggingFile ? 1.05 : 1,
                    }}
                    className="flex flex-col items-center"
                  >
                    {draggingFile ? (
                      <FileUp className="h-12 w-12 text-blue-600 mb-3" />
                    ) : (
                      <FileText className="h-12 w-12 text-gray-400 mb-3" />
                    )}
                    <p
                      className={`text-base font-medium mb-1 ${
                        draggingFile ? 'text-blue-700' : 'text-gray-900'
                      }`}
                    >
                      {draggingFile ? 'Drop your file here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      PDF, DOC, DOCX (max 10MB)
                    </p>
                  </motion.div>
                </label>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedUploadCard;

