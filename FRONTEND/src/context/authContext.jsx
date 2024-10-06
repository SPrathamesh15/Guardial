import React, { createContext, useState, useEffect } from 'react';
import axios from '../config/axiosConfig'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const response = await axios.get('/check-auth');
          setIsLoggedIn(response.data.isAuthenticated);
          setCurrentUser(response.data.user);
        } catch (error) {
          setIsLoggedIn(false);
          setCurrentUser(null);
          setAuthToken(null); 
          localStorage.removeItem('token'); 
        }
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token); 
    setAuthToken(token); 
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token'); 
    setAuthToken(null); 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
