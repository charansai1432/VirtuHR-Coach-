import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronRight, Download, Home, BarChart } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { getSessionSummary } from '../services/api';
import { Session } from '../types';

const SessionSummary: React.FC = () => {
  const { currentSession, resetSession } = useSession();
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadSessionData = async () => {
      if (!currentSession) return;
      
      try {
        setLoading(true);
        const data = await getSessionSummary(currentSession._id);
        setSessionData(data);
      } catch (error) {
        console.error('Error loading session summary:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSessionData();
  }, [currentSession]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!sessionData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No session data available</p>
        <button
          onClick={resetSession}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }
  
  const { responses, level } = sessionData;
  
  const getScoreColor = (index: number) => {
    const colors = ['bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700'];
    return colors[index % colors.length];
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
          <Award size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Session Summary
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          You've completed the {level.charAt(0).toUpperCase() + level.slice(1)} level session. 
          Here's a summary of your performance.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Session Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Level</div>
              <div className="text-xl font-medium capitalize">{level}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Scenarios Completed</div>
              <div className="text-xl font-medium">{responses.length}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Date</div>
              <div className="text-xl font-medium">
                {new Date(sessionData.startTime).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Response Details
          </h3>
          <div className="space-y-6">
            {responses.map((response, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-800">
                    Scenario {index + 1}: {response.scenarioId.question}
                  </h4>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-2">Your Response:</div>
                  <p className="text-gray-700 mb-4">{response.userResponse}</p>
                  
                  <div className="text-sm font-medium text-gray-600 mb-2">Feedback:</div>
                  <div className={`p-3 rounded-lg ${getScoreColor(index)}`}>
                    {response.aiFeedback}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetSession}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
        >
          <Home size={18} className="mr-2" /> Return Home
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg shadow-sm transition-colors"
        >
          <Download size={18} className="mr-2" /> Save Report
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SessionSummary;