import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { speechService } from '../services/speechService';

interface VoiceAssistantProps {
  question: string;
  onResponseComplete: (response: string) => void;
  onFeedbackPlayed?: () => void;
  isActive: boolean;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  question,
  onResponseComplete,
  onFeedbackPlayed,
  isActive
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [userResponse, setUserResponse] = useState<string>('');
  const [hasSpokenQuestion, setHasSpokenQuestion] = useState<boolean>(false);
  
  // Speak the question when component becomes active
  useEffect(() => {
    if (isActive && !hasSpokenQuestion) {
      speakQuestion();
    }
  }, [isActive, hasSpokenQuestion]);
  
  const speakQuestion = useCallback(() => {
    setIsSpeaking(true);
    speechService.speak(question, () => {
      setIsSpeaking(false);
      setHasSpokenQuestion(true);
    });
  }, [question]);
  
  const startListening = useCallback(() => {
    if (!isActive) return;
    
    setIsListening(true);
    speechService.startListening(
      (text) => {
        setUserResponse(text);
      },
      () => {
        setIsListening(false);
        // Auto-submit after stopping listening if we have a response
        if (userResponse.trim().length > 0) {
          // onResponseComplete(userResponse);
        }
      }
    );
  }, [isActive, onResponseComplete, userResponse]);
  
  const stopListening = useCallback(() => {
    setIsListening(false);
    speechService.stopListening();
  }, []);
  
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);
  
  const replayQuestion = useCallback(() => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakQuestion();
    }
  }, [isSpeaking, speakQuestion]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      speechService.stopListening();
      speechService.stopSpeaking();
    };
  }, []);
  
  const speakFeedback = useCallback((feedback: string) => {
    setIsSpeaking(true);
    speechService.speak(feedback, () => {
      setIsSpeaking(false);
      if (onFeedbackPlayed) {
        onFeedbackPlayed();
      }
    });
  }, [onFeedbackPlayed]);
  
  // Expose the speakFeedback function through a ref
  React.useImperativeHandle(
    React.createRef(),
    () => ({
      speakFeedback
    })
  );
  
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Neha (AI Coach)</h3>
                <button
                  onClick={replayQuestion}
                  className={`p-2 rounded-full transition-colors ${
                    isSpeaking 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  aria-label={isSpeaking ? "Stop speaking" : "Replay question"}
                >
                  {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg mb-4">
                <p className="text-gray-700">{question}</p>
              </div>
              
              {userResponse && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Your Response:</h4>
                  <p className="text-gray-600">{userResponse}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                disabled={isSpeaking}
                className={`
                  flex items-center justify-center p-4 rounded-full shadow-md
                  ${isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'}
                  ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}
                  text-white transition-all duration-300
                `}
                aria-label={isListening ? "Stop recording" : "Start recording"}
              >
                {isListening ? (
                  <MicOff size={28} className="animate-pulse" />
                ) : (
                  <Mic size={28} />
                )}
              </motion.button>
            </div>
            
            {isListening && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-4 text-sm text-gray-600"
              >
                Listening... Speak your response
              </motion.div>
            )}
            
            {!isListening && !userResponse && hasSpokenQuestion && (
              <div className="text-center mt-4 text-sm text-gray-600">
                Click the microphone to start speaking
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceAssistant;