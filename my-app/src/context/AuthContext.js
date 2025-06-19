import { createContext, useState, useEffect } from 'react';
import { getUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await getUser(token);
          setUser(response.data);
        } catch (err) {
          setToken('');
          setUser(null);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};