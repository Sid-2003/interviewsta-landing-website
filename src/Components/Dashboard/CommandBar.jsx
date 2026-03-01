import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Target } from 'lucide-react';
import ComingSoonOverlay from '../Experimental/ComingSoonOverlay';

const CommandBar = ({ actions }) => {
  const primaryActions = actions.filter(a => 
    a.title !== "AI Coaching" && a.title !== "Take Practice Test"
  );
  const comingSoonActions = actions.filter(a => 
    a.title === "AI Coaching" || a.title === "Take Practice Test"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative group mb-8"
    >
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100/50 p-4 md:p-6 backdrop-blur-sm relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/10 to-purple-100/10 rounded-full blur-3xl" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 relative z-10">
          {primaryActions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.action}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center space-y-2 px-3 md:px-4 py-3 md:py-4 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 bg-gradient-to-r ${action.color} text-white hover:shadow-2xl relative overflow-hidden group/btn`}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <action.icon className="h-5 w-5 md:h-6 md:w-6 relative z-10" />
              <span className="text-center line-clamp-2 relative z-10">{action.title}</span>
            </motion.button>
          ))}
          {comingSoonActions.map((action, index) => (
            <ComingSoonOverlay key={index}>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (primaryActions.length + index) * 0.1 }}
                onClick={action.action}
                className="flex flex-col items-center justify-center space-y-2 px-3 md:px-4 py-3 md:py-4 rounded-xl font-semibold text-xs md:text-sm bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 border-2 border-gray-200 cursor-not-allowed hover:from-gray-200 hover:to-gray-300 transition-all duration-300 relative overflow-hidden"
              >
                <action.icon className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-center line-clamp-2">{action.title}</span>
              </motion.button>
            </ComingSoonOverlay>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CommandBar;

