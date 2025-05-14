import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ArrowRight, MessageSquare } from 'lucide-react';

interface FeedbackDisplayProps {
  feedback: string;
  isVisible: boolean;
  onContinue: () => void;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  feedback,
  isVisible,
  onContinue
}) => {
  const [typedFeedback, setTypedFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  // Typewriter effect for feedback
  useEffect(() => {
    if (!isVisible || !feedback) return;
    
    setTypedFeedback('');
    setIsComplete(false);
    
    let i = 0;
    const speed = 30; // typing speed in ms
    
    const typeWriter = () => {
      if (i < feedback.length) {
        setTypedFeedback(prev => prev + feedback.charAt(i));
        i++;
        setTimeout(typeWriter, speed);
      } else {
        setIsComplete(true);
      }
    };
    
    const timer = setTimeout(typeWriter, 500); // start after a small delay
    
    return () => clearTimeout(timer);
  }, [feedback, isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-lg p-6 mt-6"
    >
      <div className="flex items-start mb-4">
        <div className="bg-green-100 p-2 rounded-full text-green-600 mr-4">
          <MessageSquare size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Feedback from Neha</h3>
          <div className="min-h-[100px] text-gray-700 whitespace-pre-line">
            {typedFeedback}
            {!isComplete && <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-blink"></span>}
          </div>
        </div>
      </div>
      
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end mt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-colors"
          >
            Continue <ArrowRight size={16} className="ml-2" />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FeedbackDisplay;