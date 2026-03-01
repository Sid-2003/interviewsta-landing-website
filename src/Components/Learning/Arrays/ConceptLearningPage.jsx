import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Code, 
  BookOpen,
  Play,
  MessageCircle,
  ChevronRight,
  Trophy,
  Video,
  X
} from 'lucide-react';
import AIDoubtSolver from './AIDoubtSolver';

const ConceptLearningPage = () => {
  const { concept } = useParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  // Static concept data
  const conceptData = {
    'core-patterns': {
      title: 'Core Patterns',
      description: 'Master the fundamental patterns and operations for working with arrays.',
      explanation: `Arrays are one of the most fundamental data structures in programming. Understanding core patterns is essential for solving array-based problems efficiently.

**Key Concepts:**
- Array traversal (forward, backward, bidirectional)
- Element access and modification
- Finding elements (linear search, binary search)
- Array initialization and manipulation
- Time and space complexity considerations

**Common Operations:**
1. **Iteration**: Loop through all elements
2. **Search**: Find specific elements or conditions
3. **Modification**: Update, insert, or delete elements
4. **Transformation**: Map, filter, or reduce operations`,
      patterns: [
        {
          name: 'Linear Traversal',
          description: 'Visit each element once in order',
          example: 'Finding maximum element, calculating sum'
        },
        {
          name: 'Two-Pass Technique',
          description: 'Process array in two separate passes',
          example: 'First pass: collect info, Second pass: use info'
        },
        {
          name: 'Index Mapping',
          description: 'Use array indices as part of the solution',
          example: 'Using indices to track positions or counts'
        }
      ],
      practiceProblems: [
        {
          id: 1,
          title: 'Find Maximum Element',
          difficulty: 'Easy',
          description: 'Given an array of integers, find the maximum element.',
          // videoSolution: null,
          starterCode: {
            javascript: `function findMax(arr) {
  // Your code here
  return 0;
}`,
            python: `def find_max(arr):
    # Your code here
    return 0`,
            java: `public int findMax(int[] arr) {
    // Your code here
    return 0;
}`
          }
        },
        {
          id: 2,
          title: 'Reverse Array',
          difficulty: 'Easy',
          description: 'Reverse the elements of an array in-place.',
          videoSolution: '/src/assets/Lectures/findMaxEle.mp4',
          starterCode: {
            javascript: `function reverseArray(arr) {
  // Your code here
  return arr;
}`,
            python: `def reverse_array(arr):
    # Your code here
    return arr`,
            java: `public int[] reverseArray(int[] arr) {
    // Your code here
    return arr;
}`
          }
        }
      ]
    },
    'two-pointers': {
      title: 'Two Pointers / Sliding Window',
      description: 'Efficient algorithms using two pointers and sliding window techniques.',
      explanation: `The two-pointer technique is a powerful approach for solving array problems efficiently. It involves using two pointers that traverse the array, often reducing time complexity from O(n²) to O(n).

**Key Learning Points:**
- When to use two pointers (sorted arrays, pairs, subarrays)
- Different pointer movement patterns
- Sliding window technique for subarray problems
- Time complexity optimization from O(n²) to O(n)

**Practice Approach:**
1. Understand when two pointers can optimize your solution
2. Master opposite ends and same direction patterns
3. Learn sliding window for subarray problems
4. Practice identifying two-pointer opportunities`,
      patterns: [
        {
          name: 'Opposite Ends',
          description: 'Two pointers start from opposite ends',
          example: 'Two Sum in sorted array, Palindrome check'
        },
        {
          name: 'Fast & Slow',
          description: 'One pointer moves faster than the other',
          example: 'Finding middle element, cycle detection'
        },
        {
          name: 'Sliding Window',
          description: 'Maintain a window of elements',
          example: 'Maximum sum subarray, longest substring'
        }
      ],
      practiceProblems: [
        {
          id: 1,
          title: 'Two Sum',
          difficulty: 'Easy',
          description: 'Given a sorted array and target, find two numbers that add up to target.',
          starterCode: {
            javascript: `function twoSum(arr, target) {
  // Your code here
  return [];
}`,
            python: `def two_sum(arr, target):
    # Your code here
    return []`,
            java: `public int[] twoSum(int[] arr, int target) {
    // Your code here
    return new int[0];
}`
          }
        }
      ]
    },
    'prefix-suffix': {
      title: 'Prefix / Suffix Techniques',
      description: 'Master prefix sums, suffix arrays, and cumulative techniques for efficient problem solving.',
      explanation: `Prefix and suffix techniques are powerful optimization strategies that precompute cumulative values to solve array problems efficiently. These techniques transform O(n²) solutions into O(n) by trading space for time.

**Key Learning Points:**
- Prefix sum arrays for range queries
- Suffix arrays for reverse cumulative operations
- Cumulative product and other aggregations
- Time and space complexity trade-offs

**Practice Approach:**
1. Understand when prefix/suffix can optimize your solution
2. Learn to identify range query patterns
3. Practice building prefix/suffix arrays
4. Master applying precomputed values to solve problems`,
      patterns: [
        {
          name: 'Prefix Sum',
          description: 'Cumulative sum from start to each index',
          example: 'Range sum queries, subarray sum problems'
        },
        {
          name: 'Suffix Sum',
          description: 'Cumulative sum from each index to end',
          example: 'Reverse range queries, suffix-based problems'
        },
        {
          name: 'Prefix Product',
          description: 'Cumulative product for multiplication problems',
          example: 'Product of subarrays, multiplicative queries'
        }
      ],
      practiceProblems: [
        {
          id: 1,
          title: 'Range Sum Query',
          difficulty: 'Medium',
          description: 'Given an array, answer multiple range sum queries efficiently.',
          starterCode: {
            javascript: `function rangeSum(arr, queries) {
  // Your code here
  return [];
}`,
            python: `def range_sum(arr, queries):
    # Your code here
    return []`,
            java: `public int[] rangeSum(int[] arr, int[][] queries) {
    // Your code here
    return new int[0];
}`
          }
        }
      ]
    },
    'kadane-family': {
      title: 'Kadane Family',
      description: 'Maximum subarray problems, Kadane\'s algorithm variations, and optimization techniques.',
      explanation: `Kadane's algorithm and its variations solve maximum subarray problems efficiently. These techniques find optimal contiguous subarrays by maintaining running maximums and making greedy decisions.

**Key Learning Points:**
- Classic Kadane's algorithm for maximum sum subarray
- Variations for different constraints (non-negative, circular, etc.)
- Greedy approach to subarray problems
- Dynamic programming thinking in arrays

**Practice Approach:**
1. Master the classic Kadane's algorithm
2. Understand the greedy decision-making process
3. Learn to adapt for different constraints
4. Practice identifying subarray optimization patterns`,
      patterns: [
        {
          name: 'Classic Kadane',
          description: 'Maximum sum contiguous subarray',
          example: 'Maximum subarray sum, best time to buy/sell stock'
        },
        {
          name: 'Circular Kadane',
          description: 'Maximum sum in circular array',
          example: 'Circular subarray problems, wrap-around arrays'
        },
        {
          name: 'Kadane with Constraints',
          description: 'Modified Kadane for specific requirements',
          example: 'Maximum sum with size limit, non-negative subarrays'
        }
      ],
      practiceProblems: [
        {
          id: 1,
          title: 'Maximum Subarray',
          difficulty: 'Medium',
          description: 'Find the contiguous subarray with the largest sum.',
          starterCode: {
            javascript: `function maxSubarray(arr) {
  // Your code here
  return 0;
}`,
            python: `def max_subarray(arr):
    # Your code here
    return 0`,
            java: `public int maxSubarray(int[] arr) {
    // Your code here
    return 0;
}`
          }
        }
      ]
    },
    'sorting-based': {
      title: 'Sorting-based Techniques',
      description: 'Problems solved using sorting, custom comparators, and order-based approaches.',
      explanation: `Many array problems become simpler when the array is sorted. Sorting-based techniques leverage ordering to enable efficient solutions using binary search, two pointers, or simple linear scans.

**Key Learning Points:**
- When sorting helps solve the problem
- Custom comparator functions for complex sorting
- Trade-offs between sorting and direct solving
- Time complexity considerations (O(n log n) vs O(n))

**Practice Approach:**
1. Identify when sorting simplifies the problem
2. Master custom comparators for complex objects
3. Learn to combine sorting with other techniques
4. Practice recognizing sortable problem patterns`,
      patterns: [
        {
          name: 'Sort Then Solve',
          description: 'Sort array first, then apply algorithm',
          example: 'Two sum, three sum, closest pair'
        },
        {
          name: 'Custom Comparator',
          description: 'Sort with custom ordering logic',
          example: 'Sort by multiple criteria, complex objects'
        },
        {
          name: 'Partial Sort',
          description: 'Sort only necessary elements',
          example: 'Kth largest, top K elements'
        }
      ],
      practiceProblems: [
        {
          id: 1,
          title: 'Two Sum',
          difficulty: 'Easy',
          description: 'Find two numbers that add up to target (sorting approach).',
          starterCode: {
            javascript: `function twoSum(arr, target) {
  // Your code here
  return [];
}`,
            python: `def two_sum(arr, target):
    # Your code here
    return []`,
            java: `public int[] twoSum(int[] arr, int target) {
    // Your code here
    return new int[0];
}`
          }
        }
      ]
    },
    'rearrangement': {
      title: 'Rearrangement & Partitioning',
      description: 'Array rearrangement, partitioning algorithms, and in-place transformations.',
      explanation: `Rearrangement and partitioning techniques modify array structure to meet specific requirements. These problems often require in-place operations and careful index management to achieve optimal space complexity.

**Key Learning Points:**
- In-place array modifications
- Partitioning algorithms (Dutch National Flag, etc.)
- Index manipulation and tracking
- Space-efficient transformations

**Practice Approach:**
1. Master in-place swapping techniques
2. Learn partitioning algorithms
3. Practice index management and tracking
4. Understand when rearrangement is necessary`,
      patterns: [
        {
          name: 'In-Place Swap',
          description: 'Rearrange elements using swaps',
          example: 'Move zeros to end, separate even/odd'
        },
        {
          name: 'Partitioning',
          description: 'Divide array into sections',
          example: 'Dutch National Flag, pivot partitioning'
        },
        {
          name: 'Cyclic Rearrangement',
          description: 'Rotate or cycle array elements',
          example: 'Array rotation, cyclic permutations'
        }
      ],
      practiceProblems: [
        {
          id: 1,
          title: 'Move Zeros',
          difficulty: 'Easy',
          description: 'Move all zeros to the end while maintaining relative order of non-zeros.',
          starterCode: {
            javascript: `function moveZeros(arr) {
  // Your code here
  return arr;
}`,
            python: `def move_zeros(arr):
    # Your code here
    return arr`,
            java: `public int[] moveZeros(int[] arr) {
    // Your code here
    return arr;
}`
          }
        }
      ]
    },
    'matrix-patterns': {
      title: 'Matrix Patterns',
      description: '2D array problems, matrix traversals, and multi-dimensional array techniques.',
      explanation: `Matrix problems extend array concepts to two dimensions. These problems require understanding traversal patterns, coordinate systems, and how to apply 1D array techniques to 2D structures.

**Key Learning Points:**
- Matrix traversal patterns (spiral, diagonal, etc.)
- Coordinate system navigation
- Applying 1D techniques to 2D
- Space and time complexity in 2D

**Practice Approach:**
1. Master different matrix traversal patterns
2. Learn to navigate 2D coordinate systems
3. Practice adapting 1D techniques to matrices
4. Understand matrix-specific optimizations`,
      patterns: [
        {
          name: 'Spiral Traversal',
          description: 'Traverse matrix in spiral order',
          example: 'Spiral matrix, print in spiral form'
        },
        {
          name: 'Diagonal Traversal',
          description: 'Traverse along diagonals',
          example: 'Diagonal sum, diagonal traversal'
        },
        {
          name: 'Row/Column Operations',
          description: 'Process rows or columns systematically',
          example: 'Matrix rotation, transpose, search'
        }
      ],
      practiceProblems: [
        {
          id: 1,
          title: 'Spiral Matrix',
          difficulty: 'Medium',
          description: 'Return all elements of the matrix in spiral order.',
          starterCode: {
            javascript: `function spiralOrder(matrix) {
  // Your code here
  return [];
}`,
            python: `def spiral_order(matrix):
    # Your code here
    return []`,
            java: `public List<Integer> spiralOrder(int[][] matrix) {
    // Your code here
    return new ArrayList<>();
}`
          }
        }
      ]
    }
  };

  // Default concept template
  const defaultConcept = {
    title: concept?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Concept',
    description: 'Learn and master this array concept through guided explanations and practice.',
    explanation: `This concept is an important part of array problem-solving. Understanding the patterns and techniques here will help you solve a wide range of array-based problems efficiently.

**Key Learning Points:**
- Fundamental principles
- Common patterns
- Best practices
- Time and space complexity considerations

**Practice Approach:**
1. Understand the core concept
2. Study the pattern breakdown
3. Solve practice problems
4. Review and reinforce`,
    patterns: [
      {
        name: 'Pattern 1',
        description: 'A fundamental pattern for this concept',
        example: 'Common use cases and examples'
      },
      {
        name: 'Pattern 2',
        description: 'Another important pattern',
        example: 'When and how to apply it'
      }
    ],
    practiceProblems: [
      {
        id: 1,
        title: 'Practice Problem 1',
        difficulty: 'Easy',
        description: 'A practice problem to reinforce your understanding.',
        starterCode: {
          javascript: `function solve(arr) {
  // Your code here
  return 0;
}`,
          python: `def solve(arr):
    # Your code here
    return 0`,
          java: `public int solve(int[] arr) {
    // Your code here
    return 0;
}`
        }
      }
    ]
  };

  const currentConcept = conceptData[concept] || defaultConcept;
  const allConcepts = [
    { id: 'core-patterns', title: 'Core Patterns' },
    { id: 'prefix-suffix', title: 'Prefix / Suffix' },
    { id: 'kadane-family', title: 'Kadane Family' },
    { id: 'two-pointers', title: 'Two Pointers' },
    { id: 'sorting-based', title: 'Sorting-based' },
    { id: 'rearrangement', title: 'Rearrangement' },
    { id: 'matrix-patterns', title: 'Matrix Patterns' }
  ];

  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Load completion status from localStorage
    const saved = localStorage.getItem('arrays-completion-status');
    if (saved) {
      try {
        const status = JSON.parse(saved);
        setIsCompleted(status[concept] || false);
      } catch (e) {
        console.error('Error parsing completion status:', e);
      }
    }
  }, [concept]);

  const handleMarkComplete = () => {
    const saved = localStorage.getItem('arrays-completion-status');
    let status = {};
    if (saved) {
      try {
        status = JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing completion status:', e);
      }
    }
    status[concept] = true;
    localStorage.setItem('arrays-completion-status', JSON.stringify(status));
    setIsCompleted(true);
  };

  const handlePracticeClick = (problemId) => {
    navigate(`/learning/arrays/${concept}/practice/${problemId}`);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      {/* Left Sidebar - Fixed */}
      <div className="w-full md:w-64 bg-white border-b md:border-r md:border-b-0 border-gray-200 flex-shrink-0 p-4 overflow-y-auto md:overflow-y-auto md:h-screen md:sticky md:top-0">
        <button
          onClick={() => navigate('/learning/arrays')}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Arrays</span>
        </button>

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Concepts
        </h3>
        <div className="space-y-1 overflow-x-auto md:overflow-x-visible flex md:flex-col pb-2 md:pb-0">
          {allConcepts.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/learning/arrays/${c.id}`)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal md:w-full text-left flex-shrink-0 md:flex-shrink ${
                concept === c.id
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto h-screen">
        <div className="w-full p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{currentConcept.title}</h1>
            <p className="text-base md:text-lg text-gray-600">{currentConcept.description}</p>
          </div>

          {/* Concept Explanation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8 mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Concept Explanation</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-base">
                {currentConcept.explanation.split(/\*\*(?:Key Concepts|Key Learning Points|Common Operations|Practice Approach):\*\*/)[0].trim()}
              </p>
              
              {/* Key Concepts or Key Learning Points */}
              {(currentConcept.explanation.includes('**Key Concepts:**') || currentConcept.explanation.includes('**Key Learning Points:**')) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                    {currentConcept.explanation.includes('**Key Concepts:**') ? 'Key Concepts' : 'Key Learning Points'}
                  </h3>
                  <ul className="space-y-2 ml-4">
                    {currentConcept.explanation
                      .split(/\*\*(?:Key Concepts|Key Learning Points):\*\*/)[1]
                      ?.split(/\*\*.*?\*\*:/)[0]
                      ?.split('\n')
                      .filter(line => line.trim().startsWith('-'))
                      .map((line, idx) => (
                        <li key={idx} className="text-gray-700 leading-relaxed flex items-start">
                          <span className="text-purple-600 mr-2 mt-1.5">•</span>
                          <span>{line.replace(/^-\s*/, '').trim()}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Common Operations */}
              {currentConcept.explanation.includes('**Common Operations:**') && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                    Common Operations
                  </h3>
                  <ol className="space-y-3 ml-4">
                    {currentConcept.explanation
                      .split('**Common Operations:**')[1]
                      ?.split(/\*\*.*?\*\*:/)[0]
                      ?.split('\n')
                      .filter(line => line.trim().match(/^\d+\./))
                      .map((line, idx) => {
                        const match = line.match(/^\d+\.\s*\*\*(.*?)\*\*:\s*(.*)/);
                        if (match) {
                          return (
                            <li key={idx} className="text-gray-700 leading-relaxed">
                              <span className="font-semibold text-purple-600">{match[1]}</span>
                              <span className="text-gray-600">: {match[2]}</span>
                            </li>
                          );
                        }
                        return (
                          <li key={idx} className="text-gray-700 leading-relaxed">
                            {line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '')}
                          </li>
                        );
                      })}
                  </ol>
                </div>
              )}

              {/* Practice Approach */}
              {currentConcept.explanation.includes('**Practice Approach:**') && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                    Practice Approach
                  </h3>
                  <ol className="space-y-3 ml-4">
                    {currentConcept.explanation
                      .split('**Practice Approach:**')[1]
                      ?.split('\n')
                      .filter(line => line.trim().match(/^\d+\./))
                      .map((line, idx) => {
                        const match = line.match(/^\d+\.\s*\*\*(.*?)\*\*:\s*(.*)/);
                        if (match) {
                          return (
                            <li key={idx} className="text-gray-700 leading-relaxed">
                              <span className="font-semibold text-purple-600">{match[1]}</span>
                              <span className="text-gray-600">: {match[2]}</span>
                            </li>
                          );
                        }
                        return (
                          <li key={idx} className="text-gray-700 leading-relaxed">
                            {line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '')}
                          </li>
                        );
                      })}
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Pattern Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Code className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Pattern Breakdown</h2>
            </div>
            <div className="space-y-4">
              {currentConcept.patterns.map((pattern, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-4 border-purple-500 pl-4 py-2"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{pattern.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{pattern.description}</p>
                  <p className="text-xs text-gray-500">Example: {pattern.example}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Important Questions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 flex-col md:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Important Questions</h2>
              </div>
            </div>
            <div className="space-y-4 w-full">
              {currentConcept.practiceProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="border-2 border-gray-200 rounded-lg p-3 md:p-4 hover:border-purple-500 transition-colors w-full overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3 flex-col md:flex-row gap-2">
                    <div className="flex-1 w-full">
                      <div className="flex items-center space-x-2 mb-2 flex-wrap gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">{problem.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{problem.description}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-stretch gap-2 pt-3 border-t border-gray-100 flex-col sm:flex-row">
                    {problem.videoSolution && (
                      <button
                        onClick={() => navigate(`/learning/arrays/${concept}/video/${problem.id}`)}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 min-h-10"
                      >
                        <Video className="h-4 w-4 flex-shrink-0" />
                        <span>Video Explanation</span>
                      </button>
                    )}
                    <button
                      onClick={() => handlePracticeClick(problem.id)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-shadow flex items-center justify-center space-x-2 min-h-10"
                    >
                      <Code className="h-4 w-4 flex-shrink-0" />
                      <span>Practice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mark Complete Section */}
          {!isCompleted && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to move on?</h3>
                  <p className="text-sm text-gray-600">Mark this concept as complete after reviewing the material</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMarkComplete}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Mark as Complete</span>
                </motion.button>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-6 mt-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Concept Completed!</h3>
                  <p className="text-sm text-gray-600">Great job mastering this concept</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Doubt Solver */}
      <AIDoubtSolver concept={currentConcept.title} />
    </div>
  );
};

export default ConceptLearningPage;

