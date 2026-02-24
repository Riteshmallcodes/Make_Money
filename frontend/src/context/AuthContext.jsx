import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../lib/api';
import { clearStoredAuth, readStoredAuth, writeStoredAuth } from '../lib/authStorage';
import { unwrapData } from '../lib/http';

const defaultAuthContext = {
  token: null,
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  setUser: () => {},
};

const AuthContext = createContext(defaultAuthContext);

function parseAuthPayload(data) {
  const source = unwrapData(data);
  return {
    token: source?.token || source?.access_token || source?.jwt || null,
    user: source?.user || source?.profile || source?.account || null,
    raw: source,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredAuth().token);
  const [user, setUserState] = useState(() => readStoredAuth().user);

  const setUser = useCallback((nextUser) => {
    setUserState(nextUser || null);
  }, []);

  const persistAuth = useCallback(
    (data) => {
      const parsed = parseAuthPayload(data);
      if (!parsed.token) {
        throw new Error(parsed.raw?.message || 'Authentication token not found in API response.');
      }

      setToken(parsed.token);
      setUser(parsed.user);
      writeStoredAuth(parsed.token, parsed.user);
      return parsed.raw;
    },
    [setUser]
  );

  const login = useCallback(async (payload) => {
    const { data } = await api.post('/login.php', payload);
    return persistAuth(data);
  }, [persistAuth]);

  const register = useCallback(async (payload) => {
    const enrichedPayload = {
      ...payload,
      referral_code: payload.referralCode || payload.referral_code || '',
    };

    const { data } = await api.post('/signup.php', enrichedPayload);
    return persistAuth(data);
  }, [persistAuth]);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout.php');
    } catch {
      // Ignore backend logout failure and clear local state.
    }
    setToken(null);
    setUser(null);
    clearStoredAuth();
  }, [setUser]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      setUser,
    }),
    [token, user, login, register, logout, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
