import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';

const AIDoubtSolver = ({ concept, isPractice = false, isOpen: controlledIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleAsk = () => {
    if (!question.trim()) return;

    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: `Great question about ${concept}! Let me help you understand this better.

${isPractice 
  ? 'For this problem, the key is to understand the pattern. Here\'s a step-by-step explanation:\n\n1. Analyze the problem constraints\n2. Identify the approach\n3. Implement the solution\n4. Test with edge cases\n\nWould you like me to explain any specific part in more detail?'
  : 'This concept is fundamental to mastering arrays. The main idea is to think about how you can efficiently process the array elements. Would you like me to break down any specific part of this concept?'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Button - Only show if not controlled */}
      {controlledIsOpen === undefined && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setInternalIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-50 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/20 z-40"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 md:top-auto md:left-auto md:bottom-24 md:right-6 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 w-[90vw] md:w-96 h-[70vh] md:h-[500px] max-w-md max-h-[500px] md:max-w-none bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Glee Doubt Solver</h3>
                    <p className="text-xs text-purple-100">Ask about {concept}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Ask me anything about</p>
                    <p className="font-semibold text-purple-600">{concept}</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-3 flex-shrink-0">
                <div className="flex items-stretch gap-2">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={1}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAsk}
                    disabled={!question.trim() || isThinking}
                    className="w-9 h-auto min-h-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIDoubtSolver;

