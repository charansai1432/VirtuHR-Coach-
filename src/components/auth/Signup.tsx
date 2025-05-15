import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const success = await signup(name, email, password);
      if (success) {
        setSignupSuccess(true);
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setErrors({ form: 'Failed to create account. Email may already be in use.' });
      }
    } catch (error) {
      setErrors({ form: 'An error occurred. Please try again.' });
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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white flex flex-col justify-center items-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="bg-sky-500 text-white py-6 px-8">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-sky-100 mt-1">Join Virtual HR Coach today</p>
        </div>

        <div className="p-8">
          {signupSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-800"
            >
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              <span>Account created successfully! Redirecting to login...</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errors.form && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center text-red-800"
                >
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  <span>{errors.form}</span>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <motion.div
                    variants={inputVariants}
                    whileFocus="focus"
                    className={`relative rounded-lg border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 sm:text-sm rounded-lg bg-transparent focus:outline-none"
                      placeholder="John Doe"
                    />
                  </motion.div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <motion.div
                    variants={inputVariants}
                    whileFocus="focus"
                    className={`relative rounded-lg border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500`}
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
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <motion.div
                    variants={inputVariants}
                    whileFocus="focus"
                    className={`relative rounded-lg border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500`}
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
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <motion.div
                    variants={inputVariants}
                    whileFocus="focus"
                    className={`relative rounded-lg border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 sm:text-sm rounded-lg bg-transparent focus:outline-none"
                      placeholder="••••••"
                    />
                  </motion.div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </motion.button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-sky-600 hover:text-sky-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
