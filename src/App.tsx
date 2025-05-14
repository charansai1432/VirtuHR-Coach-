import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DifficultySelector from './components/DifficultySelector';
import ScenarioPlayer from './components/ScenarioPlayer';
import SessionSummary from './components/SessionSummary';
import { SessionProvider, useSession } from './context/SessionContext';

enum AppState {
  SELECTION,
  PLAYING,
  SUMMARY
}

const AppContent: React.FC = () => {
  const { isSessionActive, currentLevel, endSession } = useSession();
  const [appState, setAppState] = useState<AppState>(
    isSessionActive ? AppState.PLAYING : AppState.SELECTION
  );
  
  // Watch for session changes
  React.useEffect(() => {
    if (isSessionActive && appState === AppState.SELECTION) {
      setAppState(AppState.PLAYING);
    }
  }, [isSessionActive, appState]);
  
  const handleSessionComplete = async () => {
    await endSession();
    setAppState(AppState.SUMMARY);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-blue-600">Virtual HR Coach</span>
          </div>
          {currentLevel && (
            <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
              {currentLevel} Level
            </div>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {appState === AppState.SELECTION && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DifficultySelector />
            </motion.div>
          )}
          
          {appState === AppState.PLAYING && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScenarioPlayer onComplete={handleSessionComplete} />
            </motion.div>
          )}
          
          {appState === AppState.SUMMARY && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SessionSummary />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}

export default App;