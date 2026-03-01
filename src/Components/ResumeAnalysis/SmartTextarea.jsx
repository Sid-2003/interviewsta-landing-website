import React, { useState, useEffect } from 'react';
import { Copy, X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SmartTextarea = ({ value, onChange, placeholder }) => {
  const [copied, setCopied] = useState(false);
  const [detectedSkills, setDetectedSkills] = useState([]);

  // Extract potential skills/keywords from text
  useEffect(() => {
    if (value.length > 50) {
      const commonSkills = [
        'React', 'JavaScript', 'Python', 'Java', 'Node.js', 'TypeScript',
        'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'MongoDB', 'PostgreSQL',
        'Agile', 'Scrum', 'REST API', 'GraphQL', 'CI/CD', 'Microservices'
      ];
      const detected = commonSkills.filter(skill =>
        value.toLowerCase().includes(skill.toLowerCase())
      );
      setDetectedSkills(detected.slice(0, 5));
    } else {
      setDetectedSkills([]);
    }
  }, [value]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to paste from clipboard:', err);
    }
  };

  const handleClear = () => {
    onChange('');
    setDetectedSkills([]);
  };

  const charCount = value.length;
  const targetChars = 500;
  const progress = Math.min((charCount / targetChars) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the job description here..."
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
        />
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
          <button
            onClick={handlePaste}
            className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-1"
            title="Paste from clipboard"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">{charCount} characters</span>
            <span className={`text-sm font-medium ${
              charCount >= targetChars ? 'text-green-600' : 'text-gray-500'
            }`}>
              {charCount >= targetChars ? '✓' : `Recommended: ${targetChars}+`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-full ${
                progress >= 100
                  ? 'bg-green-500'
                  : progress >= 50
                  ? 'bg-blue-500'
                  : 'bg-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Detected Skills */}
        {detectedSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 flex-wrap"
          >
            <span className="text-xs text-gray-500">Skills detected:</span>
            {detectedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {detectedSkills.length >= 5 && (
              <span className="text-xs text-gray-400">+ more</span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SmartTextarea;

