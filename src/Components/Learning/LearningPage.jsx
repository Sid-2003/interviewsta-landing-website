import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import MyLearningSection from './MyLearningSection';
import LearningCategories from './LearningCategories';
import LearningAnalytics from './LearningAnalytics';

const LearningPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Hero Analytics Section - Top (Like Dashboard) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="mb-6"
        >
          <LearningAnalytics />
        </motion.div>

        {/* Section 1: My Learning */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: 'easeOut' }}
          className="mb-6"
        >
          <MyLearningSection />
        </motion.div>

        {/* Section 2: Learning Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
        >
          <LearningCategories />
        </motion.div>
      </div>
    </div>
  );
};

export default LearningPage;

