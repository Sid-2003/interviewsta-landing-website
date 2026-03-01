import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  ArrowLeft, 
  Play, 
  Send, 
  Code,
  CheckCircle2,
  X,
  Loader2,
  MessageCircle,
  Sparkles,
  Video,
  Eye
} from 'lucide-react';
import AIDoubtSolver from './AIDoubtSolver';
import PurpleDropdown from '../../Common/PurpleDropdown';

const PracticePage = () => {
  const { concept, problemId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [isDoubtSolverOpen, setIsDoubtSolverOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState('question'); // 'question' or 'code'

  // Static problem data
  const problemData = {
    '1': {
      title: 'Find Maximum Element',
      difficulty: 'Easy',
      videoSolution: '/src/assets/Lectures/findMaxEle.mp4',
      description: `Given an array of integers, find the maximum element.

**Example:**
\`\`\`
Input: [3, 7, 2, 9, 1]
Output: 9
\`\`\`

**Constraints:**
- Array length: 1 <= n <= 1000
- Elements: -1000 <= arr[i] <= 1000

**Approach:**
Iterate through the array and keep track of the maximum value encountered.`,
      starterCode: {
        javascript: `function findMax(arr) {
  // Your code here
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// Test cases
console.log(findMax([3, 7, 2, 9, 1])); // 9
console.log(findMax([-5, -2, -10])); // -2`,
        python: `def find_max(arr):
    # Your code here
    max_val = arr[0]
    for num in arr[1:]:
        if num > max_val:
            max_val = num
    return max_val

# Test cases
print(find_max([3, 7, 2, 9, 1]))  # 9
print(find_max([-5, -2, -10]))  # -2`,
        java: `public class Solution {
    public int findMax(int[] arr) {
        // Your code here
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }
}`
      },
      solutionCode: {
        javascript: `function findMax(arr) {
  // Initialize max with first element
  let max = arr[0];
  
  // Iterate through the array starting from index 1
  for (let i = 1; i < arr.length; i++) {
    // Update max if current element is greater
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  
  return max;
}

// Time Complexity: O(n) - single pass through array
// Space Complexity: O(1) - only using constant extra space`,
        python: `def find_max(arr):
    # Initialize max with first element
    max_val = arr[0]
    
    # Iterate through the array starting from index 1
    for num in arr[1:]:
        # Update max if current element is greater
        if num > max_val:
            max_val = num
    
    return max_val

# Time Complexity: O(n) - single pass through array
# Space Complexity: O(1) - only using constant extra space`,
        java: `public class Solution {
    public int findMax(int[] arr) {
        // Initialize max with first element
        int max = arr[0];
        
        // Iterate through the array starting from index 1
        for (int i = 1; i < arr.length; i++) {
            // Update max if current element is greater
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        
        return max;
    }
}

// Time Complexity: O(n) - single pass through array
// Space Complexity: O(1) - only using constant extra space`
      },
      testCases: [
        { input: [3, 7, 2, 9, 1], expected: 9 },
        { input: [-5, -2, -10], expected: -2 },
        { input: [100], expected: 100 }
      ]
    },
    '2': {
      title: 'Reverse Array',
      difficulty: 'Easy',
      description: `Reverse the elements of an array in-place.

**Example:**
\`\`\`
Input: [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]
\`\`\`

**Constraints:**
- Array length: 1 <= n <= 1000

**Approach:**
Use two pointers from both ends and swap elements.`,
      starterCode: {
        javascript: `function reverseArray(arr) {
  // Your code here
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr;
}

// Test cases
console.log(reverseArray([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]`,
        python: `def reverse_array(arr):
    # Your code here
    left = 0
    right = len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr

# Test cases
print(reverse_array([1, 2, 3, 4, 5]))  # [5, 4, 3, 2, 1]`,
        java: `public class Solution {
    public int[] reverseArray(int[] arr) {
        // Your code here
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        return arr;
    }
}`
      },
      solutionCode: {
        javascript: `function reverseArray(arr) {
  // Use two pointers approach
  let left = 0;
  let right = arr.length - 1;
  
  // Swap elements until pointers meet
  while (left < right) {
    // Swap elements at left and right indices
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  
  return arr;
}

// Time Complexity: O(n) - single pass through half the array
// Space Complexity: O(1) - in-place reversal, no extra space`,
        python: `def reverse_array(arr):
    # Use two pointers approach
    left = 0
    right = len(arr) - 1
    
    # Swap elements until pointers meet
    while left < right:
        # Swap elements at left and right indices
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    
    return arr

# Time Complexity: O(n) - single pass through half the array
# Space Complexity: O(1) - in-place reversal, no extra space`,
        java: `public class Solution {
    public int[] reverseArray(int[] arr) {
        // Use two pointers approach
        int left = 0;
        int right = arr.length - 1;
        
        // Swap elements until pointers meet
        while (left < right) {
            // Swap elements at left and right indices
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        
        return arr;
    }
}

// Time Complexity: O(n) - single pass through half the array
// Space Complexity: O(1) - in-place reversal, no extra space`
      },
      testCases: [
        { input: [1, 2, 3, 4, 5], expected: [5, 4, 3, 2, 1] },
        { input: [1, 2], expected: [2, 1] }
      ]
    }
  };

  const problem = problemData[problemId] || problemData['1'];
  const currentCode = code || problem.starterCode[selectedLanguage] || '';

  const handleRun = () => {
    setIsRunning(true);
    setShowOutput(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput('Code executed successfully!\nAll test cases passed.');
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsRunning(true);
    setShowOutput(true);
    // NOTE: This is currently static/simulated. In production, this would:
    // 1. Send code to backend for compilation/execution
    // 2. Run test cases against the solution
    // 3. Return actual results (pass/fail, execution time, etc.)
    // Simulate submission
    setTimeout(() => {
      setOutput('✓ All test cases passed!\n✓ Solution accepted.\nGreat job!');
      setIsRunning(false);
    }, 2000);
  };

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' }
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4 flex-shrink-0 w-full overflow-x-auto">
        <div className="flex items-center justify-between gap-2 md:gap-4 min-w-max md:min-w-0">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <button
              onClick={() => navigate(`/learning/arrays/${concept}`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs md:text-sm font-medium hidden sm:inline">Back to Concept</span>
            </button>
            <div className="h-6 w-px bg-gray-300 hidden md:block" />
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold text-gray-900 truncate">{problem.title}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                  problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {problem.difficulty}
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">Arrays • {concept}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View Solution Button */}
            {problem.solutionCode && (
              <button
                onClick={() => setIsSolutionModalOpen(true)}
                className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-xs md:text-sm hover:bg-gray-200 transition-all duration-200"
              >
                <Eye className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">View Solution</span>
              </button>
            )}
            {/* Glee Doubt Solver Button */}
            <button
              onClick={() => setIsDoubtSolverOpen(true)}
              className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-xs md:text-sm hover:shadow-lg transition-all duration-200"
            >
              <Sparkles className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Glee Doubt Solver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-0 h-full">
        {/* Mobile Toggle */}
        <div className="lg:hidden border-b border-gray-200 bg-white p-3 flex items-center justify-center gap-2 flex-shrink-0">
          <button
            onClick={() => setMobileView('question')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              mobileView === 'question'
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Question
          </button>
          <button
            onClick={() => setMobileView('code')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              mobileView === 'code'
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Code Editor
          </button>
        </div>

        {/* Left: Problem Description - Full Height Scrollable */}
        <div className={`${mobileView === 'question' ? 'flex' : 'hidden'} lg:flex w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gradient-to-br from-white to-gray-50 overflow-y-auto flex-col flex-1`}>
          <div className="p-4 md:p-6 flex-1 space-y-5">
            {/* Problem Title */}
            <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-sm">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{problem.title}</h2>
              <p className="text-gray-600 text-sm md:text-base">{problem.description.split('\n')[0]}</p>
            </div>

            {/* Example Section */}
            <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-600 to-amber-600 rounded-full"></div>
                <h3 className="text-sm md:text-base font-bold text-gray-900">Example</h3>
              </div>
              <div className="space-y-2 ml-2">
                {problem.description.match(/\*\*Example:\*\*([\s\S]*?)(?=\*\*|```|$)/)?.[1]?.split('\n').filter(line => line.trim()).map((line, idx) => (
                  <p key={idx} className="text-xs md:text-sm text-gray-700">{line.trim()}</p>
                )) || <p className="text-xs md:text-sm text-gray-600">Example input and output</p>}
              </div>
              <div className="bg-gray-900 rounded-lg p-3 mt-3 space-y-1.5">
                {problem.description.match(/```\n?([\s\S]*?)\n?```/)?.[1]?.split('\n').filter(line => line.trim()).map((line, idx) => (
                  <div key={idx} className="text-xs md:text-sm font-mono">
                    {line.includes('Input') && <span className="text-green-400">{line}</span>}
                    {line.includes('Output') && <span className="text-blue-400">{line}</span>}
                    {!line.includes('Input') && !line.includes('Output') && <span className="text-gray-400">{line}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints Section */}
            <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                <h3 className="text-sm md:text-base font-bold text-gray-900">Constraints</h3>
              </div>
              <ul className="space-y-2">
                {problem.description.match(/\*\*Constraints:\*\*([\s\S]*?)(?=\*\*|$)/)?.[1]?.split('\n').filter(line => line.trim().startsWith('-')).map((line, idx) => (
                  <li key={idx} className="flex items-start text-xs md:text-sm text-gray-700">
                    <span className="text-purple-600 mr-2 font-bold">•</span>
                    <span>{line.replace(/^-\s*/, '')}</span>
                  </li>
                )) || <li className="text-xs md:text-sm text-gray-600">No specific constraints listed</li>}
              </ul>
            </div>

            {/* Approach Section */}
            <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
                <h3 className="text-sm md:text-base font-bold text-gray-900">Approach</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                {problem.description.match(/\*\*Approach:\*\*([\s\S]*?)(?=\*\*|$)/)?.[1]?.trim() || 'Step-by-step approach to solve this problem'}
              </p>
            </div>

            {/* Test Cases */}
            <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
                <h3 className="text-sm md:text-base font-bold text-gray-900">Test Cases</h3>
              </div>
              <div className="space-y-3">
                {problem.testCases.map((testCase, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 md:p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-gray-800">Test Case {index + 1}</span>
                    </div>
                    <div className="space-y-1.5 ml-8">
                      <div className="text-xs md:text-sm">
                        <span className="text-gray-600">Input: </span>
                        <code className="bg-gray-900 text-green-400 px-2 py-1 rounded text-xs font-mono">{JSON.stringify(testCase.input)}</code>
                      </div>
                      <div className="text-xs md:text-sm">
                        <span className="text-gray-600">Expected: </span>
                        <code className="bg-gray-900 text-blue-400 px-2 py-1 rounded text-xs font-mono">{JSON.stringify(testCase.expected)}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className={`${mobileView === 'code' ? 'flex' : 'hidden'} lg:flex w-full lg:w-1/2 bg-white flex-col min-h-screen lg:min-h-0`}>
          {/* Editor Header */}
          <div className="border-b border-gray-200 p-3 md:p-4 flex items-center justify-between flex-shrink-0 flex-wrap gap-2 md:gap-0">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Code className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="w-32 md:w-40">
                <PurpleDropdown
                  options={languageOptions}
                  value={selectedLanguage}
                  onChange={(value) => {
                    setSelectedLanguage(value);
                    setCode(problem.starterCode[value] || '');
                  }}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRun}
                disabled={isRunning}
                className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-xs md:text-sm hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>Run</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isRunning}
                className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-xs md:text-sm hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Submit</span>
              </motion.button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Editor
              height="100%"
              language={selectedLanguage}
              theme="vs-light"
              value={currentCode}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: 'none',
              }}
            />
          </div>

          {/* Output Panel */}
          {showOutput && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              className="border-t border-gray-200 bg-gray-50"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Output</h3>
                  <button
                    onClick={() => setShowOutput(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="bg-white rounded-lg p-3 text-sm font-mono text-gray-800 whitespace-pre-line">
                  {output || 'No output yet. Click Run to execute your code.'}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* AI Doubt Solver */}
      <AIDoubtSolver 
        concept={problem.title} 
        isPractice={true}
        isOpen={isDoubtSolverOpen}
        onClose={() => setIsDoubtSolverOpen(false)}
      />

      {/* Solution Modal */}
      {isSolutionModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4"
          onClick={() => setIsSolutionModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] md:h-[80vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900">Solution</h2>
                <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">{problem.title}</p>
              </div>
              <button
                onClick={() => setIsSolutionModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex-shrink-0">
              <div className="w-40 md:w-48">
                <PurpleDropdown
                  options={languageOptions}
                  value={selectedLanguage}
                  onChange={(value) => setSelectedLanguage(value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 min-h-0 p-4 md:p-6 overflow-hidden">
              <Editor
                height="100%"
                language={selectedLanguage}
                theme="vs-light"
                value={problem.solutionCode?.[selectedLanguage] || ''}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 },
                  renderLineHighlight: 'none',
                  readOnly: true,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PracticePage;

