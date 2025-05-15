import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Brain, Trophy, ChevronRight, LogOut, UserCircle } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
            className={`p-3 rounded-full mr-4
              ${level === 'basic' ? 'bg-blue-100 text-blue-600' : ''}
              ${level === 'intermediate' ? 'bg-purple-100 text-purple-600' : ''}
              ${level === 'advanced' ? 'bg-orange-100 text-orange-600' : ''}`}
          >
            {icon}
          </div>
          <h3
            className={`text-xl font-semibold
              ${level === 'basic' ? 'text-blue-700' : ''}
              ${level === 'intermediate' ? 'text-purple-700' : ''}
              ${level === 'advanced' ? 'text-orange-700' : ''}`}
          >
            {title}
          </h3>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
        <div
          className={`flex justify-end items-center text-sm font-medium
            ${level === 'basic' ? 'text-blue-600' : ''}
            ${level === 'intermediate' ? 'text-purple-600' : ''}
            ${level === 'advanced' ? 'text-orange-600' : ''}`}
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

  const [showProfile, setShowProfile] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/user/profile').then((res) => {
      setFormData({ name: res.data.name, email: res.data.email, password: '' });
    });
  }, []);

  const handleLevelSelect = async (level: string) => {
    await startSession(level);
  };

  const handleLogout = () => {
    signout();
    navigate('/signin');
  };

  const handleProfileToggle = () => {
    setShowProfile(!showProfile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Or however you store your JWT

      await axios.put(
        'http://localhost:5000/users/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Profile updated!');
      setShowProfile(false);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative">
      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-1 right-5 flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md z-50"
      >
        <LogOut size={20} />
        <span className="font-semibold">Logout</span>
      </motion.button>

      {/* Profile Icon */}
      <motion.button
        onClick={handleProfileToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-1 right-28 flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full shadow-md z-50"
        aria-label="Profile"
      >
        <UserCircle size={22} />
        <span className="font-semibold">Profile</span>
      </motion.button>

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="absolute top-14 right-5 bg-white shadow-lg rounded-xl p-6 w-80 z-50 border">
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password (optional)"
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </form>
        </div>
      )}

      {/* Header */}
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
          Practice your HR skills with Neha, your AI coach. Choose a difficulty level to begin.
        </p>
      </motion.div>

      {/* Difficulty Cards */}
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
