import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, LogOut } from 'lucide-react';

const MCQResults = ({ results, onFinishInterview }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No MCQ results available
      </div>
    );
  }

  
  // Calculate score
  const correctAnswers = results.filter(r => 
    r.user_answer && r.user_answer.trim() === r.correct_answer.trim()
  ).length;
  const totalQuestions = results.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Score */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6 mb-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">MCQ Assessment Results</h2>
            <p className="text-indigo-100">Your performance on vocabulary questions</p>
          </div>
          <div className="text-center">
            <Award className="h-12 w-12 mx-auto mb-2" />
            <div className="text-4xl font-bold">{percentage}%</div>
            <div className="text-sm text-indigo-100">
              {correctAnswers} / {totalQuestions} correct
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result, index) => {
          const isCorrect = result.user_answer && 
            result.user_answer.trim() === result.correct_answer.trim();
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-2 rounded-lg p-4 ${
                isCorrect 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-red-300 bg-red-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-700">
                      Question {result.question_number}:
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isCorrect 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <p className="text-gray-800 mb-3 font-medium">
                    {result.question}
                  </p>
                  
                  {/* Options */}
                  <div className="space-y-2 mb-3">
                    {result.options && result.options.map((option, optIdx) => {
                      const isUserAnswer = result.user_answer && 
                        result.user_answer.trim() === option.trim();
                      const isCorrectOption = result.correct_answer && 
                        result.correct_answer.trim() === option.trim();
                      
                      return (
                        <div
                          key={optIdx}
                          className={`p-2 rounded ${
                            isCorrectOption
                              ? 'bg-green-200 border-2 border-green-400 font-medium'
                              : isUserAnswer
                              ? 'bg-red-200 border-2 border-red-400'
                              : 'bg-gray-100'
                          }`}
                        >
                          <span className="text-gray-700">
                            {optIdx + 1}. {option}
                            {isCorrectOption && (
                              <span className="ml-2 text-green-700 font-semibold">
                                ✓ Correct Answer
                              </span>
                            )}
                            {isUserAnswer && !isCorrectOption && (
                              <span className="ml-2 text-red-700 font-semibold">
                                ✗ Your Answer
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Answer Summary */}
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-semibold text-gray-600">Your answer: </span>
                      <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                        {result.user_answer || 'Not answered'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div>
                        <span className="font-semibold text-gray-600">Correct answer: </span>
                        <span className="text-green-700">{result.correct_answer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: results.length * 0.1 + 0.2 }}
        className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{percentage}%</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
        </div>
        
        {/* Feedback Message */}
        <div className="mt-4 p-4 bg-indigo-50 rounded border border-indigo-200">
          <p className="text-gray-700 text-center">
            {percentage >= 75 ? (
              <span className="text-green-700 font-medium">
                🎉 Excellent work! You have a strong grasp of vocabulary.
              </span>
            ) : percentage >= 50 ? (
              <span className="text-yellow-700 font-medium">
                👍 Good effort! Keep practicing to improve your vocabulary.
              </span>
            ) : (
              <span className="text-orange-700 font-medium">
                💪 Keep learning! Review the correct answers and try again.
              </span>
            )}
          </p>
        </div>
      </motion.div>

      {/* Finish Interview Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: results.length * 0.1 + 0.4 }}
        className="mt-6 text-center"
      >
        <button
          onClick={onFinishInterview}
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span>Finish Interview</span>
          <LogOut className="h-5 w-5" />
        </button>
        <p className="mt-3 text-sm text-gray-600">
          Click to complete your communication assessment
        </p>
      </motion.div>
    </div>
  );
};

export default MCQResults;
