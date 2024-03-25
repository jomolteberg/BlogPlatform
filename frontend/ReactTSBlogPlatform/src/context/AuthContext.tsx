import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email'); // Renamed from 'userName' to 'email' for clarity
    if (token && userEmail) {
      setEmail(userEmail);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userEmail: string, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', userEmail); // Store the user's email in localStorage under the key 'email'
    setEmail(userEmail);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email'); // Ensure we also remove the user's email from localStorage on logout
    setEmail(null);
    setIsAuthenticated(false);
  };

  const value = { email, isAuthenticated, login, logout }; // Updated to reflect the use of 'email' instead of 'user'

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

