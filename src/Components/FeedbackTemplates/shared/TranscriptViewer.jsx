import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Editor } from '@monaco-editor/react';

const getScoreColor = (score) => {
  if (score === 'correct answer') return 'text-green-600 bg-green-50 border-green-200';
  if (score === 'cross-question answer') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (score === 'incorrect answer') return 'text-red-600 bg-red-50 border-red-200';
  if (score === 'partially-correct answer') return 'text-blue-600 bg-blue-50 border-blue-200';
  return 'text-gray-600 bg-gray-50 border-gray-200';
};

const getScoreIcon = (score) => {
  if (score === 'correct answer') return <CheckCircle className="h-4 w-4" />;
  if (score === 'cross-question answer') return <AlertCircle className="h-4 w-4" />;
  if (score === 'incorrect answer') return <XCircle className="h-4 w-4" />;
  if (score === 'partially-correct answer') return <AlertCircle className="h-4 w-4" />;
  return null;
};

const TranscriptViewer = ({ transcript = [] }) => {
  if (!transcript || transcript.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-[2.5rem] blur-3xl -z-10" />
      <div className="bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 rounded-[2.5rem] shadow-2xl border-2 border-blue-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-60" />
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

        <div className="relative z-10 bg-white/60 backdrop-blur-md rounded-3xl p-6 border-2 border-blue-200/30 shadow-xl">
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
            {transcript.map((entry, index) => (
              <motion.div
                key={entry.id ?? index}
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
                      {entry.speaker === 'Interviewer'
                        ? <Users className="text-white" size={18} />
                        : <MessageSquare className="text-white" size={18} />
                      }
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

                <div className={`ml-14 rounded-2xl p-4 shadow-md ${
                  entry.speaker === 'Interviewer'
                    ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200/50'
                    : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200/50'
                }`}>
                  {entry.speaker === 'Interviewer' ? (
                    <p className="text-gray-800 leading-relaxed">{entry.text}</p>
                  ) : (() => {
                    const textToSplit = (entry.text && typeof entry.text === 'string') ? entry.text : '';
                    const parts = textToSplit.split('[CODE INPUT]');
                    const spokenPart = parts[0]?.trim() || '';
                    const codePart = parts[1]?.trim() || '';
                    return (
                      <div className="space-y-4">
                        {spokenPart && <p className="text-gray-800 leading-relaxed">{spokenPart}</p>}
                        {codePart && (
                          <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                            <Editor
                              height="200px"
                              defaultLanguage="python"
                              theme="vs-light"
                              value={codePart}
                              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {entry.feedback && entry.speaker !== 'Interviewer' && (
                    <div className="mt-3 pt-3 border-t-2 border-blue-200/50">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">AI Feedback</p>
                      <p className="text-sm text-gray-700 italic">{entry.feedback}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TranscriptViewer;
