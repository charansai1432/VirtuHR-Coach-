import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceAssistant from './VoiceAssistant';
import FeedbackDisplay from './FeedbackDisplay';
import ProgressTracker from './ProgressTracker';
import { useSession } from '../context/SessionContext';
import { Scenario } from '../types';

interface ScenarioPlayerProps {
  onComplete: () => void;
}

const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({ onComplete }) => {
  const { getCurrentScenario, saveUserResponse, moveToNextScenario, remainingQuestions } = useSession();
  const [currentFeedback, setCurrentFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const voiceAssistantRef = useRef<{ speakFeedback: (text: string) => void } | null>(null);
  
  const currentScenario = getCurrentScenario();
  
  const handleResponseComplete = useCallback(async (response: string) => {
    if (!currentScenario) return;
    
    try {
      const feedback = await saveUserResponse(response);
      setCurrentFeedback(feedback);
      setShowFeedback(true);
      
      // Speak the feedback
      if (voiceAssistantRef.current) {
        voiceAssistantRef.current.speakFeedback(feedback);
      }
    } catch (error) {
      console.error('Error saving response:', error);
    }
  }, [currentScenario, saveUserResponse]);
  
  const handleContinue = useCallback(() => {
    setShowFeedback(false);
    setCurrentFeedback('');
    
    if (remainingQuestions <= 0) {
      onComplete();
    } else {
      moveToNextScenario();
    }
  }, [moveToNextScenario, onComplete, remainingQuestions]);
  
  if (!currentScenario) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No more scenarios available</p>
        <button
          onClick={onComplete}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-colors"
        >
          Complete Session
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <ProgressTracker />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScenario._id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <VoiceAssistant
            ref={voiceAssistantRef}
            question={currentScenario.question}
            onResponseComplete={handleResponseComplete}
            isActive={!showFeedback}
          />
          
          <FeedbackDisplay
            feedback={currentFeedback}
            isVisible={showFeedback}
            onContinue={handleContinue}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ScenarioPlayer;