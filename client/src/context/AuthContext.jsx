import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const AuthContext = createContext(null);

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("kp_token")
  );

  const [admin, setAdmin] = useState(null);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    axios
      .get(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdmin(res.data);
      })
      .catch(() => {
        localStorage.removeItem("kp_token");
        setToken(null);
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(
      `${API_BASE}/auth/login`,
      {
        email,
        password,
      }
    );

    localStorage.setItem("kp_token", res.data.token);

    setToken(res.data.token);
    setAdmin(res.data.admin);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("kp_token");

    setToken(null);
    setAdmin(null);
  };

  const value = {
    token,
    admin,
    isAuthenticated: Boolean(token),
    checkingAuth,
    login,
    logout,
    apiBase: API_BASE,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return ctx;
}