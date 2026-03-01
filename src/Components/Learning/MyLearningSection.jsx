import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import ActiveCourseCard from '../Dashboard/ActiveCourseCard';

const MyLearningSection = () => {
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    // Navigate to Arrays learning hub when Arrays card is clicked
    if (item.title === 'Arrays') {
      navigate('/learning/arrays');
    }
    // Add more navigation logic for other cards as needed
  };
  // Mock data - Arrays is the active learning module with study plan binding
  const myLearningItems = [
    {
      id: 1,
      title: 'Arrays',
      category: 'DSA Topics',
      progress: 75,
      status: 'In Progress',
      isActive: true,
      description: 'Master array manipulation and problem-solving',
      studyPlanPercentage: 75,
      currentTopic: 'Find Max Element'
    },
    {
      id: 2,
      title: 'Java + DSA',
      category: 'Programming Languages',
      progress: 45,
      status: 'In Progress',
      isActive: false,
      description: 'Learn Java fundamentals and data structures',
      studyPlanPercentage: 45,
      currentTopic: 'Collections'
    },
    {
      id: 3,
      title: 'React Fundamentals',
      category: 'Frontend Development',
      progress: 90,
      status: 'In Progress',
      isActive: false,
      description: 'Build modern web applications with React',
      studyPlanPercentage: 90,
      currentTopic: 'Hooks & State'
    },
    {
      id: 4,
      title: 'System Design Basics',
      category: 'System Design',
      progress: 100,
      status: 'Completed',
      isActive: false,
      description: 'Design scalable and efficient systems',
      studyPlanPercentage: 100,
      currentTopic: 'Completed'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">My Learning</h2>
          <p className="text-sm text-gray-600">Continue where you left off</p>
        </div>
     
     
      </div>

      {/* Active Course Card */}
      <ActiveCourseCard />
    </div>
  );
};

export default MyLearningSection;

