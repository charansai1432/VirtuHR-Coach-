import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await signin(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-50 to-white flex flex-col justify-center items-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="bg-rose-200 text-gray-900 py-8 px-8 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-rose-700 mt-2">Sign in to access your account</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center text-red-800"
              >
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <motion.div
                  variants={inputVariants}
                  whileFocus="focus"
                  className="relative rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-rose-300 focus-within:border-rose-300"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 sm:text-sm rounded-lg bg-transparent focus:outline-none"
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm text-rose-400 hover:text-rose-500">
                    Forgot password?
                  </a>
                </div>
                <motion.div
                  variants={inputVariants}
                  whileFocus="focus"
                  className="relative rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-rose-300 focus-within:border-rose-300"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 sm:text-sm rounded-lg bg-transparent focus:outline-none"
                    placeholder="••••••"
                  />
                </motion.div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-rose-400 border-gray-300 rounded focus:ring-rose-300"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-rose-400 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </motion.button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-rose-400 hover:text-rose-500">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 Virtual HR Coach. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Signin;
