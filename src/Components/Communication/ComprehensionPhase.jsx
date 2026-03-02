import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit3, Send, CheckCircle } from 'lucide-react';


const ComprehensionPhase = ({ instruction, question, socketRef, onSendResponse, onComprehensionSubmit, isProcessing, feedback }) => {
  const [writtenText, setWrittenText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isProceedingToMCQ, setIsProceedingToMCQ] = useState(false);

  // Reset analyzing state when feedback arrives
  useEffect(() => {
    if (feedback) {
      setIsAnalyzing(false);
    }
  }, [feedback]);

  // Reset proceed button when new question arrives (user navigated back or something)
  useEffect(() => {
    setIsProceedingToMCQ(false);
  }, [question]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setWrittenText(text);
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleSubmit = () => {
    if (isSubmitting || isAnalyzing) {
      console.log('[ComprehensionPhase] Already submitting, ignoring duplicate click');
      return; // Prevent multiple submissions
    }

    if (!writtenText.trim()) {
      alert('Please write your response before submitting.');
      return;
    }

    const words = writtenText.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length < 50) {
      alert(`Please write at least 50 words. You currently have ${words.length} words.`);
      return;
    }

    if (words.length > 100) {
      alert(`Please keep your response to 100 words or less. You currently have ${words.length} words.`);
      return;
    }

    console.log('[ComprehensionPhase] Submitting comprehension response...');
    setIsSubmitting(true);

    try {
      if (onSendResponse) {
        onSendResponse({ textResponse: writtenText });
        if (onComprehensionSubmit) onComprehensionSubmit();
        setIsAnalyzing(true);
        setWrittenText('');
        setWordCount(0);
      } else if (socketRef?.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'text',
          message: writtenText,
          comprehension_submit: true,
        }));
        if (onComprehensionSubmit) onComprehensionSubmit();
        setIsAnalyzing(true);
        setWrittenText('');
        setWordCount(0);
      } else {
        console.error('[ComprehensionPhase] No send method available');
        alert('Connection error. Please try again.');
        setIsSubmitting(false);
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('[ComprehensionPhase] Error submitting comprehension:', error);
      alert('Error submitting response. Please try again.');
      setIsSubmitting(false);
      setIsAnalyzing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 mb-4 border-2 border-orange-200"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Writing Comprehension</h3>
          <p className="text-sm text-gray-600">Write 50-100 words on the given scenario</p>
        </div>
      </div>

      {question && (
        <div className="bg-white rounded-lg p-6 mb-4 border-2 border-orange-300 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Edit3 className="h-5 w-5 text-orange-600" />
            <h4 className="font-semibold text-gray-900">Scenario</h4>
          </div>
          <p className="text-gray-800 leading-relaxed">{question}</p>
        </div>
      )}

      <div className="bg-white rounded-lg p-4 border border-orange-200 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Response
        </label>
          <textarea
          value={writtenText}
          onChange={handleTextChange}
          placeholder="Write your response here (50-100 words)..."
          className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          disabled={isSubmitting || isAnalyzing || feedback}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2 text-xs">
            <span className={`font-medium ${wordCount < 50 ? 'text-red-500' : wordCount > 100 ? 'text-orange-500' : 'text-green-600'}`}>
              {wordCount} / 50-100 words
            </span>
            {wordCount < 50 && (
              <span className="text-red-500">(Minimum 50 words required)</span>
            )}
            {wordCount > 100 && (
              <span className="text-orange-500">(Maximum 100 words)</span>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isAnalyzing || wordCount < 50 || wordCount > 100 || feedback}
            className="flex items-center space-x-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Response'}</span>
          </button>
        </div>
        
        {(isAnalyzing || isProcessing) && !feedback && (
          <div className="mt-4 flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm text-orange-600 font-medium">Analyzing your response...</span>
            </div>
            <p className="text-xs text-gray-500">Please wait while we process your submission</p>
          </div>
        )}
        
        {/* Feedback Section */}
        {feedback && (
          <div className="mt-4 bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h5 className="font-semibold text-green-900">Feedback</h5>
            </div>
            <p className="text-gray-800 leading-relaxed mb-4">{feedback}</p>
            <button
              onClick={() => {
                if (isProceedingToMCQ) return; // Prevent multiple clicks
                
                console.log('[ComprehensionPhase] Proceeding to MCQ phase...');
                setIsProceedingToMCQ(true);
                
                if (onSendResponse) {
                  onSendResponse({ textResponse: 'Yes, I am ready to proceed to the next exercise.' });
                } else if (socketRef?.current?.readyState === WebSocket.OPEN) {
                  socketRef.current.send(JSON.stringify({
                    type: 'text',
                    message: 'Yes, I am ready to proceed to the next exercise.',
                    comprehension_submit: false,
                  }));
                } else {
                  console.error('[ComprehensionPhase] No send method available');
                  setIsProceedingToMCQ(false);
                }
              }}
              disabled={isProceedingToMCQ}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                isProceedingToMCQ
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {isProceedingToMCQ ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Loading MCQ Phase...</span>
                </>
              ) : (
                <>
                  <span>Proceed to MCQ Phase</span>
                  <CheckCircle className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ComprehensionPhase;
