import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, HelpCircle } from 'lucide-react';
import { useSession } from '../context/SessionContext';

const ProgressTracker: React.FC = () => {
  const { 
    currentLevel, 
    remainingQuestions, 
    totalQuestions, 
    currentScenarioIndex 
  } = useSession();
  
  if (!currentLevel) return null;
  
  const progress = (currentScenarioIndex / totalQuestions) * 100;
  const completed = currentScenarioIndex;
  
  const getLevelColor = () => {
    switch (currentLevel) {
      case 'basic': return 'text-blue-600';
      case 'intermediate': return 'text-purple-600';
      case 'advanced': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  };
  
  const getLevelBgColor = () => {
    switch (currentLevel) {
      case 'basic': return 'bg-blue-100';
      case 'intermediate': return 'bg-purple-100';
      case 'advanced': return 'bg-orange-100';
      default: return 'bg-blue-100';
    }
  };
  
  const getLevelTextColor = () => {
    switch (currentLevel) {
      case 'basic': return 'text-blue-700';
      case 'intermediate': return 'text-purple-700';
      case 'advanced': return 'text-orange-700';
      default: return 'text-blue-700';
    }
  };
  
  const getLevelProgressColor = () => {
    switch (currentLevel) {
      case 'basic': return 'bg-blue-500';
      case 'intermediate': return 'bg-purple-500';
      case 'advanced': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`${getLevelBgColor()} p-2 rounded-full ${getLevelColor()} mr-3`}>
            {currentLevel === 'basic' && <HelpCircle size={16} />}
            {currentLevel === 'intermediate' && <Clock size={16} />}
            {currentLevel === 'advanced' && <CheckCircle size={16} />}
          </div>
          <span className={`font-medium ${getLevelTextColor()} capitalize`}>
            {currentLevel} Level
          </span>
        </div>
        
        <div className="text-sm text-gray-600">
          {remainingQuestions} question{remainingQuestions !== 1 ? 's' : ''} remaining
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <motion.div 
          className={`h-2.5 rounded-full ${getLevelProgressColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{completed} completed</span>
        <span>{totalQuestions} total</span>
      </div>
    </motion.div>
  );
};

export default ProgressTracker;