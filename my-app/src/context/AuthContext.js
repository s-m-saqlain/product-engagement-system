import { createContext, useState, useEffect } from 'react';
import { getUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      getUser(token)
        .then((response) => setUser(response.data))
        .catch(() => {
          setToken('');
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};