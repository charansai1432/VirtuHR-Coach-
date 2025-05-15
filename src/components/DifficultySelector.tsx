import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Brain, Trophy, ChevronRight, LogOut } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DifficultyCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  level: string;
  onClick: () => void;
}> = ({ title, description, icon, level, onClick }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer relative"
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div
            className={`
            p-3 rounded-full mr-4
            ${level === 'basic' ? 'bg-blue-100 text-blue-600' : ''}
            ${level === 'intermediate' ? 'bg-purple-100 text-purple-600' : ''}
            ${level === 'advanced' ? 'bg-orange-100 text-orange-600' : ''}
          `}
          >
            {icon}
          </div>
          <h3
            className={`
            text-xl font-semibold
            ${level === 'basic' ? 'text-blue-700' : ''}
            ${level === 'intermediate' ? 'text-purple-700' : ''}
            ${level === 'advanced' ? 'text-orange-700' : ''}
          `}
          >
            {title}
          </h3>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
        <div
          className={`
          flex justify-end items-center text-sm font-medium
          ${level === 'basic' ? 'text-blue-600' : ''}
          ${level === 'intermediate' ? 'text-purple-600' : ''}
          ${level === 'advanced' ? 'text-orange-600' : ''}
        `}
        >
          Start Session <ChevronRight size={16} className="ml-1" />
        </div>
      </div>
    </motion.div>
  );
};

const DifficultySelector: React.FC = () => {
  const { startSession } = useSession();
  const { signout } = useAuth();
  const navigate = useNavigate();

  const handleLevelSelect = async (level: string) => {
    await startSession(level);
  };

  const handleLogout = () => {
    signout();
    navigate('/signin');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative">
      {/* Logout button at top right */}
      <motion.button
  onClick={handleLogout}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  className="absolute top-2 right-6 flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2  rounded-full shadow-md focus:outline-none z-50"
  aria-label="Logout"
>
  <LogOut size={20} />
  <span className="font-semibold">Logout</span>
</motion.button>


      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Virtual HR Scenario Roleplay Coach
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Practice your HR skills with Neha, your AI coach. Choose a difficulty level to
          begin.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <DifficultyCard
          title="Basic Level"
          description="Fundamental HR scenarios for beginners. Practice essential communication and problem-solving skills."
          icon={<Briefcase size={24} />}
          level="basic"
          onClick={() => handleLevelSelect('basic')}
        />

        <DifficultyCard
          title="Intermediate Level"
          description="More complex scenarios requiring deeper analysis and thoughtful responses."
          icon={<Brain size={24} />}
          level="intermediate"
          onClick={() => handleLevelSelect('intermediate')}
        />

        <DifficultyCard
          title="Advanced Level"
          description="Challenging situations that test leadership, strategic thinking, and conflict resolution."
          icon={<Trophy size={24} />}
          level="advanced"
          onClick={() => handleLevelSelect('advanced')}
        />
      </div>
    </div>
  );
};

export default DifficultySelector;
