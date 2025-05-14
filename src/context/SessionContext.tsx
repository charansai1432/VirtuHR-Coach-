import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Scenario, Session, UserState } from '../types';
import { createSession, fetchScenarios, getScenarioCount, saveResponse } from '../services/api';

interface SessionContextType {
  userId: string;
  currentLevel: string | null;
  currentSession: Session | null;
  scenarios: Scenario[];
  currentScenarioIndex: number;
  completedScenarios: string[];
  remainingQuestions: number;
  totalQuestions: number;
  isSessionActive: boolean;
  startSession: (level: string) => Promise<void>;
  endSession: () => Promise<void>;
  getCurrentScenario: () => Scenario | null;
  saveUserResponse: (response: string) => Promise<string>;
  moveToNextScenario: () => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId] = useState<string>(() => {
    const savedUserId = localStorage.getItem('userId');
    return savedUserId || uuidv4();
  });
  
  const [state, setState] = useState<UserState>({
    id: userId,
    completedScenarios: []
  });
  
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  
  useEffect(() => {
    // Save user ID to local storage
    localStorage.setItem('userId', userId);
  }, [userId]);
  
  const startSession = async (level: string) => {
    try {
      // Fetch count of questions in the level
      const count = await getScenarioCount(level);
      setTotalQuestions(count);
      
      // Create a new session
      const newSession = await createSession(userId, level);
      
      // Fetch scenarios for the selected level
      const levelScenarios = await fetchScenarios(level);
      
      // Randomly select scenarios if there are more than needed
      const shuffledScenarios = levelScenarios.sort(() => Math.random() - 0.5);
      
      setCurrentLevel(level);
      setScenarios(shuffledScenarios);
      setCurrentScenarioIndex(0);
      setState(prev => ({
        ...prev,
        currentSession: newSession,
        completedScenarios: []
      }));
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };
  
  const endSession = async () => {
    // Implementation for ending session
    setCurrentLevel(null);
    return Promise.resolve();
  };
  
  const getCurrentScenario = (): Scenario | null => {
    if (!scenarios.length || currentScenarioIndex >= scenarios.length) {
      return null;
    }
    return scenarios[currentScenarioIndex];
  };
  
  const saveUserResponse = async (response: string): Promise<string> => {
    if (!state.currentSession || !getCurrentScenario()) {
      throw new Error('No active session or scenario');
    }
    
    const currentScenario = getCurrentScenario()!;
    
    try {
      const result = await saveResponse(
        state.currentSession._id,
        currentScenario._id,
        response,
        currentScenario.question
      );
      
      // Add scenario to completed list
      setState(prev => ({
        ...prev,
        completedScenarios: [...prev.completedScenarios, currentScenario._id]
      }));
      
      return result.feedback;
    } catch (error) {
      console.error('Error saving response:', error);
      throw error;
    }
  };
  
  const moveToNextScenario = () => {
    setCurrentScenarioIndex(prev => prev + 1);
  };
  
  const resetSession = () => {
    setCurrentLevel(null);
    setScenarios([]);
    setCurrentScenarioIndex(0);
    setState(prev => ({
      ...prev,
      currentSession: undefined,
      completedScenarios: []
    }));
  };
  
  return (
    <SessionContext.Provider
      value={{
        userId,
        currentLevel,
        currentSession: state.currentSession || null,
        scenarios,
        currentScenarioIndex,
        completedScenarios: state.completedScenarios,
        remainingQuestions: totalQuestions - (currentScenarioIndex + 1),
        totalQuestions,
        isSessionActive: !!state.currentSession,
        startSession,
        endSession,
        getCurrentScenario,
        saveUserResponse,
        moveToNextScenario,
        resetSession
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};