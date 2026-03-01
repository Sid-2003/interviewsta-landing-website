import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Award, 
  CheckCircle, 
  X, 
  BookOpen,
  Target,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const WrittenTests = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTest, setActiveTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);

  const categories = [
    { id: 'all', label: 'All Categories', count: 24 },
    { id: 'technical', label: 'Technical', count: 12 },
    { id: 'behavioral', label: 'Behavioral', count: 8 },
    { id: 'system-design', label: 'System Design', count: 4 }
  ];

  const tests = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      category: 'technical',
      difficulty: 'Easy',
      questions: 20,
      duration: 30,
      description: 'Test your knowledge of JavaScript basics, ES6 features, and core concepts.',
      topics: ['Variables', 'Functions', 'Objects', 'Arrays', 'ES6']
    },
    {
      id: 2,
      title: 'React Development',
      category: 'technical',
      difficulty: 'Medium',
      questions: 25,
      duration: 45,
      description: 'Comprehensive test covering React hooks, components, and state management.',
      topics: ['Components', 'Hooks', 'State', 'Props', 'Context']
    },
    {
      id: 3,
      title: 'System Design Principles',
      category: 'system-design',
      difficulty: 'Hard',
      questions: 15,
      duration: 60,
      description: 'Advanced concepts in system architecture and scalable design patterns.',
      topics: ['Scalability', 'Databases', 'Caching', 'Load Balancing']
    },
    {
      id: 4,
      title: 'Behavioral Assessment',
      category: 'behavioral',
      difficulty: 'Medium',
      questions: 18,
      duration: 35,
      description: 'Evaluate your soft skills and situational judgment capabilities.',
      topics: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork']
    }
  ];

  const sampleQuestions = [
    {
      question: "What is the correct way to declare a variable in JavaScript ES6?",
      options: [
        "var myVariable = 'value';",
        "let myVariable = 'value';",
        "const myVariable = 'value';",
        "Both let and const are correct"
      ],
      correct: 3
    },
    {
      question: "Which React hook is used for side effects?",
      options: [
        "useState",
        "useEffect",
        "useContext",
        "useReducer"
      ],
      correct: 1
    }
  ];

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  const startTest = (testId) => {
    setActiveTest(testId);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  const submitAnswer = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Test completed
        setActiveTest(null);
        alert('Test completed! Results will be displayed here.');
      }
    }
  };

  if (activeTest) {
    const question = sampleQuestions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Test Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">JavaScript Fundamentals</h1>
                <p className="text-gray-600">Question {currentQuestion + 1} of {sampleQuestions.length}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-orange-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">23:45</span>
                </div>
                <button
                  onClick={() => setActiveTest(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {question.question}
            </h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {currentQuestion === sampleQuestions.length - 1 ? 'Submit Test' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Written Tests</h1>
          <p className="text-gray-600 mt-2">Test your knowledge with AI-powered assessments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Tests Completed', value: '12', icon: CheckCircle, color: 'text-green-600' },
            { title: 'Average Score', value: '85%', icon: TrendingUp, color: 'text-blue-600' },
            { title: 'Time Saved', value: '24h', icon: Clock, color: 'text-purple-600' },
            { title: 'Certificates', value: '3', icon: Award, color: 'text-orange-600' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {test.difficulty}
                  </span>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{test.questions}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{test.duration}m</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{test.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {test.topics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => startTest(test.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Results */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Results</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: 'JavaScript Fundamentals', score: 85, date: '2024-01-15', status: 'passed' },
                  { name: 'React Development', score: 78, date: '2024-01-12', status: 'passed' },
                  { name: 'System Design', score: 65, date: '2024-01-10', status: 'review' }
                ].map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        result.status === 'passed' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {result.status === 'passed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <RefreshCw className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{result.name}</h3>
                        <p className="text-sm text-gray-600">{result.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{result.score}%</div>
                      <div className={`text-sm ${
                        result.status === 'passed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {result.status === 'passed' ? 'Passed' : 'Needs Review'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrittenTests;