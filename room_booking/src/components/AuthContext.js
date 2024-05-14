import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole') || '';
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, []);

  const login = (username, email) => {
    const adminUsername = "admin"; 
    const adminEmail = "admin@gmail.com";
    let role = 'user';

    if (username === adminUsername && email === adminEmail) {
      role = 'admin';
    }

    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, isAdmin: userRole === 'admin', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};