import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, Users, Brain, Mic, MessageSquare, Target } from 'lucide-react';

// Import all templates
import TechnicalFeedbackTemplate from './TechnicalFeedbackTemplate';
import HRFeedbackTemplate from './HRFeedbackTemplate';
import CaseStudyFeedbackTemplate from './CaseStudyFeedbackTemplate';
import CommunicationFeedbackTemplate from './CommunicationFeedbackTemplate';
import DebateFeedbackTemplate from './DebateFeedbackTemplate';

// Mock data generator
const generateMockData = (type) => {
  const baseData = {
    overall_score: Math.floor(Math.random() * 20) + 75, // 75-95
    interview_test_details: {
      interview_title: `${type} - Test Session`,
      interview_mode: type,
      created_at: new Date().toISOString(),
    },
    feedback_summary: {
      strengths: [
        'Demonstrated strong analytical thinking and problem-solving abilities',
        'Excellent communication skills with clear articulation of ideas',
        'Good understanding of core concepts and fundamentals',
      ],
      areas_of_improvements: [
        'Could improve on handling edge cases and error scenarios',
        'Time management during complex problem-solving needs work',
        'More practice needed with advanced optimization techniques',
      ],
    },
    interaction_log: [
      { question: 'Tell me about yourself and your background.', timestamp: '00:00' },
      { answer: 'I have 3 years of experience in software development, specializing in full-stack web applications. I enjoy solving complex problems and building scalable systems.', timestamp: '00:15' },
      { question: 'Can you explain how you would approach this problem?', timestamp: '01:30' },
      { answer: 'I would start by understanding the requirements, then break down the problem into smaller components. I\'d consider edge cases and optimize for performance.', timestamp: '02:00' },
      { question: 'What challenges have you faced in your previous projects?', timestamp: '03:45' },
      { answer: 'One major challenge was scaling our database to handle increased traffic. We implemented caching strategies and optimized our queries.', timestamp: '04:15' },
    ],
    interaction_status_log: [
      { answer_status: 'correct answer', comment: 'Well-structured response with good examples' },
      { answer_status: 'partially-correct answer', comment: 'Good approach but missed some edge cases' },
      { answer_status: 'correct answer', comment: 'Excellent problem-solving methodology' },
    ],
    soft_skill_summary: {
      confidence: Math.floor(Math.random() * 15) + 80,
    },
  };

  // Type-specific data
  switch (type) {
    case 'Technical Interview':
    case 'Coding Interview':
    case 'Role-Based Interview':
      return {
        ...baseData,
        detailed_scores: {
          'Technical Skills': {
            score: Math.floor(Math.random() * 20) + 75,
            breakdown: {
              'Programming Language': Math.floor(Math.random() * 20) + 75,
              'Framework': Math.floor(Math.random() * 20) + 70,
              'Algorithms': Math.floor(Math.random() * 20) + 80,
              'Data Structures': Math.floor(Math.random() * 20) + 85,
            },
          },
          'Problem Solving': {
            score: Math.floor(Math.random() * 20) + 70,
            breakdown: {
              'Approach': Math.floor(Math.random() * 20) + 75,
              'Optimization': Math.floor(Math.random() * 20) + 70,
              'Debugging': Math.floor(Math.random() * 20) + 80,
              'Syntax': Math.floor(Math.random() * 20) + 85,
            },
          },
        },
        skills_scores: [
          { name: 'Programming Language', score: 78 },
          { name: 'Framework', score: 72 },
          { name: 'Algorithms', score: 82 },
          { name: 'Data Structures', score: 87 },
          { name: 'Approach', score: 76 },
          { name: 'Optimization', score: 71 },
        ],
        sub_scores: {
          'Technical Skills': { percentile: 82, total_participants: 1500 },
          'Problem Solving': { percentile: 78, total_participants: 1500 },
        },
      };

    case 'HR Interview':
      return {
        ...baseData,
        detailed_scores: {
          'Communication Skills': {
            score: Math.floor(Math.random() * 20) + 75,
            breakdown: {
              'Clarity': Math.floor(Math.random() * 20) + 80,
              'Confidence': Math.floor(Math.random() * 20) + 85,
              'Structure': Math.floor(Math.random() * 20) + 75,
              'Engagement': Math.floor(Math.random() * 20) + 78,
            },
          },
          'Cultural Fit': {
            score: Math.floor(Math.random() * 20) + 70,
            breakdown: {
              'Values': Math.floor(Math.random() * 20) + 82,
              'Teamwork': Math.floor(Math.random() * 20) + 88,
              'Growth': Math.floor(Math.random() * 20) + 75,
              'Initiative': Math.floor(Math.random() * 20) + 80,
            },
          },
        },
        sub_scores: {
          'Communication Skills': { percentile: 85, total_participants: 2000 },
          'Cultural Fit': { percentile: 80, total_participants: 2000 },
        },
      };

    case 'Case Study Interview':
      return {
        ...baseData,
        detailed_scores: {
          'Analytical Skills': {
            score: Math.floor(Math.random() * 20) + 75,
            breakdown: {
              'Problem Identification': Math.floor(Math.random() * 20) + 80,
              'Data Interpretation': Math.floor(Math.random() * 20) + 75,
              'Logical Reasoning': Math.floor(Math.random() * 20) + 82,
              'Solution Framework': Math.floor(Math.random() * 20) + 78,
            },
          },
          'Business Impact': {
            score: Math.floor(Math.random() * 20) + 70,
            breakdown: {
              'Strategic Thinking': Math.floor(Math.random() * 20) + 85,
              'ROI Analysis': Math.floor(Math.random() * 20) + 72,
              'Risk Assessment': Math.floor(Math.random() * 20) + 78,
              'Recommendations': Math.floor(Math.random() * 20) + 80,
            },
          },
        },
        sub_scores: {
          'Analytical Skills': { percentile: 83, total_participants: 1200 },
          'Business Impact': { percentile: 79, total_participants: 1200 },
        },
      };

    case 'Communication Interview':
      return {
        ...baseData,
        detailed_scores: {
          'Speaking Skills': {
            score: Math.floor(Math.random() * 20) + 75,
            breakdown: {
              fluency_score: Math.floor(Math.random() * 20) + 80,
              pronunciation_score: Math.floor(Math.random() * 20) + 85,
              vocabulary_range_score: Math.floor(Math.random() * 20) + 75,
              sentence_construction_score: Math.floor(Math.random() * 20) + 78,
            },
          },
          'Comprehension Skills': {
            score: Math.floor(Math.random() * 20) + 70,
            breakdown: {
              listening_comprehension_score: Math.floor(Math.random() * 20) + 82,
              reading_comprehension_score: Math.floor(Math.random() * 20) + 88,
              contextual_understanding_score: Math.floor(Math.random() * 20) + 75,
              response_relevance_score: Math.floor(Math.random() * 20) + 80,
            },
          },
        },
        sub_scores: {
          'Speaking Skills': { percentile: 84, total_participants: 1800 },
          'Comprehension Skills': { percentile: 81, total_participants: 1800 },
        },
        mcq_results: [
          { question: 'What is the main idea of the passage?', user_answer: 'A', correct_answer: 'A', is_correct: true },
          { question: 'Which word best describes the tone?', user_answer: 'B', correct_answer: 'C', is_correct: false },
          { question: 'What can be inferred from the text?', user_answer: 'C', correct_answer: 'C', is_correct: true },
          { question: 'The author\'s purpose is to:', user_answer: 'D', correct_answer: 'D', is_correct: true },
          { question: 'According to the passage:', user_answer: 'A', correct_answer: 'B', is_correct: false },
        ],
      };

    case 'Debate Interview':
      return {
        ...baseData,
        detailed_scores: {
          'Argumentation Skills': {
            score: Math.floor(Math.random() * 20) + 75,
            breakdown: {
              argument_structure_score: Math.floor(Math.random() * 20) + 80,
              evidence_usage_score: Math.floor(Math.random() * 20) + 85,
              logical_reasoning_score: Math.floor(Math.random() * 20) + 75,
              counterargument_handling_score: Math.floor(Math.random() * 20) + 78,
            },
          },
          'Persuasion Skills': {
            score: Math.floor(Math.random() * 20) + 70,
            breakdown: {
              persuasiveness_score: Math.floor(Math.random() * 20) + 82,
              rhetorical_skills_score: Math.floor(Math.random() * 20) + 88,
              audience_awareness_score: Math.floor(Math.random() * 20) + 75,
              conclusion_strength_score: Math.floor(Math.random() * 20) + 80,
            },
          },
        },
        sub_scores: {
          'Argumentation Skills': { percentile: 86, total_participants: 900 },
          'Persuasion Skills': { percentile: 82, total_participants: 900 },
        },
        round_scores: [
          { round: 'Round 1', argumentation: 75, persuasion: 72 },
          { round: 'Round 2', argumentation: 80, persuasion: 78 },
          { round: 'Round 3', argumentation: 85, persuasion: 82 },
          { round: 'Round 4', argumentation: 88, persuasion: 85 },
        ],
      };

    default:
      return baseData;
  }
};

// Interview types configuration
const INTERVIEW_TYPES = [
  { id: 'Technical Interview', name: 'Technical', icon: Code, color: 'from-orange-500 to-red-600', component: TechnicalFeedbackTemplate },
  { id: 'Coding Interview', name: 'Coding', icon: Code, color: 'from-amber-500 to-orange-600', component: TechnicalFeedbackTemplate },
  { id: 'Role-Based Interview', name: 'Role-Based', icon: Code, color: 'from-indigo-500 to-purple-600', component: TechnicalFeedbackTemplate },
  { id: 'HR Interview', name: 'HR', icon: Users, color: 'from-green-500 to-teal-600', component: HRFeedbackTemplate },
  { id: 'Case Study Interview', name: 'Case Study', icon: Brain, color: 'from-amber-500 to-yellow-600', component: CaseStudyFeedbackTemplate },
  { id: 'Communication Interview', name: 'Communication', icon: Mic, color: 'from-cyan-500 to-blue-600', component: CommunicationFeedbackTemplate },
  { id: 'Debate Interview', name: 'Debate', icon: MessageSquare, color: 'from-red-500 to-rose-600', component: DebateFeedbackTemplate },
];

const FeedbackTemplateTest = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(INTERVIEW_TYPES[0]);
  const [mockData, setMockData] = useState(() => generateMockData(INTERVIEW_TYPES[0].id));

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setMockData(generateMockData(type.id));
  };

  const SelectedComponent = selectedType.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sticky Header with Type Selector */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-gray-200 shadow-lg">
        <div className="w-full px-4 sm:px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Back button */}
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </motion.button>

            {/* Title */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Feedback Template Test Page
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Analyze structure and design of all interview templates
              </p>
            </div>

            {/* Regenerate button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMockData(generateMockData(selectedType.id))}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Regenerate Data
            </motion.button>
          </div>

          {/* Type selector tabs */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {INTERVIEW_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = selectedType.id === type.id;
              return (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTypeChange(type)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{type.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Template Preview */}
      <div className="py-8">
        <SelectedComponent feedbackData={mockData} interviewType={selectedType.id} />
      </div>
    </div>
  );
};

export default FeedbackTemplateTest;
