import React from 'react';
import { motion } from 'framer-motion';
import { Mic, FileText, CheckCircle, MessageSquare, User } from 'lucide-react';

const CommunicationPhaseIndicator = ({ currentPhase, phaseProgress }) => {
  const phases = [
    { id: 'Greeting', label: 'Greeting', icon: MessageSquare, color: 'blue' },
    { id: 'Rapport', label: 'Rapport Building', icon: User, color: 'purple' },
    { id: 'PersonalDetails', label: 'Personal Details', icon: User, color: 'pink' },
    { id: 'Speaking', label: 'Speaking', icon: Mic, color: 'green' },
    { id: 'Comprehension', label: 'Writing', icon: FileText, color: 'orange' },
    { id: 'MCQ', label: 'Vocabulary', icon: CheckCircle, color: 'indigo' },
  ];

  
  const getPhaseIndex = (phase) => {
    return phases.findIndex(p => p.id === phase) + 1;
  };

  const currentIndex = getPhaseIndex(currentPhase);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-4 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const isActive = currentIndex === index + 1;
          const isCompleted = currentIndex > index + 1;
          const isPending = currentIndex < index + 1;

          return (
            <React.Fragment key={phase.id}>
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: isActive ? 1.1 : isCompleted ? 1 : 0.9,
                    opacity: isPending ? 0.5 : 1
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `bg-${phase.color}-500 text-white shadow-lg`
                      : isCompleted
                      ? `bg-${phase.color}-300 text-white`
                      : `bg-gray-200 text-gray-400`
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <span className={`text-xs mt-2 font-medium ${
                  isActive
                    ? `text-${phase.color}-600`
                    : isCompleted
                    ? `text-${phase.color}-500`
                    : 'text-gray-400'
                }`}>
                  {phase.label}
                </span>
              </div>
              {index < phases.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  isCompleted ? `bg-${phase.color}-300` : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CommunicationPhaseIndicator;
