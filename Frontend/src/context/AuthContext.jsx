import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  // Helper to determine if user subscription has expired
  const isSubscriptionExpired = Boolean(
    user && (user.isExpired || (user.planExpiresAt && new Date(user.planExpiresAt) < new Date() && user.plan === 'free'))
  );

  // Days remaining in active subscription
  const daysRemaining = user?.planExpiresAt
    ? Math.max(0, Math.ceil((new Date(user.planExpiresAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const userData = res.data.user;
          setUser(userData);
          setIsAuthenticated(true);

          if (userData.isExpired && sessionStorage.getItem('dismissed_expired_modal') !== 'true') {
            setShowExpiredModal(true);
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);

    if (userData.isExpired && sessionStorage.getItem('dismissed_expired_modal') !== 'true') {
      setShowExpiredModal(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('dismissed_expired_modal');
    setUser(null);
    setIsAuthenticated(false);
    setShowExpiredModal(false);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/me');
        const userData = res.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));

        if (userData.isExpired && sessionStorage.getItem('dismissed_expired_modal') !== 'true') {
          setShowExpiredModal(true);
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  };

  const dismissExpiredModal = () => {
    setShowExpiredModal(false);
    sessionStorage.setItem('dismissed_expired_modal', 'true');
  };

  const openExpiredModal = () => {
    setShowExpiredModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isSubscriptionExpired,
        daysRemaining,
        showExpiredModal,
        setShowExpiredModal,
        openExpiredModal,
        dismissExpiredModal,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
