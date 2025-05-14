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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [hasSpokenQuestion, setHasSpokenQuestion] = useState(false);
  const [responseSubmitted, setResponseSubmitted] = useState(false);

  // Speak the question when component becomes active
  useEffect(() => {
    if (isActive && !hasSpokenQuestion) {
      speakQuestion();
    }
  }, [isActive, hasSpokenQuestion]);

  // Reset state when question changes
  useEffect(() => {
    setUserResponse('');
    setResponseSubmitted(false);
    setHasSpokenQuestion(false);
  }, [question]);

  const speakQuestion = useCallback(() => {
    setIsSpeaking(true);
    speechService.speak(question, () => {
      setIsSpeaking(false);
      setHasSpokenQuestion(true);
    });
  }, [question]);

  const startListening = useCallback(() => {
    if (!isActive || responseSubmitted) return;

    setIsListening(true);
    speechService.startListening(
      (text) => {
        setUserResponse(text);
      },
      () => {
        setIsListening(false);
      }
    );
  }, [isActive, responseSubmitted]);

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

  const handleSubmit = () => {
    if (userResponse.trim().length > 0) {
      onResponseComplete(userResponse);
      setResponseSubmitted(true);
    }
  };

  const replayQuestion = useCallback(() => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      speakQuestion();
    }
  }, [isSpeaking, speakQuestion]);

  useEffect(() => {
    return () => {
      speechService.stopListening();
      speechService.stopSpeaking();
    };
  }, []);

  const speakFeedback = useCallback(
    (feedback: string) => {
      setIsSpeaking(true);
      speechService.speak(feedback, () => {
        setIsSpeaking(false);
        if (onFeedbackPlayed) {
          onFeedbackPlayed();
        }
      });
    },
    [onFeedbackPlayed]
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
                  aria-label={isSpeaking ? 'Stop speaking' : 'Replay question'}
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
                disabled={isSpeaking || responseSubmitted}
                className={`
                  flex items-center justify-center p-4 rounded-full shadow-md
                  ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}
                  ${
                    isSpeaking || responseSubmitted
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }
                  text-white transition-all duration-300
                `}
                aria-label={isListening ? 'Stop recording' : 'Start recording'}
              >
                {isListening ? (
                  <MicOff size={28} className="animate-pulse" />
                ) : (
                  <Mic size={28} />
                )}
              </motion.button>
            </div>

            {userResponse && !isListening && !responseSubmitted && (
              <>
                <div className="text-center mt-4 text-sm text-gray-600">
                  If you're satisfied with your answer, click <strong>Submit Response</strong>.
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                  >
                    Submit Response
                  </button>
                </div>
              </>
            )}

            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-4 text-sm text-gray-600"
              >
                Listening... Speak your response
              </motion.div>
            )}

            {!isListening && !userResponse && hasSpokenQuestion && !responseSubmitted && (
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
