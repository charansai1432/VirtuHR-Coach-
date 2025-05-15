import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentLevel: string | null;
  isSessionActive: boolean;
  signin: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  signout: () => void;
  endSession: () => Promise<void>;
  startSession: (level: string) => void; // added here for completeness
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const signin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/signin', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return true;
    } catch (error) {
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await axios.post('/api/auth/signup', { name, email, password });
      return true;
    } catch (error) {
      return false;
    }
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const endSession = async (): Promise<void> => {
    setIsSessionActive(false);
    setCurrentLevel(null);
  };

  const startSession = (level: string): void => {
    setCurrentLevel(level);
    setIsSessionActive(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        currentLevel,
        isSessionActive,
        signin,
        signup,
        signout,
        endSession,
        startSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
