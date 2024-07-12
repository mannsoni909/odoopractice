import React, { createContext, useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

// Create a context
export const AuthContext = createContext();

const EXPIRY_TIME = 24*60*60*100; // 1 day expiry

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const setWithExpiry = (key, value, ttl) => {
    const now = new Date();

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);

    // If the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // Compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  // Function to log in the user
  const login = (email) => {
    setUser(email);
    setWithExpiry('userEmail', email, EXPIRY_TIME);
  };

  // Function to log out the user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
  };

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedEmail = getWithExpiry('userEmail');
    if (savedEmail) {
      setUser(savedEmail);
    }
  }, []);

//   ///////////////////////////////////////////////



  return (
    <AuthContext.Provider value={{ user, login, logout,loading,setLoading,ClipLoader }}>
      {children}
    </AuthContext.Provider>
  );
};
