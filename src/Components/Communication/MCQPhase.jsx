import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Send, MessageCircle } from 'lucide-react';

const MCQPhase = ({ instruction, question, options, questionNumber, totalQuestions, socketRef, onSendResponse, onMCQSubmit, feedback, onFeedbackClear }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset selection when a new question arrives
  
  React.useEffect(() => {
    setSelectedOption(null);
    setIsSubmitting(false);
    if (onFeedbackClear) onFeedbackClear();
  }, [question]);

  // Timeout fallback: reset submitting state if stuck (e.g., when interview ends after last question)
  React.useEffect(() => {
    if (isSubmitting) {
      const timeout = setTimeout(() => {
        console.log('[MCQ] Submission timeout - resetting state');
        setIsSubmitting(false);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isSubmitting]);

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert('Please select an option before submitting.');
      return;
    }

    setIsSubmitting(true);
    console.log('[MCQ] Submitting answer:', selectedOption + 1);

    try {
      const optionText = options[selectedOption];
      if (onSendResponse) {
        onSendResponse({ textResponse: optionText });
        if (onMCQSubmit) onMCQSubmit();
      } else if (socketRef?.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'text',
          data: {
            message: optionText,
            mcq_submit: true,
            selected_option_index: selectedOption,
            selected_option_text: optionText,
          },
        }));
        if (onMCQSubmit) onMCQSubmit();
      } else {
        console.error('No send method available');
        alert('Connection error. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting MCQ:', error);
      alert('Error submitting answer. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-4 border-2 border-indigo-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Vocabulary Test</h3>
            <p className="text-sm text-gray-600">Question {questionNumber} of {totalQuestions}</p>
          </div>
        </div>
      </div>

      {instruction && (
        <div className="bg-white rounded-lg p-4 mb-4 border border-indigo-200">
          <p className="text-gray-700 font-medium">{instruction}</p>
        </div>
      )}

      {question && (
        <div className="bg-white rounded-lg p-6 mb-4 border-2 border-indigo-300 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">{question}</h4>
          
          {options && options.length > 0 && (
            <div className="space-y-3">
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedOption(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedOption === index
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {selectedOption === index ? (
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-800">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}

      {!feedback && (
        <div className="bg-white rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {isSubmitting ? 'Processing your answer...' : 'Select your answer above and click submit, or speak your choice.'}
            </p>
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null || isSubmitting}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : selectedOption !== null
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-300"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-1">Feedback</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{feedback}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MCQPhase;
